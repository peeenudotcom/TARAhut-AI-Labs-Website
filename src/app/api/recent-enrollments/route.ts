import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// Fallback cities used when a payment row doesn't carry a city of
// its own. Kotkapura leads the list because that's where the lab
// actually sits — the toast was cycling Ludhiana first, so every
// single-payment test displayed "Ludhiana" which misrepresented the
// local audience.
const FALLBACK_CITIES = [
  'Kotkapura', 'Bathinda', 'Moga', 'Ferozepur', 'Faridkot',
  'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Chandigarh',
]

function anonymizeName(fullName: string): string {
  if (!fullName) return 'Someone'
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 0) return 'Someone'
  if (parts.length === 1) return parts[0]
  return `${parts[0]} ${parts[1][0]}.`
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

// Deterministic djb2 hash so the same payment always resolves to
// the same fallback city across requests. Seeds off name +
// created_at so two payments from different students don't both
// land on index 0 (which was the original bug).
function hashSeed(seed: string): number {
  let h = 5381
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) + h + seed.charCodeAt(i)) >>> 0
  }
  return h
}

export async function GET() {
  try {
    const db = createServiceClient()
    // Pull `city` too — if the payments row carries a real city we
    // prefer that over the hashed fallback. Supabase will return
    // null on the field when the column doesn't exist or is empty.
    const { data, error } = await db
      .from('payments')
      .select('student_name, course_title, created_at, city')
      .eq('status', 'paid')
      .order('created_at', { ascending: false })
      .limit(10)

    // If the city column doesn't exist yet the query errors — retry
    // without it so the feature still works on older DB schemas.
    let rows = data
    if (error) {
      const fallback = await db
        .from('payments')
        .select('student_name, course_title, created_at')
        .eq('status', 'paid')
        .order('created_at', { ascending: false })
        .limit(10)
      if (fallback.error) throw fallback.error
      rows = fallback.data as unknown as typeof data
    }

    const enrollments = (rows || []).map((row, index) => {
      const realCity = typeof (row as { city?: unknown }).city === 'string'
        ? ((row as { city: string }).city).trim()
        : ''
      const seed = `${row.student_name ?? ''}|${row.created_at ?? index}`
      const fallbackCity = FALLBACK_CITIES[hashSeed(seed) % FALLBACK_CITIES.length]
      return {
        id: index,
        name: anonymizeName(row.student_name as string),
        city: realCity || fallbackCity,
        course: row.course_title as string,
        timeAgo: timeAgo(new Date(row.created_at as string)),
      }
    })

    return NextResponse.json({ enrollments }, {
      headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' },
    })
  } catch (error) {
    console.error('recent-enrollments error:', error)
    return NextResponse.json({ enrollments: [] })
  }
}

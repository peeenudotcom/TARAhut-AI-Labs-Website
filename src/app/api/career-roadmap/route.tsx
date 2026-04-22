import { NextResponse, type NextRequest } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { siteConfig } from '@/config/site';
import {
  AMBITION_OPTIONS,
  IDENTITY_OPTIONS,
  courseBySlug,
  flattenCourse,
  getLabel,
  getPrescription,
  parseIdentityAmbition,
} from '@/lib/career-architect/matrix';
import { RoadmapDocument } from '@/lib/pdf/roadmap-pdf';

// PDF generation needs the Node runtime — @react-pdf/renderer pulls
// in node fs/stream APIs for font fetching that Edge doesn't have.
export const runtime = 'nodejs';
// Always dynamic — the PDF is personalized per request.
export const dynamic = 'force-dynamic';

interface Payload {
  identity?: unknown;
  ambition?: unknown;
  name?: unknown;
}

function sanitizeName(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw.trim().replace(/[^\p{L}\p{N}\s.'-]/gu, '').slice(0, 60);
}

function slugifyName(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return base || 'your';
}

export async function POST(req: NextRequest) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = parseIdentityAmbition(body.identity, body.ambition);
  if (!parsed) {
    return NextResponse.json(
      { error: 'Invalid identity or ambition' },
      { status: 400 }
    );
  }
  const { identity, ambition } = parsed;
  const name = sanitizeName(body.name);

  const prescription = getPrescription(identity, ambition);
  const primary = courseBySlug(prescription.primarySlug);
  if (!primary) {
    // Matrix drift — a primary slug no longer matches a course in the
    // config. Shouldn't happen in prod (build-time test would catch
    // it), but fail loudly if it does.
    return NextResponse.json(
      { error: 'Recommendation unavailable — please try again later' },
      { status: 500 }
    );
  }
  const alternatives = prescription.alternatives
    .map((s) => courseBySlug(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const sessions = flattenCourse(primary.slug);
  const highlightedSessions = prescription.highlightedIndices
    .map((i) => sessions[i])
    .filter(Boolean);

  const domain = new URL(siteConfig.url).hostname.replace(/^www\./, '');

  const buffer = await renderToBuffer(
    <RoadmapDocument
      name={name}
      identityLabel={getLabel(IDENTITY_OPTIONS, identity)}
      ambitionLabel={getLabel(AMBITION_OPTIONS, ambition)}
      primaryCourse={primary}
      pitch={prescription.pitch}
      highlightedSessions={highlightedSessions}
      alternatives={alternatives}
      whatsapp={siteConfig.contact.phone}
      domain={domain}
    />
  );

  const filename = `tarahut-roadmap-${slugifyName(name)}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}

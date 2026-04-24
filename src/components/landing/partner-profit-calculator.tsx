'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Partner profit calculator — the prospective partner plugs in their
 * OWN assumptions (batch size, fee, rent, capex, etc.) and the page
 * derives monthly revenue, opex, net profit, break-even, and 18-month
 * ROI in real time. Nothing on screen is our projection — everything
 * is theirs to own, adjust, and send to us on WhatsApp.
 *
 * 10 inputs grouped into Revenue / Costs / Capital, 3 presets
 * (Conservative / Realistic / Ambitious), reset button, animated
 * output counter, and a "share my projection" WhatsApp capture.
 */

const MONO = 'var(--font-fira-code), ui-monospace, monospace'
const DISPLAY = 'var(--font-space-grotesk), system-ui, sans-serif'

// Royalty is flat — we set this, partner doesn't negotiate.
const ROYALTY = 20000

interface Inputs {
  studentsPerBatch: number
  batchesPerMonth: number
  avgCourseFee: number
  workshopsPerMonth: number
  workshopFee: number
  servicesRevenue: number
  rent: number
  managerSalary: number
  marketing: number
  miscBuffer: number
  capex: number
}

const PRESETS: Record<'conservative' | 'realistic' | 'ambitious', Inputs> = {
  conservative: {
    studentsPerBatch: 18,
    batchesPerMonth: 1,
    avgCourseFee: 5999,
    workshopsPerMonth: 1,
    workshopFee: 15000,
    servicesRevenue: 0,
    rent: 20000,
    managerSalary: 18000,
    marketing: 15000,
    miscBuffer: 5000,
    capex: 800000,
  },
  realistic: {
    studentsPerBatch: 20,
    batchesPerMonth: 2,
    avgCourseFee: 7999,
    workshopsPerMonth: 1,
    workshopFee: 25000,
    servicesRevenue: 20000,
    rent: 30000,
    managerSalary: 22000,
    marketing: 30000,
    miscBuffer: 8000,
    capex: 1000000,
  },
  ambitious: {
    studentsPerBatch: 25,
    batchesPerMonth: 2,
    avgCourseFee: 11999,
    workshopsPerMonth: 2,
    workshopFee: 40000,
    servicesRevenue: 50000,
    rent: 45000,
    managerSalary: 35000,
    marketing: 60000,
    miscBuffer: 12000,
    capex: 1300000,
  },
}

function rupeesFull(n: number): string {
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

// Short-form ₹ display for the hero card: ₹2.5L, ₹45L, ₹1.2Cr
function rupeesShort(n: number): string {
  const abs = Math.abs(n)
  const sign = n < 0 ? '−' : ''
  if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2).replace(/\.00$/, '')}Cr`
  if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(2).replace(/\.00$/, '')}L`
  return `${sign}₹${Math.round(abs).toLocaleString('en-IN')}`
}

// Smooth rAF-eased ramp toward the target value. Used on the hero
// net-profit readout so dragging a slider feels like a dial spinning
// rather than a hard jump.
function useEasedNumber(target: number, durationMs = 320): number {
  const [display, setDisplay] = useState(target)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const start = display
    const delta = target - start
    if (Math.abs(delta) < 0.5) {
      setDisplay(target)
      return
    }
    const startTime = performance.now()

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / durationMs, 1)
      const eased = 1 - (1 - t) * (1 - t)
      setDisplay(start + delta * eased)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // Intentionally only re-trigger on target change; display is a running state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  return display
}

// ─────────────────────────────────────────────────────────────
// Slider helper — emerald-themed, matches the other landing pages.
// ─────────────────────────────────────────────────────────────

interface SliderProps {
  label: string
  display: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}

function Slider({ label, display, value, min, max, step, onChange }: SliderProps) {
  const percent = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-xs sm:text-sm text-gray-300 font-medium">{label}</label>
        <span
          className="text-sm sm:text-base font-bold tabular-nums text-emerald-300"
          style={{ fontFamily: DISPLAY }}
        >
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer outline-none
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-emerald-400
          [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(16,185,129,0.65)]
          [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing
          [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-emerald-400 [&::-moz-range-thumb]:border-0
          [&::-moz-range-thumb]:shadow-[0_0_12px_rgba(16,185,129,0.65)]"
        style={{
          background: `linear-gradient(to right, #10b981 0%, #10b981 ${percent}%, rgba(255,255,255,0.08) ${percent}%, rgba(255,255,255,0.08) 100%)`,
        }}
      />
    </div>
  )
}

// Segmented integer picker — for counts where a slider is overkill.
function Segmented({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: number
  options: number[]
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-xs sm:text-sm text-gray-300 font-medium">{label}</label>
        <span
          className="text-sm sm:text-base font-bold tabular-nums text-emerald-300"
          style={{ fontFamily: DISPLAY }}
        >
          {value}
        </span>
      </div>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
        {options.map((n) => {
          const active = value === n
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-pressed={active}
              className="py-2 rounded-lg text-sm font-bold tabular-nums transition-colors"
              style={{
                background: active ? '#10b981' : 'rgba(255,255,255,0.03)',
                color: active ? '#020817' : 'rgba(255,255,255,0.7)',
                border: active ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                fontFamily: DISPLAY,
              }}
            >
              {n}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

export function PartnerProfitCalculator() {
  const [inputs, setInputs] = useState<Inputs>(PRESETS.realistic)
  const [activePreset, setActivePreset] = useState<keyof typeof PRESETS | 'custom'>('realistic')

  const calc = useMemo(() => {
    const enrolmentRev = inputs.studentsPerBatch * inputs.batchesPerMonth * inputs.avgCourseFee
    const workshopRev = inputs.workshopsPerMonth * inputs.workshopFee
    const servicesRev = inputs.servicesRevenue
    const totalRevenue = enrolmentRev + workshopRev + servicesRev

    const totalOpex =
      inputs.rent + inputs.managerSalary + inputs.marketing + ROYALTY + inputs.miscBuffer
    const netProfit = totalRevenue - totalOpex
    const annualNet = netProfit * 12
    const breakEvenMonths = netProfit > 0 ? Math.ceil(inputs.capex / netProfit) : null
    const roi18mo =
      inputs.capex > 0 ? Math.round(((netProfit * 18 - inputs.capex) / inputs.capex) * 100) : null

    return {
      enrolmentRev,
      workshopRev,
      servicesRev,
      totalRevenue,
      totalOpex,
      netProfit,
      annualNet,
      breakEvenMonths,
      roi18mo,
    }
  }, [inputs])

  const animatedNet = useEasedNumber(calc.netProfit)

  function update<K extends keyof Inputs>(key: K, value: number) {
    setInputs((prev) => ({ ...prev, [key]: value }))
    setActivePreset('custom')
  }

  function applyPreset(preset: keyof typeof PRESETS) {
    setInputs(PRESETS[preset])
    setActivePreset(preset)
  }

  function sendToWhatsApp() {
    const lines = [
      'Hi TARAhut! I modelled my own Partner Lab projection.',
      '',
      'MY ASSUMPTIONS',
      `• Students per batch: ${inputs.studentsPerBatch}`,
      `• Batches per month: ${inputs.batchesPerMonth}`,
      `• Avg course fee: ${rupeesFull(inputs.avgCourseFee)}`,
      `• Workshops/mo: ${inputs.workshopsPerMonth} × ${rupeesFull(inputs.workshopFee)}`,
      `• Services revenue: ${rupeesFull(inputs.servicesRevenue)}/mo`,
      `• Rent & utilities: ${rupeesFull(inputs.rent)}`,
      `• Lab manager: ${rupeesFull(inputs.managerSalary)}`,
      `• Marketing: ${rupeesFull(inputs.marketing)}`,
      `• Tech/Royalty: ${rupeesFull(ROYALTY)} (fixed)`,
      `• Misc buffer: ${rupeesFull(inputs.miscBuffer)}`,
      `• Initial capex: ${rupeesFull(inputs.capex)}`,
      '',
      'MY PROJECTION',
      `• Monthly revenue: ${rupeesFull(calc.totalRevenue)}`,
      `• Monthly opex: ${rupeesFull(calc.totalOpex)}`,
      `• Monthly net: ${rupeesFull(calc.netProfit)}`,
      `• Annual (Y1): ${rupeesFull(calc.annualNet)}`,
      calc.breakEvenMonths !== null
        ? `• Break-even: ${calc.breakEvenMonths} months`
        : '• Break-even: n/a (negative cashflow)',
      calc.roi18mo !== null ? `• ROI at 18 months: ${calc.roi18mo}%` : '• ROI at 18 months: n/a',
      '',
      "I'd like to stress-test this with your partner team. Which districts are open near me?",
    ]
    const url = `https://wa.me/919200882008?text=${encodeURIComponent(lines.join('\n'))}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const netIsPositive = calc.netProfit > 0

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
      {/* Header + preset row */}
      <div className="px-5 sm:px-6 py-5 border-b border-white/[0.06]">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white" style={{ fontFamily: DISPLAY }}>
              Model your own numbers
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Every input is yours. The output is your projection — not ours. Share it with
              our team when you want to stress-test it.
            </p>
          </div>
          <button
            type="button"
            onClick={() => applyPreset('realistic')}
            className="text-[10px] tracking-[0.22em] uppercase text-gray-500 hover:text-emerald-300 transition-colors font-bold"
            style={{ fontFamily: MONO }}
          >
            ↻ reset
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className="text-[10px] font-bold tracking-[0.22em] uppercase text-gray-500 mr-1"
            style={{ fontFamily: MONO }}
          >
            Presets
          </span>
          {(['conservative', 'realistic', 'ambitious'] as const).map((p) => {
            const active = activePreset === p
            return (
              <button
                key={p}
                type="button"
                onClick={() => applyPreset(p)}
                aria-pressed={active}
                className="px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-colors"
                style={{
                  background: active ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.03)',
                  color: active ? '#6ee7b7' : 'rgba(255,255,255,0.6)',
                  border: active
                    ? '1px solid rgba(16,185,129,0.55)'
                    : '1px solid rgba(255,255,255,0.08)',
                  fontFamily: MONO,
                }}
              >
                {p}
              </button>
            )
          })}
          {activePreset === 'custom' && (
            <span
              className="px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase text-emerald-300"
              style={{
                background: 'rgba(16,185,129,0.12)',
                border: '1px solid rgba(16,185,129,0.3)',
                fontFamily: MONO,
              }}
            >
              your model
            </span>
          )}
        </div>
      </div>

      {/* Body: inputs left, output right on lg+; stacked on mobile */}
      <div className="grid lg:grid-cols-[1fr_360px] lg:divide-x lg:divide-white/[0.06]">
        {/* Inputs */}
        <div className="px-5 sm:px-6 py-6 order-2 lg:order-1">
          {/* Revenue */}
          <section className="mb-8">
            <h4
              className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] uppercase text-emerald-400 mb-4"
              style={{ fontFamily: MONO }}
            >
              Revenue · monthly
            </h4>
            <div className="grid sm:grid-cols-2 gap-5">
              <Slider
                label="Students per batch"
                display={String(inputs.studentsPerBatch)}
                value={inputs.studentsPerBatch}
                min={10}
                max={30}
                step={1}
                onChange={(v) => update('studentsPerBatch', v)}
              />
              <Segmented
                label="Batches per month"
                value={inputs.batchesPerMonth}
                options={[1, 2, 3]}
                onChange={(v) => update('batchesPerMonth', v)}
              />
              <Slider
                label="Avg course fee"
                display={rupeesFull(inputs.avgCourseFee)}
                value={inputs.avgCourseFee}
                min={3999}
                max={14999}
                step={500}
                onChange={(v) => update('avgCourseFee', v)}
              />
              <Segmented
                label="Workshops per month"
                value={inputs.workshopsPerMonth}
                options={[0, 1, 2, 3]}
                onChange={(v) => update('workshopsPerMonth', v)}
              />
              <Slider
                label="Workshop fee"
                display={rupeesFull(inputs.workshopFee)}
                value={inputs.workshopFee}
                min={10000}
                max={50000}
                step={2500}
                onChange={(v) => update('workshopFee', v)}
              />
              <Slider
                label="Services revenue"
                display={`${rupeesFull(inputs.servicesRevenue)}/mo`}
                value={inputs.servicesRevenue}
                min={0}
                max={100000}
                step={5000}
                onChange={(v) => update('servicesRevenue', v)}
              />
            </div>
          </section>

          {/* Costs */}
          <section className="mb-8">
            <h4
              className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] uppercase text-emerald-400 mb-4"
              style={{ fontFamily: MONO }}
            >
              Costs · monthly
            </h4>
            <div className="grid sm:grid-cols-2 gap-5">
              <Slider
                label="Rent & utilities"
                display={rupeesFull(inputs.rent)}
                value={inputs.rent}
                min={15000}
                max={60000}
                step={1000}
                onChange={(v) => update('rent', v)}
              />
              <Slider
                label="Lab manager salary"
                display={rupeesFull(inputs.managerSalary)}
                value={inputs.managerSalary}
                min={15000}
                max={50000}
                step={1000}
                onChange={(v) => update('managerSalary', v)}
              />
              <Slider
                label="Marketing"
                display={rupeesFull(inputs.marketing)}
                value={inputs.marketing}
                min={10000}
                max={100000}
                step={2500}
                onChange={(v) => update('marketing', v)}
              />
              <Slider
                label="Misc buffer"
                display={rupeesFull(inputs.miscBuffer)}
                value={inputs.miscBuffer}
                min={5000}
                max={20000}
                step={1000}
                onChange={(v) => update('miscBuffer', v)}
              />
              {/* Fixed royalty row — not a slider */}
              <div className="sm:col-span-2 flex items-center justify-between px-4 py-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <div>
                  <div className="text-xs sm:text-sm text-gray-300 font-medium">
                    Technology &amp; Royalty
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5" style={{ fontFamily: MONO }}>
                    fixed · TARA bot + cloud infrastructure
                  </div>
                </div>
                <span
                  className="text-sm sm:text-base font-bold tabular-nums text-gray-400"
                  style={{ fontFamily: DISPLAY }}
                >
                  {rupeesFull(ROYALTY)}
                </span>
              </div>
            </div>
          </section>

          {/* Capital */}
          <section>
            <h4
              className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] uppercase text-emerald-400 mb-4"
              style={{ fontFamily: MONO }}
            >
              Capital · one-time
            </h4>
            <Slider
              label="Initial setup capex"
              display={rupeesFull(inputs.capex)}
              value={inputs.capex}
              min={600000}
              max={1500000}
              step={50000}
              onChange={(v) => update('capex', v)}
            />
          </section>
        </div>

        {/* Output card */}
        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-4 px-5 sm:px-6 py-6 lg:py-7">
            <div className="text-[10px] sm:text-[11px] font-bold tracking-[0.32em] uppercase text-emerald-400 mb-2"
              style={{ fontFamily: MONO }}
            >
              Your projection
            </div>
            <div className="text-[10px] text-gray-500 mb-4 tracking-wide" style={{ fontFamily: MONO }}>
              # monthly net profit
            </div>
            <motion.div
              key={calc.netProfit.toString()}
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.18 }}
              className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tabular-nums leading-none"
              style={{
                fontFamily: DISPLAY,
                color: netIsPositive ? '#6ee7b7' : '#f87171',
                textShadow: netIsPositive
                  ? '0 0 24px rgba(16,185,129,0.35)'
                  : '0 0 24px rgba(248,113,113,0.25)',
              }}
            >
              {rupeesShort(animatedNet)}
              <span className="text-base sm:text-lg text-gray-500 ml-2 font-medium">/mo</span>
            </motion.div>

            {!netIsPositive && (
              <p className="mt-3 text-[11px] text-red-400/80 leading-relaxed">
                Your inputs produce a loss — bump revenue, trim opex, or try a preset.
              </p>
            )}

            <div className="mt-6 space-y-3 pt-5 border-t border-white/[0.06]">
              <Row label="Monthly revenue" value={rupeesShort(calc.totalRevenue)} />
              <Row label="Monthly opex" value={`−${rupeesShort(calc.totalOpex)}`} muted />
              <Row
                label="Annual (Y1)"
                value={rupeesShort(calc.annualNet)}
                highlight={netIsPositive}
              />
              <Row
                label="Break-even"
                value={calc.breakEvenMonths !== null ? `${calc.breakEvenMonths} mo` : '—'}
              />
              <Row
                label="ROI at 18mo"
                value={calc.roi18mo !== null ? `${calc.roi18mo}%` : '—'}
              />
            </div>

            {/* WhatsApp share — the lead-qualification jewel */}
            <button
              type="button"
              onClick={sendToWhatsApp}
              className="mt-6 w-full py-3.5 rounded-full font-bold text-xs sm:text-sm tracking-[0.18em] uppercase text-black bg-white hover:bg-emerald-500 hover:text-white transition-colors inline-flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(16,185,129,0.2)]"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.326 0-4.48-.742-6.24-2.004l-.436-.326-2.65.889.889-2.65-.326-.436A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              Send my projection
            </button>
            <p className="mt-3 text-[10px] text-gray-500 text-center leading-relaxed" style={{ fontFamily: MONO }}>
              # opens whatsapp with your inputs + outputs pre-filled
            </p>
          </div>
        </div>
      </div>

      {/* Footer small print */}
      <div className="px-5 sm:px-6 py-3 border-t border-white/[0.06] text-center">
        <p className="text-[10px] text-gray-600 tracking-wide" style={{ fontFamily: MONO }}>
          # defaults are starting points, not guarantees · royalty fixed at {rupeesFull(ROYALTY)} · actuals vary by location
        </p>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  muted,
  highlight,
}: {
  label: string
  value: string
  muted?: boolean
  highlight?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[11px] text-gray-500 tracking-[0.22em] uppercase" style={{ fontFamily: MONO }}>
        {label}
      </span>
      <span
        className="text-sm font-bold tabular-nums"
        style={{
          fontFamily: DISPLAY,
          color: highlight ? '#6ee7b7' : muted ? 'rgba(226,232,240,0.45)' : 'rgba(226,232,240,0.95)',
        }}
      >
        {value}
      </span>
    </div>
  )
}

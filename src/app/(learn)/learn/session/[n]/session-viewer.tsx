'use client'

import { useEffect } from 'react'

export function SessionViewer({
  sessionFile,
  sessionTitle,
}: {
  sessionFile: string;
  sessionTitle: string;
}) {
  useEffect(() => {
    // Disable right-click on the wrapper
    const handler = (e: MouseEvent) => e.preventDefault()
    document.addEventListener('contextmenu', handler)

    // Disable keyboard shortcuts
    const keyHandler = (e: KeyboardEvent) => {
      if (e.ctrlKey && ['s', 'u', 'p', 'c'].includes(e.key)) e.preventDefault()
      if (e.metaKey && ['s', 'u', 'p', 'c'].includes(e.key)) e.preventDefault()
      if (e.key === 'F12') e.preventDefault()
    }
    document.addEventListener('keydown', keyHandler)

    // Disable copy
    const copyHandler = (e: ClipboardEvent) => e.preventDefault()
    document.addEventListener('copy', copyHandler)

    return () => {
      document.removeEventListener('contextmenu', handler)
      document.removeEventListener('keydown', keyHandler)
      document.removeEventListener('copy', copyHandler)
    }
  }, [])

  return (
    <div className="relative flex-1 overflow-hidden" style={{ userSelect: 'none' }}>
      {/* Watermark overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center select-none"
      >
        <p
          className="rotate-[-35deg] text-4xl font-black tracking-widest text-white/[0.04] sm:text-6xl"
          style={{ userSelect: 'none' }}
        >
          TARAhut AI Labs
        </p>
      </div>

      {/* Module iframe */}
      <iframe
        src={sessionFile}
        title={sessionTitle}
        className="h-full w-full border-0"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation"
        referrerPolicy="no-referrer"
      />
    </div>
  )
}

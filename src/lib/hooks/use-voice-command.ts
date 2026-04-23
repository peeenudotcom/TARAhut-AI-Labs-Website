'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Voice command wrapper around the browser's SpeechRecognition API.
// Returns a clean { isSupported, status, transcript, start, stop }
// surface so components don't have to touch the Web Speech API
// directly. Defaults to en-IN to bias the recogniser toward Indian
// accents — Punjab market is most of our traffic.
//
// Browser support: Chrome / Edge / Android Chrome have full
// support. Safari 14.5+ works but with quirks. Firefox doesn't.
// `isSupported` lets the caller hide the UI affordance entirely
// when the API isn't available.

export type VoiceStatus =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'success'
  | 'error';

interface UseVoiceCommandOptions {
  lang?: string;
  onTranscript?: (transcript: string) => void;
  onError?: (error: string) => void;
}

// SpeechRecognition shape — pulled from Web Speech API spec, defined
// locally so we don't need to add the `dom.speech` lib reference.
interface SRResultItem {
  transcript: string;
  confidence: number;
}
interface SRResult {
  0: SRResultItem;
  isFinal: boolean;
  length: number;
}
interface SREvent {
  results: { [key: number]: SRResult; length: number };
}
interface SRErrorEvent {
  error: string;
}
interface SRInstance {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((e: SREvent) => void) | null;
  onerror: ((e: SRErrorEvent) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}
type SRConstructor = new () => SRInstance;

function getSpeechRecognition(): SRConstructor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SRConstructor;
    webkitSpeechRecognition?: SRConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useVoiceCommand(options: UseVoiceCommandOptions = {}) {
  const { lang = 'en-IN', onTranscript, onError } = options;
  const [isSupported, setIsSupported] = useState(false);
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SRInstance | null>(null);

  // Feature-detect on mount so the caller can render the affordance
  // conditionally without flashing a "not supported" state on SSR.
  useEffect(() => {
    setIsSupported(getSpeechRecognition() !== null);
  }, []);

  const start = useCallback(() => {
    const SR = getSpeechRecognition();
    if (!SR) {
      onError?.('Voice not supported in this browser');
      setStatus('error');
      return;
    }
    // Cancel any stale instance — defensive in case the user
    // long-presses twice in quick succession.
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
    }

    const r = new SR();
    r.lang = lang;
    r.interimResults = false;
    r.continuous = false;
    r.maxAlternatives = 1;

    r.onstart = () => {
      setStatus('listening');
      setTranscript('');
      // Light haptic on devices that support it. Silent on iOS.
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(40);
        } catch {
          // ignore
        }
      }
    };

    r.onresult = (e) => {
      const text = e.results[0]?.[0]?.transcript ?? '';
      setTranscript(text);
      setStatus('processing');
      onTranscript?.(text);
      // Brief "processing" beat so the UI doesn't flash through to
      // success — gives the visual a natural rhythm.
      window.setTimeout(() => setStatus('success'), 350);
    };

    r.onerror = (e) => {
      // 'no-speech' / 'aborted' aren't really errors from the user's
      // POV — they just happened. Surface them quietly.
      const code = e.error || 'unknown';
      const benign = code === 'no-speech' || code === 'aborted';
      if (!benign) onError?.(code);
      setStatus(benign ? 'idle' : 'error');
    };

    r.onend = () => {
      // Reset to idle a beat after success/error so any final UI
      // state has time to render.
      window.setTimeout(() => {
        setStatus((s) => (s === 'listening' || s === 'processing' ? 'idle' : s));
      }, 250);
    };

    recognitionRef.current = r;
    try {
      r.start();
    } catch (err) {
      onError?.(err instanceof Error ? err.message : String(err));
      setStatus('error');
    }
  }, [lang, onTranscript, onError]);

  const stop = useCallback(() => {
    const r = recognitionRef.current;
    if (!r) return;
    try {
      r.stop();
    } catch {
      // ignore
    }
  }, []);

  // Belt-and-braces cleanup if the component unmounts mid-recognition.
  useEffect(() => {
    return () => {
      const r = recognitionRef.current;
      if (!r) return;
      try {
        r.abort();
      } catch {
        // ignore
      }
    };
  }, []);

  return { isSupported, status, transcript, start, stop, setStatus };
}

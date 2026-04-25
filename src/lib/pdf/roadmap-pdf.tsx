// Roadmap PDF — server-rendered via @react-pdf/renderer and streamed
// back from /api/career-roadmap. Visual language matches the web
// architect (emerald + space black, Space Grotesk titles) while
// staying readable on paper (generous spacing, high contrast, no
// gradients or backdrop-blur that print grey).
//
// Kept in a .tsx file so we can use the React-flavoured JSX syntax
// but the primitives here (Document, Page, View, Text) are from
// @react-pdf/renderer, not react-dom.

import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import type { Course } from '@/config/courses';
import type { FlattenedSession } from '@/lib/career-architect/matrix';

// Uses @react-pdf's built-in PDF fonts (Helvetica / Courier) rather
// than registering Space Grotesk from Google CDN. Custom fonts over
// the wire are flaky on serverless and add 400ms+ per request. The
// PDF aesthetic still lands via colour + spacing + layout.
const FONT_SANS = 'Helvetica';
const FONT_SANS_BOLD = 'Helvetica-Bold';
const FONT_MONO = 'Courier-Bold';

const EMERALD = '#10b981';
const EMERALD_DEEP = '#059669';
const INK = '#030406';
const MUTED = '#475569';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 42,
    fontFamily: FONT_SANS,
    fontSize: 10.5,
    color: INK,
    position: 'relative',
  },
  // Thin emerald rail down the left edge — signals "lab document"
  // without relying on shadow or blur.
  railBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: EMERALD_DEEP,
  },
  eyebrow: {
    fontSize: 8,
    letterSpacing: 2,
    color: EMERALD_DEEP,
    fontWeight: 700,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  brand: {
    fontFamily: FONT_SANS_BOLD,
    fontSize: 11,
    fontWeight: 700,
    color: INK,
  },
  brandDim: {
    fontFamily: FONT_SANS_BOLD,
    fontSize: 11,
    fontWeight: 500,
    color: MUTED,
  },
  h1: {
    fontFamily: FONT_SANS_BOLD,
    fontSize: 28,
    fontWeight: 700,
    color: INK,
    lineHeight: 1.15,
    marginTop: 18,
    marginBottom: 6,
  },
  meta: {
    fontSize: 11,
    color: MUTED,
    marginBottom: 20,
  },
  metaEmph: {
    color: EMERALD_DEEP,
    fontWeight: 700,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 16,
  },
  sectionLabel: {
    fontSize: 8,
    letterSpacing: 2,
    color: EMERALD_DEEP,
    fontWeight: 700,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  primaryCard: {
    backgroundColor: '#f0fdf4',
    borderLeft: `3pt solid ${EMERALD}`,
    padding: 18,
    marginBottom: 18,
  },
  primaryTitle: {
    fontFamily: FONT_SANS_BOLD,
    fontSize: 19,
    fontWeight: 700,
    color: INK,
    lineHeight: 1.2,
    marginBottom: 6,
  },
  pitch: {
    fontSize: 11,
    color: INK,
    lineHeight: 1.45,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    fontSize: 8,
    letterSpacing: 1.2,
    fontFamily: FONT_SANS,
    fontWeight: 700,
    textTransform: 'uppercase',
    color: EMERALD_DEEP,
    backgroundColor: '#ffffff',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 3,
    border: `1pt solid ${EMERALD}`,
  },
  sessionList: {
    marginTop: 4,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: '1pt solid #e2e8f0',
  },
  sessionRowLast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  sessionNum: {
    width: 40,
    fontFamily: FONT_SANS_BOLD,
    fontSize: 18,
    fontWeight: 700,
    color: EMERALD_DEEP,
  },
  sessionBody: {
    flex: 1,
  },
  sessionTag: {
    fontSize: 7,
    letterSpacing: 1.2,
    fontWeight: 700,
    color: EMERALD_DEEP,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  sessionTitle: {
    fontFamily: FONT_SANS_BOLD,
    fontSize: 12,
    fontWeight: 700,
    color: INK,
    lineHeight: 1.3,
  },
  altRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  altCard: {
    flex: 1,
    padding: 12,
    border: '1pt solid #e2e8f0',
    backgroundColor: '#ffffff',
  },
  altTitle: {
    fontFamily: FONT_SANS_BOLD,
    fontSize: 11.5,
    fontWeight: 700,
    color: INK,
    marginBottom: 4,
    lineHeight: 1.25,
  },
  altMeta: {
    fontSize: 8,
    letterSpacing: 1,
    fontWeight: 700,
    color: EMERALD_DEEP,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  altDesc: {
    fontSize: 9,
    color: MUTED,
    lineHeight: 1.4,
  },
  footerBlock: {
    marginTop: 22,
    padding: 14,
    backgroundColor: INK,
    color: '#ffffff',
  },
  footerEyebrow: {
    fontSize: 8,
    letterSpacing: 2,
    color: EMERALD,
    fontWeight: 700,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  footerTitle: {
    fontFamily: FONT_SANS_BOLD,
    fontSize: 14,
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: 4,
  },
  footerLine: {
    fontSize: 10,
    color: '#cbd5e1',
    lineHeight: 1.5,
  },
  footerEmph: {
    color: EMERALD,
    fontWeight: 700,
  },
  pageFooter: {
    position: 'absolute',
    bottom: 24,
    left: 42,
    right: 42,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: MUTED,
    letterSpacing: 1,
  },
});

interface Props {
  name: string;
  identityLabel: string;
  ambitionLabel: string;
  primaryCourse: Course;
  pitch: string;
  highlightedSessions: FlattenedSession[];
  alternatives: Course[];
  whatsapp: string; // E.164-ish for display
  domain: string;
}

export function RoadmapDocument({
  name,
  identityLabel,
  ambitionLabel,
  primaryCourse,
  pitch,
  highlightedSessions,
  alternatives,
  whatsapp,
  domain,
}: Props) {
  const totalSessions = primaryCourse.syllabus.reduce(
    (n, m) => n + m.topics.length,
    0
  );
  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Document
      author="TARAhut AI Labs"
      title={`${name || 'Your'} AI Career Roadmap`}
      subject="Custom AI career roadmap designed by TARA"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.railBar} />

        {/* Header */}
        <View style={styles.titleRow}>
          <Text style={styles.eyebrow}>&gt; TARA · Career Architect</Text>
          <Text style={styles.brandDim}>
            <Text style={styles.brand}>TARAhut</Text> AI Labs
          </Text>
        </View>

        <Text style={styles.h1}>
          {name ? `${name}'s AI Path` : 'Your AI Path'}
        </Text>
        <Text style={styles.meta}>
          Identity: <Text style={styles.metaEmph}>{identityLabel}</Text>
          {'   ·   '}
          Goal: <Text style={styles.metaEmph}>{ambitionLabel}</Text>
          {'   ·   '}
          Issued: {today}
        </Text>

        {/* Primary track */}
        <Text style={styles.sectionLabel}>
          &gt; Primary track · designed for you
        </Text>
        <View style={styles.primaryCard}>
          <Text style={styles.primaryTitle}>{primaryCourse.title}</Text>
          <Text style={styles.pitch}>{pitch}</Text>
          <View style={styles.chipRow}>
            <Text style={styles.chip}>{primaryCourse.duration}</Text>
            <Text style={styles.chip}>{primaryCourse.level}</Text>
            <Text style={styles.chip}>{totalSessions} sessions</Text>
            <Text style={styles.chip}>
              ₹{primaryCourse.price.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        {/* 3 highlighted sessions */}
        <Text style={styles.sectionLabel}>
          &gt; Start here · 3 sessions from this track
        </Text>
        <View style={styles.sessionList}>
          {highlightedSessions.map((s, i) => (
            <View
              key={s.n}
              style={
                i === highlightedSessions.length - 1
                  ? styles.sessionRowLast
                  : styles.sessionRow
              }
            >
              <Text style={styles.sessionNum}>
                {String(s.n).padStart(2, '0')}
              </Text>
              <View style={styles.sessionBody}>
                <Text style={styles.sessionTag}>{s.tag}</Text>
                <Text style={styles.sessionTitle}>{s.title}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Alternatives */}
        {alternatives.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>
              &gt; Also worth considering
            </Text>
            <View style={styles.altRow}>
              {alternatives.map((alt) => {
                const total = alt.syllabus.reduce(
                  (n, m) => n + m.topics.length,
                  0
                );
                return (
                  <View key={alt.slug} style={styles.altCard}>
                    <Text style={styles.altMeta}>
                      {alt.duration} · {total} sessions · ₹
                      {alt.price.toLocaleString('en-IN')}
                    </Text>
                    <Text style={styles.altTitle}>{alt.title}</Text>
                    <Text style={styles.altDesc}>{alt.shortDescription}</Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Next step block */}
        <View style={styles.footerBlock}>
          <Text style={styles.footerEyebrow}>&gt; Next step</Text>
          <Text style={styles.footerTitle}>
            Book a free demo session with TARA
          </Text>
          <Text style={styles.footerLine}>
            WhatsApp <Text style={styles.footerEmph}>{whatsapp}</Text> or visit{' '}
            <Text style={styles.footerEmph}>{domain}</Text> and click{' '}
            <Text style={styles.footerEmph}>Book Free Demo</Text> in the top
            nav. We&apos;ll walk through the full syllabus, batch dates, and
            payment options on the call.
          </Text>
        </View>

        {/* Page footer */}
        <View style={styles.pageFooter} fixed>
          <Text>TARAhut AI Labs · Kotkapura, Punjab</Text>
          <Text>{domain}</Text>
        </View>
      </Page>
    </Document>
  );
}

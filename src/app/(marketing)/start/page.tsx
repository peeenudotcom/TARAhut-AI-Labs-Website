import type { Metadata } from 'next';
import { CareerArchitect } from '@/components/marketing/career-architect';

export const metadata: Metadata = {
  title: 'Start Here · AI Career Architect | TARAhut AI Labs',
  description:
    'Answer 3 quick questions and let TARA design your custom AI career roadmap — free, personalized, delivered to your WhatsApp.',
};

// Standalone entry point for social-media traffic and ads. Drops
// visitors straight into the AI Career Architect with no home-page
// scroll. Same component as the home-page lead magnet.
export default function StartHerePage() {
  return <CareerArchitect />;
}

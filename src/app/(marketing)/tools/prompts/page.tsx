import type { Metadata } from 'next';
import { PromptVault } from '@/components/marketing/prompt-vault';

export const metadata: Metadata = {
  title: 'The Emerald Prompt Vault — Free Punjab-Ready AI Prompts | TARAhut',
  description:
    'Production prompts for Punjab businesses — legal notices, realtor reels, dhaba menus, mandi reports. Copy, paste, ship. Every prompt links back to the session that teaches it.',
};

export default function PromptVaultPage() {
  return <PromptVault />;
}

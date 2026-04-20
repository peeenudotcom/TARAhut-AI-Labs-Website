import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AskTara } from '@/components/chatbot/ask-tara';
import { WhatsAppButton } from '@/components/layout/whatsapp-button';
import { PageTransition } from '@/components/layout/page-transition';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16 bg-[#020617]">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <AskTara />
      <WhatsAppButton />
    </>
  );
}

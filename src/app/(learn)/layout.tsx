export default async function LearnLayout({ children }: { children: React.ReactNode }) {
  // Don't require auth here — /learn is public (free preview)
  // Individual pages handle their own auth requirements
  return (
    <div className="min-h-screen bg-[#06060e] text-[#e2e8f0]">
      {children}
    </div>
  );
}

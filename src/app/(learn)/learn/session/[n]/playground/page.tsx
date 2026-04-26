import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { createServerSupabase } from '@/lib/supabase-server';
import { getCourseConfig } from '@/config/learn-modules';
import { PlaygroundApp } from './playground-app';

interface Props {
  params: Promise<{ n: string }>;
  searchParams: Promise<{ course?: string }>;
}

const AUTHED_DAILY_CAP = 3;
const ANON_DAILY_CAP = 1;

export async function generateMetadata({ params }: Props) {
  const { n } = await params;
  return { title: `AI Playground — Session ${n}` };
}

export default async function PlaygroundPage({ params, searchParams }: Props) {
  const { n } = await params;
  const { course } = await searchParams;
  const courseId = course || 'ai-tools-mastery-beginners';
  const config = getCourseConfig(courseId);
  const sessionNum = parseInt(n, 10);
  const mod = config?.modules.find((m) => m.session === sessionNum);

  if (!config || !mod) redirect('/learn');
  if (!mod.playgroundTask) {
    // Sessions without a defined task fall back to the lesson page.
    redirect(`/learn/session/${sessionNum}${course ? `?course=${course}` : ''}`);
  }

  // Anonymous users get 1 free trial generation; signed-in students get 3 +
  // saved artifacts. Both can reach this page without redirect.
  const user = await getUser();

  let latestArtifact = null;
  let remaining: number;
  let dailyCap: number;

  if (user) {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from('learn_artifacts')
      .select('id, prompt, response, created_at')
      .eq('student_id', user.id)
      .eq('course_id', courseId)
      .eq('session_number', sessionNum)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    latestArtifact = data ?? null;

    const sinceIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('learn_artifacts')
      .select('id', { count: 'exact', head: true })
      .eq('student_id', user.id)
      .eq('course_id', courseId)
      .eq('session_number', sessionNum)
      .gte('created_at', sinceIso);

    dailyCap = AUTHED_DAILY_CAP;
    remaining = Math.max(0, dailyCap - (count ?? 0));
  } else {
    // We can't peek at the in-memory IP rate limiter from here without a
    // real call, so optimistically initialize remaining = cap. The API will
    // correct via response headers if the IP has already used its trial.
    dailyCap = ANON_DAILY_CAP;
    remaining = ANON_DAILY_CAP;
  }

  return (
    <PlaygroundApp
      sessionNumber={sessionNum}
      sessionTitle={mod.title}
      sessionDescription={mod.description}
      courseId={courseId}
      task={mod.playgroundTask!}
      initialRemaining={remaining}
      dailyCap={dailyCap}
      latestArtifact={latestArtifact}
      isAuthenticated={!!user}
    />
  );
}

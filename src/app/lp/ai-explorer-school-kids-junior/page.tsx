import { courses } from '@/config/courses';
import { schoolCourses } from '@/config/school-courses';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CourseLandingShared } from '@/components/landing/course-landing-shared';
import { CourseToolSection } from '@/components/landing/course-tool-section';

export const metadata: Metadata = {
  title: 'AI for Kids (Class 5-7) — Fun AI Learning | TARAhut AI Labs',
  description: 'A fun, hands-on AI course for Class 5-7 kids. Learn ChatGPT, Canva AI, and 10+ tools through creative projects and storytelling.',
};

export default function Page() {
  const course = courses.find((c) => c.slug === 'ai-explorer-school-kids-junior');
  const schoolCourse = schoolCourses.find((c) => c.slug === 'ai-explorer-school-kids-junior');
  if (!course) notFound();

  return (
    <CourseLandingShared
      course={course}
      theme={{
        primary: '#3b82f6',
        primaryRgb: '59,130,246',
        gradientFrom: '#60a5fa',
        gradientVia: '#3b82f6',
        gradientTo: '#0ea5e9',
      }}
      trustBadge="☀️ SUMMER SPECIAL — Limited Seats"
      hook={{
        punjabi: 'Summer holidays waste ho jayengi...',
        translation: '...ya aapka bachcha AI master ban jayega?',
      }}
      headlineWhite="Summer Special"
      headlineGradient="Gift Your Child The Future"
      subtitle="4-Week AI Summer Program · Class 5-7"
      subSubtitle="🎯 Limited to 10 seats per batch · Secure now before full"
      stats={[
        { value: 10, suffix: ' Seats', label: 'Per Batch Only' },
        { value: 4, suffix: ' Weeks', label: 'Summer Program' },
        { value: 10, suffix: '+', label: 'Fun AI Tools' },
      ]}
      audience={[
        { emoji: '👦', title: 'Curious Kids', subtitle: 'Love exploring new things' },
        { emoji: '📚', title: 'School Students', subtitle: 'Ahead of the curriculum' },
        { emoji: '🎨', title: 'Creative Minds', subtitle: 'Art, stories, imagination' },
      ]}
      audienceLabel="Perfect For"
      beforeAfter={[
        { before: '📱 Summer holidays = screen time', after: '🎨 Summer = creating with AI' },
        { before: '😴 Bored at home all day', after: '✨ Excited to attend every class' },
        { before: '🤷 No real skills to show', after: '🏆 AI projects to showcase' },
        { before: '📺 YouTube all day', after: '🚀 Building AI stories & art' },
      ]}
      differentiators={[
        { icon: '🎮', text: 'Fun & interactive' },
        { icon: '🎨', text: 'Creative projects' },
        { icon: '👨‍👩‍👧', text: 'Parent updates' },
      ]}
      learnCards={[
        { icon: '📖', title: 'AI for Storytelling', desc: 'Create amazing stories, poems, and adventures with AI' },
        { icon: '🎨', title: 'AI Art Creation', desc: 'Make beautiful drawings, illustrations, and posters with AI' },
        { icon: '🎓', title: 'Homework Helper', desc: 'Use AI to understand tough subjects and complete projects' },
        { icon: '🎮', title: 'AI Games & Quizzes', desc: 'Build fun quizzes and interactive games with AI' },
        { icon: '📝', title: 'Creative Writing', desc: 'Write essays, stories, and diary entries with AI help' },
        { icon: '🔬', title: 'Science Projects', desc: 'Explore science concepts and build cool experiments with AI' },
      ]}
      learnTitle="Fun Skills Every Kid Should Know"
      learnSubtitle="Creative Learning"
      incomePaths={[]}
      valueItems={[
        { icon: '👨‍🏫', item: 'Small Batch (Max 10 kids)', desc: 'Personal attention in every session' },
        { icon: '🎨', item: 'Creative Project Kit', desc: 'Stories, art, games to build at home' },
        { icon: '📚', item: 'Illustrated Workbook', desc: 'Age-appropriate exercises and activities' },
        { icon: '👨‍👩‍👧', item: 'Weekly Parent Updates', desc: 'See your child&apos;s progress every week' },
        { icon: '🎉', item: 'Fun Reward System', desc: 'Badges, certificates, celebration' },
        { icon: '📜', item: 'Completion Certificate', desc: 'Frame-worthy certificate for the home' },
        { icon: '🎯', item: '4 Weeks Live Classes', desc: 'Fun, interactive, hands-on learning' },
      ]}
      totalValue="₹10,000+"
      finalCtaText="Make This Summer"
      finalCtaGradient="The One That Changed Everything."
    >
      <CourseToolSection
        toolId="kids-story"
        badge="LIVE DEMO — Watch AI write for kids"
        title="Watch AI Create a"
        titleHighlight="Story for Your Kid"
        subtitle="Type any topic. AI will write a fun, educational story for a 10-year-old in seconds."
        placeholder="e.g. 'A space adventure with a talking robot'"
        examples={[
          'A brave little mouse',
          'Magic paintbrush',
          'Space adventure',
          'A friendly dragon',
        ]}
        buttonText="📖 Generate Story"
        hookTitle="Your child can create stories like this"
        hookSubtitle="every single day."
        hookCta="Enroll My Child"
        primaryColor="#3b82f6"
        primaryColorRgb="59,130,246"
        gradientFrom="#60a5fa"
        gradientTo="#0ea5e9"
      />
    </CourseLandingShared>
  );
}

import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: 5 assessments per minute per IP
    const ip = getClientIp(req);
    const { allowed } = rateLimit(`assess:${ip}`, { limit: 5, windowMs: 60_000 });
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { contact, responses } = body;

    // Validate contact
    if (!contact?.name || !contact?.email) {
      return NextResponse.json(
        { error: 'Name and email are required.' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Validate responses (should have answers for all 8 questions)
    if (!responses || typeof responses !== 'object') {
      return NextResponse.json(
        { error: 'Assessment responses are required.' },
        { status: 400 }
      );
    }

    // Validate individual answer lengths (max 500 chars each)
    for (const [key, value] of Object.entries(responses)) {
      if (typeof value === 'string' && value.length > 500) {
        return NextResponse.json(
          { error: `Answer for question ${key} is too long. Maximum 500 characters.` },
          { status: 400 }
        );
      }
    }

    const db = createServiceClient();

    // Insert assessment
    const { data: assessment, error: insertError } = await db
      .from('assessments')
      .insert({
        name: contact.name,
        email: contact.email,
        phone: contact.phone || null,
        industry: responses[1] || 'Unknown',
        team_size: responses[2] || 'Unknown',
        responses,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Assessment insert error:', insertError);
      throw new Error('Failed to save assessment');
    }

    // Generate AI report
    const reportContent = await generateReport(responses, contact.name);

    // Insert report
    const { data: report, error: reportError } = await db
      .from('assessment_reports')
      .insert({
        assessment_id: assessment.id,
        report_content: reportContent,
      })
      .select('id')
      .single();

    if (reportError) {
      console.error('Report insert error:', reportError);
      throw new Error('Failed to save report');
    }

    return NextResponse.json({ reportId: report.id });
  } catch (error) {
    console.error('Assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report. Please try again.' },
      { status: 500 }
    );
  }
}

async function generateReport(
  responses: Record<string, string>,
  name: string
) {
  const prompt = `You are an AI business automation consultant. A business owner named ${name} has completed an assessment about their business. Based on their answers, generate a personalized report.

Their answers:
- Industry: ${responses[1]}
- Team size: ${responses[2]}
- Most time-consuming department: ${responses[3]}
- Biggest daily bottleneck: ${responses[4]}
- AI experience: ${responses[5]}
- Hours spent on repetitive tasks: ${responses[6]}
- What they'd do with extra time: ${responses[7]}
- Monthly budget for tools/training: ${responses[8]}

Generate a JSON report with exactly this structure (no markdown, no code fences, just valid JSON):
{
  "recommendations": [
    {
      "title": "Short title of the automation",
      "description": "2-3 sentences explaining what this automation does and why it matters for their specific business",
      "estimated_time_saved": "X hours per week",
      "tools": ["Tool 1", "Tool 2"]
    }
  ],
  "summary": "2-3 sentence overview of the biggest opportunities for this business",
  "hindi_summary": "Same summary translated to Hindi (Devanagari script)",
  "next_step": "One specific, actionable next step they should take this week"
}

Rules:
- Generate exactly 3 recommendations, ordered by impact (highest first)
- Be specific to their industry (${responses[1]}) and bottleneck (${responses[4]})
- Use real AI tool names (ChatGPT, Claude, Zapier, Canva AI, etc.)
- Time savings should be realistic, not exaggerated
- The hindi_summary should be natural Hindi, not transliteration
- Match the budget range (${responses[8]}) when suggesting tools`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text =
    response.content[0].type === 'text' ? response.content[0].text : '';

  // Parse and validate the JSON response
  try {
    const parsed = JSON.parse(text);

    // Validate structure
    if (
      !parsed.recommendations ||
      !Array.isArray(parsed.recommendations) ||
      !parsed.summary
    ) {
      throw new Error('Invalid report structure');
    }

    return parsed;
  } catch {
    // If JSON parsing fails, return a fallback structure
    console.error('Failed to parse AI report JSON, using fallback');
    return {
      recommendations: [
        {
          title: 'AI-Powered Customer Communication',
          description: `Based on your ${responses[1]} business, automating ${responses[4].toLowerCase()} could save significant time. AI tools can handle routine communications while you focus on growth.`,
          estimated_time_saved: '5-8 hours per week',
          tools: ['ChatGPT', 'Zapier'],
        },
        {
          title: 'Content & Marketing Automation',
          description:
            'AI can generate social media posts, email campaigns, and marketing copy tailored to your business, reducing the creative bottleneck.',
          estimated_time_saved: '3-5 hours per week',
          tools: ['Canva AI', 'Claude'],
        },
        {
          title: 'Data Entry & Reporting Automation',
          description:
            'Automate repetitive data tasks and generate reports automatically, freeing your team for higher-value work.',
          estimated_time_saved: '4-6 hours per week',
          tools: ['Google Sheets AI', 'Notion AI'],
        },
      ],
      summary:
        'Your business has strong automation potential. The three recommendations above could save you 12-19 hours per week.',
      hindi_summary:
        'आपके व्यवसाय में ऑटोमेशन की अच्छी संभावना है। ऊपर दी गई तीन सिफारिशें आपको प्रति सप्ताह 12-19 घंटे बचा सकती हैं।',
      next_step:
        'Start with recommendation #1 this week. Sign up for a free ChatGPT account and try automating one repetitive task.',
    };
  }
}

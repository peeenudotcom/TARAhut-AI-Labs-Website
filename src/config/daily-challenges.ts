export interface DailyChallenge {
  session: number;
  title: string;
  challenge: string;
  tool: string;
  timeEstimate: string;
}

export const dailyChallenges: DailyChallenge[] = [
  { session: 1, title: 'First AI Conversation', challenge: 'Use ChatGPT to explain your job/studies to a 5-year-old. Screenshot the result.', tool: 'ChatGPT', timeEstimate: '5 min' },
  { session: 2, title: 'AI Ethics Finder', challenge: 'Find one news article about AI being used wrongly in India. Write 2 sentences about what went wrong.', tool: 'Perplexity', timeEstimate: '10 min' },
  { session: 3, title: 'Prompt Upgrade', challenge: 'Take any email you sent this week. Rewrite it using the RCTF framework with Claude. Compare both.', tool: 'Claude', timeEstimate: '10 min' },
  { session: 4, title: 'Prompt Library Entry', challenge: 'Add 5 new prompts to your prompt library from real problems you faced today.', tool: 'Any', timeEstimate: '15 min' },
  { session: 5, title: 'Tool Comparison', challenge: 'Ask ChatGPT and Claude the same question about your field. Note 3 differences in their answers.', tool: 'ChatGPT + Claude', timeEstimate: '10 min' },
  { session: 6, title: 'Professional Writing', challenge: 'Use AI to rewrite your LinkedIn headline and summary. Post the update.', tool: 'ChatGPT', timeEstimate: '15 min' },
  { session: 7, title: 'Research Sprint', challenge: 'Use Perplexity to research a business idea. Create a 1-page summary with sources.', tool: 'Perplexity', timeEstimate: '15 min' },
  { session: 8, title: 'Presentation Builder', challenge: 'Create a 5-slide presentation about your favourite hobby using Gamma. Share it.', tool: 'Gamma', timeEstimate: '15 min' },
  { session: 9, title: 'Image Creator', challenge: 'Generate 5 social media post images for a local Kotkapura business using Canva AI.', tool: 'Canva AI', timeEstimate: '15 min' },
  { session: 10, title: 'Video Producer', challenge: 'Create a 30-second welcome video for a fictional business using HeyGen.', tool: 'HeyGen', timeEstimate: '20 min' },
  { session: 11, title: 'Content Machine', challenge: 'Plan a full week of Instagram content for a brand. Write all 7 captions with AI.', tool: 'ChatGPT + Canva', timeEstimate: '20 min' },
  { session: 12, title: 'Brand Builder', challenge: "Create a complete brand kit (logo concept + 3 social posts + 1 video script) for a friend's business.", tool: 'All tools', timeEstimate: '30 min' },
  { session: 13, title: 'Website Builder', challenge: 'Build a simple landing page for your AI services using Bolt.new. Deploy it live.', tool: 'Bolt.new', timeEstimate: '20 min' },
  { session: 14, title: 'Client Pitch', challenge: 'Write a proposal for a real local business offering AI content services. Include pricing.', tool: 'Claude', timeEstimate: '20 min' },
  { session: 15, title: 'Portfolio Polish', challenge: 'Add your 3 best projects to your portfolio website. Write case studies for each.', tool: 'Bolt.new', timeEstimate: '30 min' },
  { session: 16, title: 'First Gig', challenge: 'Create and publish a Fiverr gig for one AI service you can deliver today.', tool: 'Fiverr + ChatGPT', timeEstimate: '30 min' },
];

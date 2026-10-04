import axios from 'axios';

type AIRequest = {
  question: string;
  imageUrl?: string | null;
  subject?: string | null;
  topic?: string | null;
  mode?: 'explain' | 'step' | 'hint';
  maxTokens?: number;
};

export async function callAI(req: AIRequest, signal?: AbortSignal) {
  const API_KEY = process.env.AI_API_KEY;
  const PROVIDER = process.env.AI_API_PROVIDER || 'openai';
  if (!API_KEY) throw new Error('Missing AI_API_KEY');

  if (PROVIDER === 'openai') {
    const payload = {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are CHALLENGER assistant — explain concepts for school students in beginner-friendly steps. Provide steps, hints, related topics and resources when available.'
        },
        { role: 'user', content: JSON.stringify(req) }
      ],
      max_tokens: req.maxTokens ?? 800,
      temperature: 0.2
    };

    const resp = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      signal
    });

    const content = resp?.data?.choices?.[0]?.message?.content ?? '';
    // Basic parse attempt: expect JSON
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch {
      // Return naive structure
      return {
        answer: content,
        steps: [],
        hint: '',
        concept: '',
        practiceQuestions: [],
        relatedResources: []
      };
    }
  }

  // Fallback simple call to other providers
  throw new Error('Unsupported AI provider configured');
}

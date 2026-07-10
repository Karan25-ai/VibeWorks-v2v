import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { SAFIENT_SYSTEM_PROMPT } from '../../../lib/prompt';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SAFIENT_SYSTEM_PROMPT },
        { role: 'user', content: `Here is my situation: "${message}". Guide me.` }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0].message.content;
    const parsed = JSON.parse(responseContent || '{}');

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to process safety check' },
      { status: 500 }
    );
  }
}
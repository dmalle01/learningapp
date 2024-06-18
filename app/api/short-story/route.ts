import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get('word');

  if (!word) {
    return NextResponse.json({ error: 'Invalid word parameter' }, { status: 400 });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `Write a 20-word short story for kids using the word "${word}".` }
        ],
        max_tokens: 50,
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      return NextResponse.json({ story: data.choices[0].message.content.trim() });
    } else {
      console.error('OpenAI API error:', data);
      return NextResponse.json({ error: 'Failed to fetch story' }, { status: 500 });
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch story' }, { status: 500 });
  }
}
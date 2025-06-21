import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GROQ_API_KEY env var' });
  }

  const systemPrompt = `You are a pixel avatar generator for a 16x24 grid. Palette indices are: 0 transparent, 1 skin, 2 hair, 3 outfit primary, 4 outfit secondary, 5 outfit accent, 6 eye, 7 mouth. Respond ONLY with a 384-character string (16*24) of hex digits 0-7 representing palette index for each pixel row-major.`;

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 400,
        temperature: 0.4
      })
    });

    const data = await groqRes.json();
    const content = data?.choices?.[0]?.message?.content?.trim();
    console.log('Groq raw content:', content);

    if (!content || content.length < 384) {
      return res.status(500).json({ error: 'Invalid response from model', raw: content });
    }

    // Keep only hex digits
    const cleanedRaw = content.replace(/[^0-9a-fA-F]/g, '').toLowerCase();
    const mapped = cleanedRaw.split('').map(ch => ('01234567'.includes(ch) ? ch : '7')).join('');
    let cleaned = mapped.slice(0, 384);
    // Pad with 0 if too short
    while (cleaned.length < 384) cleaned += '0';

    if (cleaned.length !== 384) {
      return res.status(500).json({ error: 'Model response not the right length', raw: content, cleaned });
    }

    res.status(200).json({ hex: cleaned });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Groq API error' });
  }
} 
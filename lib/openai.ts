const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

export const generatePodcastScript = async (topic: string, duration: number = 5) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a professional podcast script writer. Create engaging, conversational podcast scripts that sound natural when spoken aloud.`
          },
          {
            role: 'user',
            content: `Write a ${duration}-minute podcast script about "${topic}". Include:
            - Engaging introduction
            - 3-4 main points with examples
            - Natural transitions
            - Compelling conclusion
            - Conversational tone
            
            Format as a single speaker monologue. Keep it engaging and informative.`
          }
        ],
        max_tokens: duration * 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate script');
    }

    const data = await response.json();
    return { 
      success: true, 
      script: data.choices[0].message.content 
    };
  } catch (error) {
    console.error('Error generating script:', error);
    return { success: false, error };
  }
};
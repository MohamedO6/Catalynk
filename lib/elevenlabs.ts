const ELEVENLABS_API_KEY = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;

export const generateVoiceover = async (text: string, voiceId: string = 'pNInz6obpgDQGcFmaJgB') => {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY || '',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate voiceover');
    }

    const audioBlob = await response.blob();
    return { success: true, audioBlob };
  } catch (error) {
    console.error('Error generating voiceover:', error);
    return { success: false, error };
  }
};

export const getAvailableVoices = async () => {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch voices');
    }

    const data = await response.json();
    return { success: true, voices: data.voices };
  } catch (error) {
    console.error('Error fetching voices:', error);
    return { success: false, error };
  }
};
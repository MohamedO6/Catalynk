const TAVUS_API_KEY = process.env.EXPO_PUBLIC_TAVUS_API_KEY;

export const generatePersonalizedVideo = async (
  templateId: string,
  personalizations: Record<string, string>
) => {
  try {
    const response = await fetch('https://tavusapi.com/v2/videos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': TAVUS_API_KEY || '',
      },
      body: JSON.stringify({
        replica_id: templateId,
        script: personalizations.script || '',
        background_url: personalizations.background_url,
        variables: personalizations,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate video');
    }

    const data = await response.json();
    return { success: true, video: data };
  } catch (error) {
    console.error('Error generating video:', error);
    return { success: false, error };
  }
};

export const getVideoStatus = async (videoId: string) => {
  try {
    const response = await fetch(`https://tavusapi.com/v2/videos/${videoId}`, {
      headers: {
        'x-api-key': TAVUS_API_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get video status');
    }

    const data = await response.json();
    return { success: true, video: data };
  } catch (error) {
    console.error('Error getting video status:', error);
    return { success: false, error };
  }
};
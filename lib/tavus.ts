const TAVUS_API_KEY = process.env.EXPO_PUBLIC_TAVUS_API_KEY;

export const generatePodcastVideo = async (
  script: string,
  avatarId: string = 'default'
) => {
  try {
    const response = await fetch('https://tavusapi.com/v2/videos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': TAVUS_API_KEY || '',
      },
      body: JSON.stringify({
        replica_id: avatarId,
        script: script,
        background_url: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
        variables: {
          podcast_title: 'PodSnap Episode',
        },
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
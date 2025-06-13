const ENTRI_API_KEY = process.env.EXPO_PUBLIC_ENTRI_API_KEY;

export const createPodcastDomain = async (
  username: string,
  podcastTitle: string
) => {
  try {
    const domain = `${username.toLowerCase()}.mypodsnap.tech`;
    
    const response = {
      success: true,
      domain,
      status: 'pending',
      dns_records: [
        {
          type: 'CNAME',
          name: username.toLowerCase(),
          value: 'podsnap.netlify.app'
        }
      ]
    };

    return response;
  } catch (error) {
    console.error('Error creating domain:', error);
    return { success: false, error };
  }
};
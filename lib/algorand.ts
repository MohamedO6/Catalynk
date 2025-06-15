import algosdk from 'algosdk';

const algodToken = '';
const algodServer = process.env.EXPO_PUBLIC_ALGORAND_NODE_URL || 'https://testnet-api.algonode.cloud';
const algodPort = '';

export const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

export const mintPodcastNFT = async (
  creatorAddress: string,
  podcastTitle: string,
  podcastDescription: string,
  audioUrl: string,
  videoUrl?: string
) => {
  try {
    const metadata = {
      name: podcastTitle,
      description: podcastDescription,
      image: videoUrl || audioUrl,
      properties: {
        type: 'podcast',
        audio_url: audioUrl,
        video_url: videoUrl,
        created_at: new Date().toISOString(),
        platform: 'PodSnap'
      }
    };

    const nftId = `nft_${Date.now()}`;
    
    return {
      success: true,
      nftId,
      transactionId: `txn_${Date.now()}`,
      metadata
    };
  } catch (error) {
    console.error('Error minting NFT:', error);
    return { success: false, error };
  }
};
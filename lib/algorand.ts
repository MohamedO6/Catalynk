import algosdk from 'algorand-algosdk';

const algodToken = '';
const algodServer = process.env.EXPO_PUBLIC_ALGORAND_NODE_URL || 'https://testnet-api.algonode.cloud';
const algodPort = '';

const indexerToken = '';
const indexerServer = process.env.EXPO_PUBLIC_ALGORAND_INDEXER_URL || 'https://testnet-idx.algonode.cloud';
const indexerPort = '';

// Validate URLs before creating clients
try {
  new URL(algodServer);
  new URL(indexerServer);
} catch (error) {
  console.error('Invalid Algorand URL configuration:', error);
  throw new Error('Invalid Algorand URL configuration. Please check your environment variables.');
}

export const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
export const indexerClient = new algosdk.Indexer(indexerToken, indexerServer, indexerPort);

// Smart contract for escrow functionality
export const createEscrowContract = async (
  founderAddress: string,
  investorAddress: string,
  amount: number,
  projectId: string
) => {
  try {
    // This would create a smart contract for escrow
    // For MVP, we'll simulate the contract creation
    const escrowContract = {
      id: `escrow_${projectId}_${Date.now()}`,
      founder: founderAddress,
      investor: investorAddress,
      amount,
      projectId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    return { success: true, contract: escrowContract };
  } catch (error) {
    console.error('Error creating escrow contract:', error);
    return { success: false, error };
  }
};

export const releaseEscrowFunds = async (contractId: string) => {
  try {
    // This would release funds from the escrow contract
    return { success: true, message: 'Funds released successfully' };
  } catch (error) {
    console.error('Error releasing escrow funds:', error);
    return { success: false, error };
  }
};

export const getAccountBalance = async (address: string) => {
  try {
    const accountInfo = await algodClient.accountInformation(address).do();
    return accountInfo.amount / 1000000; // Convert microAlgos to Algos
  } catch (error) {
    console.error('Error fetching account balance:', error);
    return 0;
  }
};
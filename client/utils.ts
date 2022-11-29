import {Connection, Keypair, LAMPORTS_PER_SOL, PublicKey} from '@solana/web3.js';
import {decode} from 'bs58';

export const initKeyPair = (secret: string) => Keypair.fromSecretKey(decode(secret));

export const airdrop = async (connection: Connection, pubkey: PublicKey, lamports = 10 * LAMPORTS_PER_SOL) => {
  const airdropSignature = await connection.requestAirdrop(pubkey, lamports);
  const latestBlockHash = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature
  });
};

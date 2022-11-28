import {readFileSync} from 'fs';

import {clusterApiUrl, Connection, Keypair} from '@solana/web3.js';

import {createToken} from './token';

const initKeyPair = () => {
  const secretPath = process.env.SECRET_PATH;
  if (!secretPath) throw Error('missing SECRET_PATH');
  return Keypair.fromSecretKey(Buffer.from(JSON.parse(readFileSync(secretPath).toString())));
};

const main = async () => {
  const accountKeyPair = initKeyPair();

  const connection = new Connection(clusterApiUrl('testnet'));

  const tokenMOVE = await createToken(connection, accountKeyPair, 8, 1e8 * 1_000);
  console.log(`Token Mint Dashboard Url: https://explorer.solana.com/address/${tokenMOVE}?cluster=testnet`);
};

main().catch(console.error);

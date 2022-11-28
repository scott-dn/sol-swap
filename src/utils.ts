import {readFileSync} from 'fs';

import {Keypair} from '@solana/web3.js';

export const initKeyPair = () => {
  const secretPath = process.env.SECRET_PATH;
  if (!secretPath) throw Error('missing SECRET_PATH');
  return Keypair.fromSecretKey(Buffer.from(JSON.parse(readFileSync(secretPath).toString())));
};

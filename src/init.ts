import {readFileSync} from 'fs';

import {createMint, getOrCreateAssociatedTokenAccount, mintTo} from '@solana/spl-token';
import {clusterApiUrl, Connection, Keypair} from '@solana/web3.js';

/*
 * Token mint: CQb2zGjMghBZauF35NF6RyJtR2Cd6n5ZkZEWpJZSfFvw
 * Authority: 3LFR2aVZP7YiGaTDtD8KC6deFqu8WZdCeBvK6FB1CXiu
 *
 */

const createToken = async (secret: Uint8Array) => {
  const connection = new Connection(clusterApiUrl('testnet'));

  const accountKeyPair = Keypair.fromSeed(secret);

  const tokenMint = await createMint(connection, accountKeyPair, accountKeyPair.publicKey, null, 8);

  console.log(`Token Mint Dashboard Url: https://explorer.solana.com/address/${tokenMint}?cluster=testnet`);

  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    accountKeyPair,
    tokenMint,
    accountKeyPair.publicKey
  );

  await mintTo(connection, accountKeyPair, tokenMint, tokenAccount.address, accountKeyPair, 10 * 1e8);
};

const secretPath = process.env.SECRET_PATH;
if (!secretPath) throw Error('missing SECRET_PATH');

createToken(Buffer.from(JSON.parse(readFileSync(secretPath).toString()).slice(0, 32))).catch(console.error);

import {createMint, getOrCreateAssociatedTokenAccount, mintTo} from '@solana/spl-token';
import {Connection, Keypair} from '@solana/web3.js';

export const createToken = async (
  connection: Connection,
  accountKeyPair: Keypair,
  decimals = 8,
  initialTokenAmount = 0
) => {
  const tokenMint = await createMint(connection, accountKeyPair, accountKeyPair.publicKey, null, decimals);

  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    accountKeyPair,
    tokenMint,
    accountKeyPair.publicKey
  );

  if (initialTokenAmount > 0)
    await mintTo(connection, accountKeyPair, tokenMint, tokenAccount.address, accountKeyPair, initialTokenAmount);

  return tokenMint;
};

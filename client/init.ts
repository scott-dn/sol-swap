import {
  AccountLayout,
  createInitializeAccountInstruction,
  createInitializeMintInstruction,
  MintLayout,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction
} from '@solana/web3.js';

import {RPC_URL} from './constant';
import {initKeyPair} from './utils';

(async (
  connection: Connection,
  // AzzJswijjWLa9uRHYUWanEv99N1qHyG75DY6pE71QoW6
  payer: Keypair,
  // 7gJu2q8tQFQi4NLuAvYamvjJABnv6vFqZgA91Ht4ET8J
  receiver: Keypair,
  // 6xarv16f8HkenQHVR8mTyafQroPJoJ3QzLV5FsDggbxZ
  tokenMove: Keypair,
  // HymQQ1QnNeu4QGyVSMRG2WoMYvhfz2upFd5Sgpy8fjmC
  sourceTokenAccount: Keypair,
  // 62kczpMYMGgbid8HhFWihm2x2crSShNp2qkaD5oxC7NL
  destinationTokenAccount: Keypair
) => {
  const airdropSignature = await connection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL);
  const latestBlockHash = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature
  });

  const [mintRentRequire, tokenRentRequire] = await Promise.all([
    connection.getMinimumBalanceForRentExemption(MintLayout.span),
    connection.getMinimumBalanceForRentExemption(AccountLayout.span)
  ]);

  const createTokenMoveAccountIx = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: tokenMove.publicKey,
    lamports: mintRentRequire,
    programId: TOKEN_PROGRAM_ID,
    space: MintLayout.span
  });

  const initTokenMoveIx = createInitializeMintInstruction(tokenMove.publicKey, 8, payer.publicKey, null);

  const createSourceTokenMoveIx = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: sourceTokenAccount.publicKey,
    lamports: tokenRentRequire,
    programId: TOKEN_PROGRAM_ID,
    space: AccountLayout.span
  });

  const createDestinationTokenMoveIx = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: destinationTokenAccount.publicKey,
    lamports: tokenRentRequire,
    programId: TOKEN_PROGRAM_ID,
    space: AccountLayout.span
  });

  const initSourceTokenMoveIx = createInitializeAccountInstruction(
    sourceTokenAccount.publicKey,
    tokenMove.publicKey,
    payer.publicKey
  );

  const initDestinationTokenMoveIx = createInitializeAccountInstruction(
    destinationTokenAccount.publicKey,
    tokenMove.publicKey,
    receiver.publicKey
  );

  await sendAndConfirmTransaction(
    connection,
    new Transaction().add(
      createTokenMoveAccountIx,
      initTokenMoveIx,
      createSourceTokenMoveIx,
      createDestinationTokenMoveIx,
      initSourceTokenMoveIx,
      initDestinationTokenMoveIx
    ),
    [payer, tokenMove, sourceTokenAccount, destinationTokenAccount]
  );
})(
  new Connection(RPC_URL, 'confirmed'),
  initKeyPair('4X5LLq9eDCZW5H8RgC2b2jkkSFjeyUYRCkVPZaR9CaXN6GHQD5uPi3TMwsh2bMnr81UVkZ8DdqV3BCRGMczQxVNE'),
  initKeyPair('f2NnEx73W9byyRSbo8pym1HMqzKJLEJ78TYptnBQT83dhCyjsg18QtMouT1m18eaFGoVd2J1KH6pfXLK7rK4f6v'),
  initKeyPair('4XQKMSBH9XpmYvDQ7v9oUSg5NNSbZaBoDvmJ4TbYfykopDDJiRRMsJgXxPMJyTXcr5phZxXxjNrS8qXqF3EFjckm'),
  initKeyPair('3iWXY1U7o88mnXnERvhS9CsC52oLDpKQ4YP6G8DVHmxjkG6PMJq4UCvKUK9LzMkJifZfh9WdjP121eGuPcvrxdgW'),
  initKeyPair('dseSB2uD62Rv8TGe7hKRsYAWWvDK9PvoV8gLtJW9kPErA2KNRUwAEqwz6nBjErPJDKuA7QxfDdZjmdNGZqEeGsE')
).catch(console.error);

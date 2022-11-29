import {
  AccountLayout,
  createInitializeAccountInstruction,
  createInitializeMintInstruction,
  createSyncNativeInstruction,
  getOrCreateAssociatedTokenAccount,
  MintLayout,
  NATIVE_MINT,
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
import {airdrop, initKeyPair} from './utils';

(async (
  connection: Connection,
  // AzzJswijjWLa9uRHYUWanEv99N1qHyG75DY6pE71QoW6
  payerAndTokenMoveOwner: Keypair,
  // 7gJu2q8tQFQi4NLuAvYamvjJABnv6vFqZgA91Ht4ET8J
  tokenMove: Keypair,
  // 6xarv16f8HkenQHVR8mTyafQroPJoJ3QzLV5FsDggbxZ
  tokenMoveAccount: Keypair,
  // HymQQ1QnNeu4QGyVSMRG2WoMYvhfz2upFd5Sgpy8fjmC
  tokenMoveAccountOwner: Keypair,
  // 3MZzy83uB2WeME3TsB4fm313q9hZpGLg8rWkzRRCepaq
  tokenWSOLAccountOwner: Keypair
) => {
  await Promise.all(
    [payerAndTokenMoveOwner, tokenMoveAccountOwner, tokenWSOLAccountOwner].map(k => airdrop(connection, k.publicKey))
  );

  const [mintRentRequire, tokenRentRequire] = await Promise.all([
    connection.getMinimumBalanceForRentExemption(MintLayout.span),
    connection.getMinimumBalanceForRentExemption(AccountLayout.span)
  ]);

  const createTokenMoveIx = SystemProgram.createAccount({
    fromPubkey: payerAndTokenMoveOwner.publicKey,
    newAccountPubkey: tokenMove.publicKey,
    lamports: mintRentRequire,
    programId: TOKEN_PROGRAM_ID,
    space: MintLayout.span
  });

  const initTokenMoveIx = createInitializeMintInstruction(
    tokenMove.publicKey,
    9,
    payerAndTokenMoveOwner.publicKey,
    null
  );

  const createTokenMoveAccountIx = SystemProgram.createAccount({
    fromPubkey: payerAndTokenMoveOwner.publicKey,
    newAccountPubkey: tokenMoveAccount.publicKey,
    lamports: tokenRentRequire,
    programId: TOKEN_PROGRAM_ID,
    space: AccountLayout.span
  });

  const initTokenMoveAccountIx = createInitializeAccountInstruction(
    tokenMoveAccount.publicKey,
    tokenMove.publicKey,
    tokenMoveAccountOwner.publicKey
  );

  const tokenWSOLAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payerAndTokenMoveOwner,
    NATIVE_MINT,
    tokenWSOLAccountOwner.publicKey
  );

  await sendAndConfirmTransaction(
    connection,
    new Transaction().add(
      createTokenMoveIx,
      initTokenMoveIx,
      createTokenMoveAccountIx,
      initTokenMoveAccountIx,
      SystemProgram.transfer({
        fromPubkey: tokenWSOLAccountOwner.publicKey,
        toPubkey: tokenWSOLAccount.address,
        lamports: 10 * LAMPORTS_PER_SOL
      }),
      createSyncNativeInstruction(tokenWSOLAccount.address)
    ),
    [payerAndTokenMoveOwner, tokenMove, tokenMoveAccount, tokenWSOLAccountOwner]
  );
})(
  new Connection(RPC_URL, 'confirmed'),
  initKeyPair('4X5LLq9eDCZW5H8RgC2b2jkkSFjeyUYRCkVPZaR9CaXN6GHQD5uPi3TMwsh2bMnr81UVkZ8DdqV3BCRGMczQxVNE'),
  initKeyPair('f2NnEx73W9byyRSbo8pym1HMqzKJLEJ78TYptnBQT83dhCyjsg18QtMouT1m18eaFGoVd2J1KH6pfXLK7rK4f6v'),
  initKeyPair('4XQKMSBH9XpmYvDQ7v9oUSg5NNSbZaBoDvmJ4TbYfykopDDJiRRMsJgXxPMJyTXcr5phZxXxjNrS8qXqF3EFjckm'),
  initKeyPair('3iWXY1U7o88mnXnERvhS9CsC52oLDpKQ4YP6G8DVHmxjkG6PMJq4UCvKUK9LzMkJifZfh9WdjP121eGuPcvrxdgW'),
  initKeyPair('4JxDGEthPfaDoTGfJPXEWhncSFceovumyoYoUq1vT3qeUKr1F6DcYgPu9JpapKuRoEQJ3eM9Tb544LM6TSmfm2Eh')
).catch(console.error);

import {Connection, PublicKey, sendAndConfirmTransaction, Transaction, TransactionInstruction} from '@solana/web3.js';

import {RPC_URL} from './constant';
import {initKeyPair} from './utils';

const main = async () => {
  const programId = process.env.PROGRAM_ID;
  if (!programId) throw Error('missing PROGRAM_ID');

  const accountKeyPair = initKeyPair();

  const connection = new Connection(RPC_URL);

  const transaction = new Transaction().add(
    new TransactionInstruction({
      keys: [{pubkey: accountKeyPair.publicKey, isSigner: false, isWritable: false}],
      programId: new PublicKey(programId)
    })
  );

  await sendAndConfirmTransaction(connection, transaction, [accountKeyPair]);
};

main().catch(console.error);

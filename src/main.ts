import {Connection, PublicKey, sendAndConfirmTransaction, Transaction, TransactionInstruction} from '@solana/web3.js';

import {RPC_URL} from './constant';
import {initKeyPair} from './utils';

const main = async () => {
  const accountKeyPair = initKeyPair();

  const connection = new Connection(RPC_URL);

  const transaction = new Transaction().add(
    new TransactionInstruction({
      keys: [{pubkey: accountKeyPair.publicKey, isSigner: false, isWritable: false}],
      programId: new PublicKey('6DaDj8g2hhQhxgHThfkHCkEdoZXQBVHRuJV9Y8jKmvSA')
    })
  );
  await sendAndConfirmTransaction(connection, transaction, [accountKeyPair]);
};

main().catch(console.error);

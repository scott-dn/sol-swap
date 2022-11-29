import {getAccount, getMint, getOrCreateAssociatedTokenAccount, NATIVE_MINT} from '@solana/spl-token';
import {Connection, PublicKey} from '@solana/web3.js';

import {RPC_URL} from '../client/constant';
import {swap} from '../client/swap';
import {initKeyPair} from '../client/utils';

const connection = new Connection(RPC_URL, 'confirmed');
const payerAndTokenMoveOwner = initKeyPair(
  '4X5LLq9eDCZW5H8RgC2b2jkkSFjeyUYRCkVPZaR9CaXN6GHQD5uPi3TMwsh2bMnr81UVkZ8DdqV3BCRGMczQxVNE'
);
const tokenMove = initKeyPair(
  'f2NnEx73W9byyRSbo8pym1HMqzKJLEJ78TYptnBQT83dhCyjsg18QtMouT1m18eaFGoVd2J1KH6pfXLK7rK4f6v'
);
const tokenMoveAccount = initKeyPair(
  '4XQKMSBH9XpmYvDQ7v9oUSg5NNSbZaBoDvmJ4TbYfykopDDJiRRMsJgXxPMJyTXcr5phZxXxjNrS8qXqF3EFjckm'
);
const tokenMoveAccountOwner = initKeyPair(
  '3iWXY1U7o88mnXnERvhS9CsC52oLDpKQ4YP6G8DVHmxjkG6PMJq4UCvKUK9LzMkJifZfh9WdjP121eGuPcvrxdgW'
);
const tokenWSOLAccountOwner = initKeyPair(
  '4JxDGEthPfaDoTGfJPXEWhncSFceovumyoYoUq1vT3qeUKr1F6DcYgPu9JpapKuRoEQJ3eM9Tb544LM6TSmfm2Eh'
);

describe('Swap', () => {
  test('verify', async () => {
    const [sourceTokenWSOLAccount, destinationTokenWSOLAccount] = await Promise.all([
      getOrCreateAssociatedTokenAccount(
        connection,
        payerAndTokenMoveOwner,
        NATIVE_MINT,
        tokenWSOLAccountOwner.publicKey
      ),
      getOrCreateAssociatedTokenAccount(
        connection,
        payerAndTokenMoveOwner,
        NATIVE_MINT,
        payerAndTokenMoveOwner.publicKey
      )
    ]);
    await swap(
      connection,
      payerAndTokenMoveOwner,
      tokenMove,
      tokenMoveAccount,
      tokenMoveAccountOwner,
      tokenWSOLAccountOwner,
      new PublicKey(process.env.PROGRAM_ID || '')
    );
    const [mintInfo, moveAccount, srcAccount, desAccount] = await Promise.all([
      getMint(connection, tokenMove.publicKey),
      getAccount(connection, tokenMoveAccount.publicKey),
      getAccount(connection, sourceTokenWSOLAccount.address),
      getAccount(connection, destinationTokenWSOLAccount.address)
    ]);
    expect(mintInfo.supply).toEqual(BigInt(10 * 1e9));
    expect(moveAccount.amount).toEqual(BigInt(10 * 1e9));
    expect(srcAccount.amount).toEqual(BigInt(9 * 1e9));
    expect(desAccount.amount).toEqual(BigInt(1 * 1e9));
  });
});

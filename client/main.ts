import {Connection, Keypair, PublicKey} from '@solana/web3.js';

import {RPC_URL} from './constant';
import {swap} from './swap';
import {initKeyPair} from './utils';

((
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
  tokenWSOLAccountOwner: Keypair,
  swapProgramId: PublicKey
) =>
  swap(
    connection,
    payerAndTokenMoveOwner,
    tokenMove,
    tokenMoveAccount,
    tokenMoveAccountOwner,
    tokenWSOLAccountOwner,
    swapProgramId
  ))(
  new Connection(RPC_URL, 'confirmed'),
  initKeyPair('4X5LLq9eDCZW5H8RgC2b2jkkSFjeyUYRCkVPZaR9CaXN6GHQD5uPi3TMwsh2bMnr81UVkZ8DdqV3BCRGMczQxVNE'),
  initKeyPair('f2NnEx73W9byyRSbo8pym1HMqzKJLEJ78TYptnBQT83dhCyjsg18QtMouT1m18eaFGoVd2J1KH6pfXLK7rK4f6v'),
  initKeyPair('4XQKMSBH9XpmYvDQ7v9oUSg5NNSbZaBoDvmJ4TbYfykopDDJiRRMsJgXxPMJyTXcr5phZxXxjNrS8qXqF3EFjckm'),
  initKeyPair('3iWXY1U7o88mnXnERvhS9CsC52oLDpKQ4YP6G8DVHmxjkG6PMJq4UCvKUK9LzMkJifZfh9WdjP121eGuPcvrxdgW'),
  initKeyPair('4JxDGEthPfaDoTGfJPXEWhncSFceovumyoYoUq1vT3qeUKr1F6DcYgPu9JpapKuRoEQJ3eM9Tb544LM6TSmfm2Eh'),
  new PublicKey(process.env.PROGRAM_ID || '')
).catch(console.error);

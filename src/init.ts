import {Connection} from '@solana/web3.js';

import {RPC_URL} from './constant';
import {createToken} from './token';
import {initKeyPair} from './utils';

((connection = new Connection(RPC_URL), accountKeyPair = initKeyPair()) =>
  createToken(connection, accountKeyPair, 8, 1e8 * 1_000))()
  .then(addr => console.log(`Token address: ${addr}`))
  .catch(console.error);

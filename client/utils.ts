import {Keypair} from '@solana/web3.js';
import {decode} from 'bs58';

export const initKeyPair = (secret: string) => Keypair.fromSecretKey(decode(secret));

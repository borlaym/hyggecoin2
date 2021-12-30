import { TruncatedBlockHeaders } from "./block";

export const PORT = process.env.PORT || (process.argv.includes('--peer') ? Math.floor(Math.random() * 500 + 8000) : 9000);
export const PORT_HEADER_NAME = 'x-hyggecoin-port';

export const SECOND = 1000;
export const MINUTE = 60 * SECOND

export const MINE_RATE = 15 * MINUTE
export const MINIMUM_DIFFICULTY = parseInt('ff', 16);

export const GENESIS_BLOCK_HEADERS: TruncatedBlockHeaders = {
  parentHash: 'GENESIS_PARENT_HASH',
  beneficiary: 'GENESIS_BENEFICIARY',
  stateRoot: 'GENESIS_STATE_ROOT',
  transactionRoot: 'GENESIS_TRANSACTION_ROOT',
  difficulty: MINIMUM_DIFFICULTY,
  number: 0,
  timestamp: 0
}
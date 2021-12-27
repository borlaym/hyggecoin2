import { TruncatedBlockHeader } from "./block";

const GENESIS_BLOCK_HEADERS: TruncatedBlockHeader = {
  parentHash: 'GENESIS_PARENT_HASH',
  beneficiary: 'GENESIS_BENEFICIARY',
  stateRoot: 'GENESIS_STATE_ROOT',
  transactionRoot: 'GENESIS_TRANSACTION_ROOT',
  difficulty: 1,
  number: 0,
  timestamp: 0
}
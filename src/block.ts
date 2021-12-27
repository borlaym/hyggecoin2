import { Transaction } from "./transaction"
import { hash } from "./utils/hash";

export type TruncatedBlockHeader = {
  /**
   * This is the Keccak-256 hash of the parent block's header.
   */
  parentHash: string;
  /**
   * This is the 20-byte address to which all block rewards are transferred.
   */
  beneficiary: string;
  /**
   * This is the Keccak-256 hash of
   * the root node of the state trie, after a block and
   * its transactions are finalized
   */
  stateRoot: string;
  /**
   * This is the Keccak-256
   * hash of the root node of the trie structure populated with each transaction from a Block's transaction list.
   */
  transactionRoot: string;
  /**
   * This is the difficulty of this block
   * a quantity calculated from the previous block's
   * difficulty and its timestamp.
   */
  difficulty: number;
  /**
   * This is a quantity equal to the number of ancestor blocks behind the current block.
   */
  number: number;
  /**
   * This is a record of Unix's time at this block's inception.
   */
  timestamp: number;
}

export type Block = {
  blockHeader: TruncatedBlockHeader & {
    /**
     * This is an 8-byte hash that verifies a sufficient amount of computation has been done on this block.
     */
    nonce: number;
  };
  transactionSeries: Transaction[]
}

const HASH_LENGTH = 64;
const MAX_HASH_VALUE = parseInt('f'.repeat(HASH_LENGTH), 16);

/**
 * Calculate a base 16 hash that is always 64 characters long
 */
export function calculateBlockTargetHash(lastBlock: Block): string {
  const value =  (MAX_HASH_VALUE / lastBlock.blockHeader.difficulty).toString(16);

  if (value.length > HASH_LENGTH) {
    return 'f'.repeat(HASH_LENGTH);
  }

  return '0'.repeat(HASH_LENGTH - value.length) + value;
}

const MAX_NONCE_VALUE = 2 ** 64;

export function mineBlock({
  lastBlock,
  beneficiary
}: {
  lastBlock: Block;
  beneficiary: string;
}): Block {
  const target = calculateBlockTargetHash(lastBlock);
  let blockHash;
  let nonce;
  let headers: TruncatedBlockHeader;
  do {
    const timestamp = Date.now();
    headers = {
      parentHash: hash(lastBlock.blockHeader),
      beneficiary,
      difficulty: lastBlock.blockHeader.difficulty + 1,
      number: lastBlock.blockHeader.number + 1,
      timestamp,
      stateRoot: '',
      transactionRoot: ''
    };
    const headerHash = hash(headers);
    nonce = Math.floor(Math.random() * MAX_NONCE_VALUE);
    blockHash = hash(headerHash + nonce);
  } while ( blockHash > target);
  return {
    blockHeader: {
      ...headers,
      nonce
    },
    transactionSeries: []
  }
}
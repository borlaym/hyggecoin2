import { MINE_RATE, MINIMUM_DIFFICULTY, MINUTE } from "./config";
import { Transaction } from "./transaction"
import { hash } from "./utils/hash";

export type TruncatedBlockHeaders = {
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
  blockHeaders: TruncatedBlockHeaders & {
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
  const value =  (MAX_HASH_VALUE / lastBlock.blockHeaders.difficulty).toString(16);

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
  let headers: TruncatedBlockHeaders;
  do {
    const timestamp = Date.now();
    const dTime = timestamp - lastBlock.blockHeaders.timestamp;
    headers = {
      parentHash: hash(lastBlock.blockHeaders),
      beneficiary,
      difficulty: dTime < MINE_RATE ? lastBlock.blockHeaders.difficulty + 1 : Math.max(lastBlock.blockHeaders.difficulty - 1, MINIMUM_DIFFICULTY),
      number: lastBlock.blockHeaders.number + 1,
      timestamp,
      stateRoot: '',
      transactionRoot: ''
    };
    const headerHash = hash(headers);
    nonce = Math.floor(Math.random() * MAX_NONCE_VALUE);
    blockHash = hash(headerHash + nonce);
  } while ( blockHash > target);
  return {
    blockHeaders: {
      ...headers,
      nonce
    },
    transactionSeries: []
  }
}

/**
 * Gives you the block's hash based on headers and nonce
 */
export function blockHash(block: Block): string {
  const { nonce, ...truncatedHeaders } = block.blockHeaders;
  const headerHash = hash(truncatedHeaders);
  return hash(headerHash + nonce);
}

export function validateGenesisBlock(block: Block) {
  // TODO: validate initial state in the genesis block
  return true;
}

/**
 * Validate a normal block, throws if there is any error
 */
export function validateBlock(lastBlock: Block, block: Block): boolean {
  // Check that the parent hash is correct
  if (hash(lastBlock.blockHeaders) !== block.blockHeaders.parentHash) {
    throw new Error('parentHash doesn\'t match hash of parent block\'s headers');
  }

  // Must increment the index by 1
  if (block.blockHeaders.number !== lastBlock.blockHeaders.number + 1) {
    throw new Error('number is not greater than parent block number by 1');
  }

  // Check that the block is not before the last block
  if (block.blockHeaders.timestamp <= lastBlock.blockHeaders.timestamp) {
    throw new Error('block\'s timestamp is before the last block');
  }

  // Check that the block is not in the future, with a 2 minute allowance
  if (block.blockHeaders.timestamp > Date.now() + 2 * MINUTE) {
    throw new Error('block\'s timestamp is too far in the future');
  }

  // Check difficulty change
  const dTime = block.blockHeaders.timestamp - lastBlock.blockHeaders.timestamp;
  if (dTime < MINE_RATE && block.blockHeaders.difficulty !== Math.max(lastBlock.blockHeaders.difficulty + 1, MINIMUM_DIFFICULTY)) {
    throw new Error('early block\'s difficulty should increase by 1');
  } else if (block.blockHeaders.difficulty !== lastBlock.blockHeaders.difficulty - 1) {
    throw new Error('late block\'s difficulty should decrease by 1');
  }

  // Meets difficulty requirement
  const target = calculateBlockTargetHash(lastBlock);
  const hashOfBlock = blockHash(block);
  if (hashOfBlock > target) {
    throw new Error(`block doesn't meet proof of work requirement of difficulty ${lastBlock.blockHeaders.difficulty}. Hash should be below ${target}, but hash is ${hash}`);
  }

  return true;
}
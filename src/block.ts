import { Transaction } from "./transaction"

export type UnsignedBlockHeader = {
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
  blockHeader: UnsignedBlockHeader & {
    /**
     * This is an 8-byte hash that verifies a sufficient amount of computation has been done on this block.
     */
    nonce: number;
    /**
     *  This is a 32-byte hash that verifies a sufficient amount of computation has been done on this block.
     */
    hash: string;
  };
  transactionSeries: Transaction[]
}
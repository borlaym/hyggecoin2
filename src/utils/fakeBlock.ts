import { Block, TruncatedBlockHeader } from "../block";

/**
 * Helper function to create a type correct blockheader from partial values, used in testing
 */
export function fakeBlockHeaders(blockHeaders: Partial<TruncatedBlockHeader>): TruncatedBlockHeader {
  return {
    parentHash: '',
    beneficiary: '',
    stateRoot: '',
    transactionRoot: '',
    difficulty: 1,
    number: 1,
    timestamp: 1,
    ...blockHeaders,
  }
}

/**
 * Helper function to create a type correct block from partial values, used in testing
 */
 export function fakeBlock(blockHeaders: Partial<TruncatedBlockHeader>): Block {
  return {
    blockHeader: {
      ...fakeBlockHeaders(blockHeaders),
      nonce: 1
    },
    transactionSeries: []
  }
}
import { Block, TruncatedBlockHeaders } from "../block";

/**
 * Helper function to create a type correct blockheader from partial values, used in testing
 */
export function fakeBlockHeaders(blockHeaders: Partial<TruncatedBlockHeaders>): TruncatedBlockHeaders {
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
 export function fakeBlock(blockHeaders: Partial<TruncatedBlockHeaders>): Block {
  return {
    blockHeaders: {
      ...fakeBlockHeaders(blockHeaders),
      nonce: 1
    },
    transactionSeries: []
  }
}
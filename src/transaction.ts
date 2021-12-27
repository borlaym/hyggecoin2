export type Transaction = {
  /**
   * The number of transactions sent by the sender.
   */
  nonce: number;
  /**
   * The number of coins to pay the network for unit of gas.
   */
  gasPrice: number;
  /**
   *  The maximum amount of gas to be used in while executing a transaction.
   */
  gasLimit: number;
  /**
   *  The 20-character recipient of a message call.
   */
  to: string;
  /**
   * The number of coins to be transferred to the recipient of a message call
   */
  value: number;
  v: string;
  r: string;
  s: string;
}
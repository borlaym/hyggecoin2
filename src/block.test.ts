import { calculateBlockTargetHash } from "./block"
import { fakeBlock } from "./utils/fakeBlock"

describe('Block', () => {
  describe('calculateBlockTargetHash', () => {
    it('calculates the max hash value when difficulty is 1', () => {
      expect(calculateBlockTargetHash(fakeBlock({ difficulty: 1 }))).toEqual('f'.repeat(64))
    })
    it('calculates a low hash value when the block difficulty is high', () => {
      expect(calculateBlockTargetHash(fakeBlock({ difficulty: 500 })) < '1').toBe(true)
    })
  })
})

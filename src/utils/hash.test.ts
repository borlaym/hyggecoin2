import { hash } from "./hash";

describe('hash', () => {
  it('produces a hash from an object', () => {
    expect(hash({ foo: '1', bar: '2'})).toEqual('4a79eeff599829cc2040ea7a451d50db511bbeafab3bcc111dc7e357909ac7f0')
    expect(hash({ bar: '2', foo: '1'})).toEqual('4a79eeff599829cc2040ea7a451d50db511bbeafab3bcc111dc7e357909ac7f0')
  });
})
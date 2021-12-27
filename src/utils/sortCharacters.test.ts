import sortCharacters from "./sortCharacters";

describe('sortCharacters', () => {
  it('sorts JSONS with the same contente but different order to the same end result', () => {
    expect(sortCharacters({ foo: '1', bar: '2'})).toEqual(sortCharacters({ bar: '2', foo: '1' }))
  });
  it('creates a different string for different objects', () => {
    expect(sortCharacters({ foo: '1' })).not.toEqual(sortCharacters({ foo: '2' }))
  });
})
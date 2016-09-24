import { expect } from 'chai'
import { get } from '../../src/libs/helpers/http-request-helper'

const REQUEST_TIMEOUT = 15 * 1000 // 15 seconds

describe('get()', function () { // must NOT use arrow function
  this.timeout(REQUEST_TIMEOUT)
  describe('with good url', () => {
    it('returns success', () => {
      return get('https://raw.githubusercontent.com/muan/emojilib/master/emojis.json')
        .then((response) => {
          expect(Object.keys(response).length).to.be.above(0)
        })
    })
  })

  describe('with bad url', () => {
    it('returns a 404', () => {
      return get('https://raw.githubusercontent.com/muan/emojilib/master/emojis.json.404')
        .then((response) => {
          throw new Error('Success status captured')
        })
        .catch((statusCode) => {
          expect(statusCode).to.equal(404)
        })
    })
  })
})

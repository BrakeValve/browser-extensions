import { expect } from 'chai'
import { get, post } from '../../src/libs/helpers/http-request-helper'

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
          throw new Error('unexpected success status captured')
        })
        .catch((statusCode) => {
          expect(statusCode).to.equal(404)
        })
    })
  })
})

describe('post()', function () {
  this.timeout(REQUEST_TIMEOUT)

  const payload = {
    name: 'BrakeValve',
    type: 'software',
    links: [
      'https://github.com/brakevalve',
      'https://brakevalve.github.io/'
    ]
  }

  describe('with good url', () => {
    it('returns success', () => {
      return post('https://httpbin.org/post', payload)
        .then((response) => {
          expect(response.json).to.deep.equal(payload)
        })
    })
  })

  describe('with bad url', function () {
    it('returns a 404', function () {
      return post('https://httpbin.org/post.404', payload)
        .then((response) => {
          throw new Error('unexpected success status captured')
        })
        .catch((statusCode) => {
          expect(statusCode).to.equal(404)
        })
    })
  })
})

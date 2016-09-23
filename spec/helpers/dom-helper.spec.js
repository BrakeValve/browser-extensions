import { expect } from 'chai'
import { getCurrency } from '../../src/libs/helpers/dom-helper'

describe('getCurrency()', () => {
  afterEach(() => {
    const metaTag = document.querySelector('meta[itemprop="priceCurrency"]')
    if (metaTag) {
      document.head.removeChild(metaTag)
    }
  })

  describe('with valid meta tag', () => {
    before(() => {
      const metaTag = document.createElement('meta')
      metaTag.setAttribute('itemprop', 'priceCurrency')
      metaTag.content = 'USD'
      document.head.appendChild(metaTag)
    })

    it('returns the currency string', () => {
      expect(getCurrency()).to.equal('USD')
    })
  })

  describe('with invalid meta tag (missing attribute: content)', () => {
    before(() => {
      const metaTag = document.createElement('meta')
      metaTag.setAttribute('itemprop', 'priceCurrency')
      document.head.appendChild(metaTag)
    })

    it('returns null', () => {
      expect(getCurrency()).to.be.null
    })
  })

  describe('without meta tag', () => {
    it('returns null', () => {
      expect(getCurrency()).to.be.null
    })
  })
})

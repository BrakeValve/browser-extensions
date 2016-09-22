function getCurrency () {
  const element = document.querySelector('meta[itemprop="priceCurrency"]')
  return (element && element.content) ? element.content : null
}

export { getCurrency }

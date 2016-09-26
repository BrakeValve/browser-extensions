function getCurrency () {
  const element = document.querySelector('meta[itemprop="priceCurrency"]')
  return (element && element.content) ? element.content : null
}

function getAppID () {
  const inputTag = document.querySelector('input[type=hidden]#review_appid')
  return (inputTag && inputTag.value) ? inputTag.value : null
}

export { getCurrency, getAppID }

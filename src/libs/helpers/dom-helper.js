function getCurrency () {
  const element = document.querySelector('meta[itemprop="priceCurrency"]')
  return (element && element.content) ? element.content : null
}

function getAppID () {
  const inputTag = document.querySelector('input[type=hidden]#review_appid')
  return (inputTag && inputTag.value) ? inputTag.value : null
}

function getAppPurchaseBox () {
  return document.querySelector('.game_area_purchase_game_wrapper')
}

function getPurchaseButton () {
  return getAppPurchaseBox().querySelector('a.btn_medium.btnv6_green_white_innerfade')
}

export { getCurrency, getAppID, getAppPurchaseBox, getPurchaseButton }

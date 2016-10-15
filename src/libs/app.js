import Chart from 'chart.js'

import { getCurrency, getAppID, getAppPurchaseBox, getPurchaseButton } from './helpers/dom-helper'
import { get } from './helpers/http-request-helper'

Chart.defaults.global.legend.display = false

function fetchPriceData () {
  const currency = getCurrency().toLowerCase()
  const appID = getAppID()
  const dataURL = `https://raw.githubusercontent.com/BrakeValve/historical-prices/${currency}/${appID}.json`

  return get(dataURL)
}

function updateButtonStyle (prediction) {
  if (prediction) {
    const purchaseButton = getPurchaseButton()
    purchaseButton.classList.add('brakevalve')
    purchaseButton.classList.add(`btn-${prediction}`)

    const span = purchaseButton.querySelector('span')
    if (prediction === 'stop') {
      span.innerHTML = 'Don’t Buy - Discount Soon'
    } else if (prediction === 'caution') {
      span.innerHTML = 'Neutral'
    }
  }
}

fetchPriceData()
  .then(data => {
    updateButtonStyle(data.prediction)
  })

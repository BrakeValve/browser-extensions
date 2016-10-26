import Chart from 'chart.js'
import Moment from 'moment'

import { getCurrency, getAppID, getPurchaseButton, getAppPurchaseBox } from './helpers/dom-helper'
import { get } from './helpers/http-request-helper'

Chart.defaults.global.legend.display = false
Chart.defaults.global.animation.duration = 2000

const BrakeValve = {}

class ChartProperties {
  static get areaUnderCurveColor () {
    return 'transparent'
  }

  static get lineColor () {
    return 'rgba(255, 255, 255, 0.5)'
  }

  static get lineWidth () {
    return 0.7
  }

  static get dotColor () {
    return 'rgba(255, 255, 255, 0.5)'
  }
}

BrakeValve.infoBox = (function () {
  const appPurchaseBox = getAppPurchaseBox()
  const _infoBox = document.createElement('div')
  _infoBox.classList.add('brakevalve', 'info-box')
  appPurchaseBox.appendChild(_infoBox)
  return _infoBox
})()

function loadSpinner () {
  return get(chrome.extension.getURL('templates/loading-indicator.html'), false)
}

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

function createCanvas () {
  const canvas = document.createElement('canvas')
  canvas.classList.add('brakevalve', 'chart-box')
  return canvas
}

function generateChartData (prices) {
  const labels = prices.map(
    (data) => {
      return Moment(new Date(parseInt(data.timestamp) * 1000)).format('MMM DD')
    }
  )

  const values = prices.map(
    (data) => {
      return parseFloat(data.price)
    }
  )

  return {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: ChartProperties.areaUnderCurveColor,
        borderColor: ChartProperties.lineColor,
        borderWidth: ChartProperties.lineWidth,
        pointBackgroundColor: ChartProperties.dotColor
      }
    ]
  }
}

function plotHistoricalData (data) {
  BrakeValve.chart = createCanvas()
  BrakeValve.infoBox.appendChild(BrakeValve.chart)

  const chartData = generateChartData(data)
  Chart.Line(
    BrakeValve.chart.getContext('2d'),
    {
      data: chartData,
      options: {
        title: {
          display: true,
          text: 'Historical Price (USD)'
        }
      }
    }
  )
  console.log(BrakeValve.chart)
}

loadSpinner()
  .then((html) => {
    const templateElement = document.createElement('template')
    templateElement.innerHTML = html
    BrakeValve.loadingIndicator = templateElement.content.firstChild
    BrakeValve.infoBox.appendChild(BrakeValve.loadingIndicator)

    return fetchPriceData()
  })
  .then((data) => {
    setTimeout(() => {
      updateButtonStyle(data.prediction)
      plotHistoricalData(data.priceHistory)
      BrakeValve.infoBox.removeChild(BrakeValve.loadingIndicator)
    }, 2500)
  })

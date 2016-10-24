import Chart from 'chart.js'
import Moment from 'moment'

import { getCurrency, getAppID, getPurchaseButton, getAppPurchaseBox } from './helpers/dom-helper'
import { get } from './helpers/http-request-helper'

Chart.defaults.global.legend.display = false

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
  const chartCanvas = createCanvas()
  getAppPurchaseBox().appendChild(chartCanvas)

  const chartData = generateChartData(data)
  Chart.Line(
    chartCanvas.getContext('2d'),
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
}

fetchPriceData()
  .then((data) => {
    updateButtonStyle(data.prediction)
    plotHistoricalData(data.priceHistory)
  })

import xhr from 'xhr'

const isString = (obj) => { return (typeof (obj) === 'string') }
const isSuccess = (code) => { return (code >= 200 && code <= 399) }

async function get (url) {
  return request(url, 'GET')
}

async function post (url, payload) {
  return request(url, 'POST', payload)
}

async function request (url, method, payload = undefined) {
  return new Promise(
    function (resolve, reject) {
      const headers = {}
      if (payload) {
        headers['Content-Type'] = 'application/json'
      }

      const options = {
        body: isString(payload) ? payload : JSON.stringify(payload),
        headers: headers,
        uri: url,
        method: method
      }

      const callback = function (err, resp, body) {
        if (!err && isSuccess(resp.statusCode)) {
          resolve(JSON.parse(body))
        } else {
          reject(resp.statusCode)
        }
      }

      xhr(options, callback)
    }
  )
}

export { get, post }

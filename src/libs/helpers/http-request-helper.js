import xhr from 'xhr'

function isString (obj) { return (typeof (obj) === 'string') }
function isSuccess (code) { return (code >= 200 && code <= 399) }

async function get (url, deserialize = true) {
  return request(url, 'GET', deserialize)
}

async function post (url, payload) {
  return request(url, 'POST', true, payload)
}

async function request (url, method, deserialize = true, payload = undefined) {
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
          if (deserialize) {
            resolve(JSON.parse(body))
          } else {
            resolve(body)
          }
        } else {
          reject(resp.statusCode)
        }
      }

      xhr(options, callback)
    }
  )
}

export { get, post }

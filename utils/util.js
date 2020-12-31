const config = require("../config")

const log = (message) => {
  if (config.debug) {
    console.log(message)
  }
}

const get = (url, success, fail) => {
  log(`getURL` + JSON.stringify(data))
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    success(res) {
      log(`getURL success` + JSON.stringify(res.data))
      success(res)
    },
    fail(res) {
      log(`getURL err` + res.statusCode)
      fail(res)
    }
  })
}

const post = (url, data, success, fail) => {
  log(`postURL` + JSON.stringify(data))
  wx.request({
    url: config.serverUrl + url,
    method: 'POST',
    data: data,
    header: {
      'content-type': 'application/json'
    },
    success(res) {
      log(`postURL success` + JSON.stringify(res.data))
      success(res)
    },
    fail(res) {
      log(`postURL err` + JSON.stringify(res))
      fail(res)
    }
  })
}

const postCloud = (url, data, success, fail) => {
  log(`postURL:` + url + ' Data:' + JSON.stringify(data))
  wx.cloud.callContainer({
    path: config.cloudUrl + url,
    method: 'POST',
    data: data,
    header: {
      'content-type': 'application/json'
    },
    success(res) {
      log(`postURL:` + url + ' Result:' + JSON.stringify(res.data))
      success(res)
    },
    fail(res) {
      log(`error:` + url + res.statusCode)
      fail(res)
    }
  })
}

module.exports = {
  log: log,
  post: postCloud
}

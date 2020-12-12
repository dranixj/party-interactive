const config = require("../config")

const log = (message) => {
  if (config.debug) {
    console.log(message)
  }
}

const get = (url, success, fail) => {
  log(JSON.stringify(data))
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    success(res) {
      log(JSON.stringify(res.data))
      success(res)
    },
    fail(res) {
      log(res.statusCode)
      fail(res)
    }
  })
}

const post = (url, data, success, fail) => {
  log(JSON.stringify(data))
  wx.request({
    url: config.serverUrl + url,
    method: 'POST',
    data: data,
    header: {
      'content-type': 'application/json'
    },
    success(res) {
      log(JSON.stringify(res.data))
      success(res)
    },
    fail(res) {
      log(res.statusCode)
      fail(res)
    }
  })
}

const postCloud = (url, data, success, fail) => {
  log(JSON.stringify(data))
  wx.cloud.callContainer({
    path: config.cloudUrl + url,
    method: 'POST',
    data: data,
    header: {
      'content-type': 'application/json'
    },
    success(res) {
      log(JSON.stringify(res.data))
      success(res)
    },
    fail(res) {
      log(res.statusCode)
      fail(res)
    }
  })
}


module.exports = {
  log: log,
  post: post
}

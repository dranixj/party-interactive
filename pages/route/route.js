//route.js
const config = require("../../config")
const api = require("../../utils/requestapi")

//获取应用实例
const app = getApp()

Page({
  data: {
    isHome: false,
    tag: '002',
    inputValue: '',
    processingNumber: 1,
    logos: ['../../resource/prize-unknown-1.png', '../../resource/prize-unknown-1.png', '../../resource/prize-unknown-1.png', '../../resource/prize-unknown-2.png', '../../resource/prize-unknown-1.png', '../../resource/prize-unknown-1.png', '../../resource/prize-unknown-2.png', '../../resource/prize-unknown-1.png', '../../resource/prize-unknown-1.png', '../../resource/prize-unknown-2.png', '../../resource/prize-unknown-1.png', '../../resource/prize-unknown-1.png', '../../resource/easter-egg-1.png', '../../resource/easter-egg-2.png'],

    loading: config.loading,
    color: config.color,
    background: config.background,
    show: config.show,
    animated: config.animated,
    back: config.back
  },
  onLoad: function () {
  },
  onShow: function () {
    if (app.globalData.userInfo) {
      api.login(this, app)
    }
  },
  onPullDownRefresh() {
    if (app.globalData.userInfo) {
      api.login(this, app)
    }
  },
  tapToBack(e) {
    wx.navigateBack({
      delta: 1
    })
  }
})

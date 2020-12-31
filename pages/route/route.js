//route.js
const config = require("../../config")
const api = require("../../utils/requestapi")

//获取应用实例
const app = getApp()

Page({
  data: {
    isHome: false,
    tag: '002',
    processingNumber: 0,
    logos: ['../../resource/prize-unknown-1.png', '../../resource/prize-unknown-1.png', '../../resource/prize-unknown-1.png', '../../resource/prize-unknown-2.png', '../../resource/prize-unknown-1.png', '../../resource/prize-unknown-1.png', '../../resource/prize-unknown-2.png', '../../resource/prize-unknown-1.png', '../../resource/prize-unknown-1.png', '../../resource/prize-unknown-2.png', '../../resource/prize-unknown-1.png', '../../resource/prize-unknown-1.png', '../../resource/easter-egg-1.png', '../../resource/easter-egg-2.png'],
    defalutLogos: ['../../resource/prize-unknown-1.png', '../../resource/prize-unknown-1.png', '../../resource/prize-unknown-1.png', '../../resource/prize-unknown-2.png', '../../resource/prize-unknown-1.png', '../../resource/prize-unknown-1.png', '../../resource/prize-unknown-2.png', '../../resource/prize-unknown-1.png', '../../resource/prize-unknown-1.png', '../../resource/prize-unknown-2.png', '../../resource/prize-unknown-1.png', '../../resource/prize-unknown-1.png', '../../resource/easter-egg-1.png', '../../resource/easter-egg-2.png'],
    loading: config.loading,
    color: config.color,
    background: config.background,
    show: config.show,
    animated: config.animated,
    back: config.back
  },
  onLoad: function () {
  },
  onUnload:function(){
    //停止抽奖进程画面的数据监听
    api.stopRouteMessageWatcher()
    this.setData({
      loading: false
    })
  },
  onShow: function () {
    if(this.data.loading) return
    this.setData({
      loading: true
    })
    api.route(this, app)
  },
  onPullDownRefresh() {
    if(this.data.loading) return
    this.setData({
      loading: true
    })
    api.updateRoute(this, app)
  },
  tapToBack(e) {
    wx.navigateBack({
      delta: 1
    })
  }
})

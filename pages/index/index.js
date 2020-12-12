//index.js
//获取应用实例
const app = getApp()
const config = require("../../config")
const api = require("../../utils/requestapi")

Page({
  data: {
    isHome: true,
    tag: '001',
    inputValue: '',
    motto: '',
    avatar: '../../resource/default-avatar.png',
    userInfo: {},
    realName: '',
    hasUserInfo: false,
    hasStaff: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIJoin: false,
    processingCount: 0,
    processingRate: 0,
    processingNumber: 0,
    prizeCount: 0,
    winningRate: 0,
    prize: '',
    remainingCount: 0,
    shooting: 'false',
    prizeBackground: '../../resource/prize-background-1.png',
    prizeBackgroundNext: '../../resource/prize-background-1.png',
    prizeContent: '../../resource/02-49.png',

    loading: config.loading,
    color: config.color,
    background: config.background,
    show: config.show,
    animated: config.animated,
    back: config.back,

    dialogShowJump: false,
    dialogShowLogout: false,
    dialogTitle: '',
    dialogMemo: ''
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      api.login(this, app)
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        api.login(this, app)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          api.login(this, app)
        }
      })
    }
  },
  onShow: function () {
    if (app.globalData.userInfo) {
      api.login(this, app)
    }
  },
  onPullDownRefresh(){
    if (app.globalData.userInfo) {
      api.login(this, app)
    }
  },
  getUserInfo: function (e) {
    if (e.detail.userInfo != undefined){
      app.globalData.userInfo = e.detail.userInfo
      app.globalData.encryptedData = e.detail.encryptedData
      app.globalData.iv = e.detail.iv
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      api.login(this, app)
    }
  },
  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  tapInputButton(e) {
    api.login(this, app)
  },
  tapJoin(e) {
    this.setData({
      dialogShowJump: false,
      dialogShowLogout: false,
    })
    if(e.detail.index == 1){
      this.setData({
        loading: true,
        canIJoin: false
      })
      api.post(
        config.joinAct,
        {
          name: app.globalData.name,
          token: app.globalData.token,
        }, (res) => {
          api.login(this, app)
        }, (res) => {
          api.login(this, app)
        }
      )
    }
  },
  tapLogout(e) {
    this.setData({
      dialogShowJump: false,
      dialogShowLogout: false,
    })
    if (e.detail.index == 1) {
      this.setData({
        loading: true,
        canIJoin: false
      })
      api.login(this, app, '1')
    }
  },
  tapJoinButton(e) {
    this.setData({
      dialogShowJump: true,
      dialogShowLogout: false,
      dialogTitle: '抽奖',
      dialogMemo: '确定要参与本轮抽奖?'
    })
  },
  tapToLogout(e) {
    if (!this.data.hasStaff){
      return
    }
    this.setData({
      dialogShowJump: false,
      dialogShowLogout: true,
      dialogTitle: '登出',
      dialogMemo: '确定要登出?登出后您的微信将与当前工号解绑'
    })
  },
  tapToNext(e){
    wx.navigateTo({
      url: '../route/route'
    })
  }
})

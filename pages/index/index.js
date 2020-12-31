//index.js
//获取应用实例
const app = getApp()
const config = require("../../config")
const api = require("../../utils/requestapi")

Page({
  data: {
    isLogin: false,
    isHome: true,
    tag: '001',
    inputValue: '',
    motto: '',
    avatar: '../../resource/default-avatar.png',
    userInfo: {},
    realName: '',
    company: '',
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
    prizeBackground: '../../resource/prize-background-17.png',
    prizeBackgroundNext: '../../resource/prize-background-17.png',
    prizeContent: '../../resource/02-0.png',
    winningPrize: 0,
    winningContent: '',

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
    this.setData({
      loading: true
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      api.init(this, app)
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        api.init(this, app)
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
          api.init(this, app)
        }
      })
    }
  },
  onUnload:function(){
    //停止主程画面的数据监听
    api.stopIndexMessageWatcher()
    this.setData({
      loading: false
    })
  },
  onShow: function () {
    if(this.data.loading) return
    if(this.data.inputValue!==''){
      wx.stopPullDownRefresh()
      return
    }
    this.setData({
      loading: true
    })
    if (!app.globalData.userInfo) {
      api.init(this, app)
    }
    else{
      this.setData({
        loading: false
      })
    }
  },
  onPullDownRefresh(){
    if(this.data.loading) return
    if(this.data.inputValue!==''){
      wx.stopPullDownRefresh()
      return
    }
    this.setData({
      loading: true
    })
    api.init(this, app)
  },
  getUserInfo: function (e) {
    if (e.detail.userInfo != undefined){
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      api.init(this, app)
    }
  },
  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  tapInputButton(e) {
    if(this.data.loading) return
    this.setData({
      loading: true
    })
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
      api.join(this,app)
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
      //停止主程画面的数据监听
      api.stopIndexMessageWatcher()
      api.logout(this, app)
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

const config = require("../config")
const util = require("./util")

wx.cloud.init({env: config.CLOUD_ENV})

const db = wx.cloud.database()

//主画面监听
let indexMessageWatcher = null
//抽奖进程画面监听
let routeMessageWatcher = null
//用户监听
let staffWatcher = null

const startIndexMessageWatcher = (page,app) =>{
  if(indexMessageWatcher!==null){
    return
  }
  if(page.data.company==''){
    return
  }
  util.log('Start watch index message!')
  indexMessageWatcher  = db.collection('Message')
    .watch({
      // 成功回调
      onChange: function(snapshot) {
        
        snapshot.docChanges.forEach(function(receiveMsg){
          //初始化时不触发
          if(receiveMsg.dataType=='init') return
          if(receiveMsg.doc._id=='ALL'){
              init(page,app)
            }
            else if(receiveMsg.doc._id==page.data.company){
              let processingRate = receiveMsg.doc.processing_count / receiveMsg.doc.member_count * 100
              page.setData({
                processingCount: receiveMsg.doc.processing_count,
                processingRate: processingRate,
                prizeBackground: findImage(processingRate, 1),
                prizeBackgroundNext: findImage(processingRate, 2),
                winningRate: joinRate(receiveMsg.doc.processing_count)
              })
            }
        })
        
      },
      // 失败回调
      onError: function(err) {
        util.log(`indexMessageWatcher` + err)
        indexMessageWatcher.close()
        indexMessageWatcher = null
        init(page,app)
      }
    })
}
const stopIndexMessageWatcher =() =>{
  if(indexMessageWatcher!==null){
    indexMessageWatcher.close()
    indexMessageWatcher = null
  }
}

const startRouteMessageWatcher = (page,app) =>{
  if(routeMessageWatcher!==null){
    page.setData({
      loading: false,
    })
    return
  }
  routeMessageWatcher  = db.collection('Message').doc('ALL')
    .watch({
      // 成功回调
      onChange: function(snapshot) {
        let receiveMsg = snapshot.docChanges[0]
        if(receiveMsg!==undefined){
          app.globalData.processingNumber = receiveMsg.doc.processing_number
          updateRoute(page,app)
        }
      },
      // 失败回调
      onError: function(err) {
        routeMessageWatcher = null
        updateRoute(page,app)
      }
    });
}
const stopRouteMessageWatcher =() =>{
  if(routeMessageWatcher!==null){
    routeMessageWatcher.close()
    routeMessageWatcher = null
  }
}

const startStaffWatcher= (page,app) =>{
  if(staffWatcher!==null) return
  util.log(`Start watch staff!` + app.globalData.open_id)
  staffWatcher  = db.collection('Staff').where({open_id:app.globalData.open_id})
    .watch({
      // 成功回调
      onChange: function(snapshot) {
        let receiveMsg = snapshot.docChanges[0]
        if(receiveMsg!==undefined){
          if(receiveMsg.dataType=='init') return
          init(page,app)
        }
      },
      // 失败回调
      onError: function(err) {
        util.log(`staffWatcher` + err)
        staffWatcher = null
        init(page,app)
      }
    });
}

const stopStaffWatcher =() =>{
  if(staffWatcher!==null){
    staffWatcher.close()
    staffWatcher = null
  }
}

//登录
const login = (page, app) =>{
  page.setData({
    isLogin: true
  })
  init(page, app)
}

//登出
const logout = (page, app) =>{
    util.post('logout/',
    {
      open_id:app.globalData.open_id
    },res=>{

    },err=>{
      util.log(`登出失败` + err)
    })
    app.globalData.userInfo = null
    app.globalData.name = ''
    app.globalData.times = 0
    app.globalData.winning = '还未中奖'
    stopIndexMessageWatcher()
    stopStaffWatcher()
    stopRouteMessageWatcher()
    page.setData({
      avatar: '../../resource/default-avatar.png',
      hasStaff: false,
      realName: '',
      company: '',
      loading: false,
    })
}

//抽奖进程画面
const route = (page,app) =>{
    // 监听数据变化
    startRouteMessageWatcher(page,app)
}

//参加抽奖
const join = (page,app) =>{
  util.post('join/',
  {
    open_id: app.globalData.open_id,
    processing_number: app.globalData.processingNumber,
  },res=>{
    util.log('参加成功')
    init(page,app)
  },err=>{
    util.log(`参加失败`+err)
    init(page,app)
  })
}

//画面初期化函数
const init = (page, app) => {
  util.log('init')
  //判断是否有获取用户信息的权限
  wx.getSetting({
    success: res => {
      if (!res.authSetting['scope.userInfo']) {
        app.globalData.userInfo = null
        app.globalData.open_id = undefined
        page.setData({
          loading: false,
          hasUserInfo: false,
          hasStaff: false,
          canIUse: wx.canIUse('button.open-type.getUserInfo'),
        })
        wx.stopPullDownRefresh()
      }
      else{
        //获取用户信息
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            //使用云服务器时，不再调用云函数获取OpenID
            init_step1(page,app)
          }
        })
      }
    },
    fail:err => {
      app.globalData.userInfo = null
      app.globalData.open_id = undefined
      page.setData({
        loading: false,
        hasUserInfo: false,
        hasStaff: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
      })
      wx.stopPullDownRefresh()
    }
  })
}


const init_step1 = (page, app) => {
  util.log('init step1')
  // 登录
  if(app.globalData.open_id == undefined){
    wx.cloud.callFunction({
      name: 'openid',
      complete: res => {
        app.globalData.open_id = res.result.open_id
        if(res.result.open_id == undefined){
          page.setData({
            avatar: '../../resource/default-avatar.png',
            hasUserInfo: false,
            hasStaff: false,
            canIUse: wx.canIUse('button.open-type.getUserInfo'),
            loading: false,
          })
        }
        else{
          init_step2(page,app)
        }
      },
      fail:res =>{
        return
      }
    })
  }
  else{
    init_step2(page,app)
  }
}

const init_step2=(page,app)=>{
  util.log('init step2')
  if(page.data.isLogin){
    if(page.data.inputValue==''){
      page.setData({
        dialogShowJump: false,
        dialogShowLogout: true,
        dialogTitle: '错误',
        dialogMemo: '请输入员工号登录。',
        loading: false,
        isLogin: false,
      })
      return
    }
  }
  // //取不到用户信息时直接返回
  // else if(!page.data.hasStaff){
  //     util.log('test')
  //     page.setData({
  //       loading: false,
  //     })
  //     wx.stopPullDownRefresh()
  //     return
  // }
  //staff_id不为空 用员工号登录
  //staff_id为空 用open_id登录
  //用open_id登录无法取得员工信息时，跳转到员工号输入(hasStaff:false)画面
  //用staff_id登录时，判断open_id是不是绑定到别的用户上，如果有，则先解除绑定
  util.post('login/',
        {
          staff_id: page.data.inputValue,
          open_id:app.globalData.open_id,
          avatar:app.globalData.userInfo.avatarUrl,
        },
        res=>{
          //正常取得数据的情况
          page.setData({
            loading: false,
            isLogin: false
          })
          wx.stopPullDownRefresh()
          if (res.data.isErr == false) {
            app.globalData.name = res.data.staff.name
            app.globalData.times = res.data.staff.times
            app.globalData.winning = res.data.staff.prize == '' ? '还未中奖' : res.data.staff.prize
            app.globalData.processingNumber = res.data.processing_number
            page.setData({
              avatar: app.globalData.userInfo.avatarUrl,
              inputValue: '',
              hasUserInfo: true,
              hasStaff: true,
              realName: res.data.staff.name + '(' + res.data.staff.company + ')',
              company: res.data.staff.company,
              remainingCount: res.data.staff.times,
              winningPrize: res.data.staff.prize_id,
              winningPrizeName: res.data.staff.prize_name,
              winningContent: findPrizeImage(res.data.staff.prize_id),
              processingNumber: res.data.processing_number,
              prizeContent: findPrizeImage(res.data.processing_number),
              prizeCount: 14,
            })

            startIndexMessageWatcher(page,app)
            startStaffWatcher(page,app)

          }
          //取不到用户信息
          else{
            //用户名框不为空（登录的情况）
            if(page.data.inputValue!==''){
              page.setData({
                dialogShowJump: false,
                dialogShowLogout: true,
                dialogTitle: '错误',
                dialogMemo: '员工号不存在!请确认输入的内容。',
                loading: false,
              })
            }
            else if(page.data.realName!==''){
              page.setData({
                dialogShowJump: false,
                dialogShowLogout: true,
                dialogTitle: '错误',
                dialogMemo: '无法获取员工信息!请重新登录。',
                loading: false,
              })
            }
          }

          if (res.data.activity != undefined) {
            page.setData({
              desc: res.data.activity.activity_name,
              prize: res.data.activity.prize,
              canIJoin: false,
            })
            let processingRate = res.data.processing_count / res.data.member_count * 100
            if (res.data.activity.activity_id == '000' || res.data.activity.activity_id == '001') {
              page.setData({
                processingCount: res.data.processing_count, //参加人数
                processingRate: processingRate, //参加人数比率
                prizeBackground: findImage(processingRate, 1), //图片1
                prizeBackgroundNext: findImage(processingRate, 2), //图片2
                winningRate: joinRate(res.data.processing_count), //获奖概率
                canIJoin: (res.data.can_join?(app.globalData.times>0?true:false):false), //是否能参加（结合个人的剩余次数）
              })
            }else{
              //入围画面（Shooting:true入围，false非入围)
              page.setData({
                prizeBackground: findImage(processingRate, 1),
                processingCount: '',
                winningRate: 0,
                canIJoin: false,
                shooting: res.data.shooting
              })
            }
          } else {
            page.setData({
              desc: '等待中',
              canIJoin: false
            })
          }
        }, (res) => {
          //取数据出错的情况
          util.log(`登录失败！` + res)
          page.setData({
            loading: false,
            isLogin: false
          })
          wx.stopPullDownRefresh()
        }
      )
}

function joinRate(processing_count) {
  let rate = processing_count == 0 ? 100 + '%' : (1 / processing_count * 100).toFixed(0)+'%'
  return rate;
}

function findImage(processing_count, add) {
  let index = Math.ceil(processing_count/60 * 17) + add;
  if(index < 1){
    index = 1;
  }else if(index > 17){
    index = 17
  }
  let image = config.imageUrl + index + '.png'
  return image;
}

function findPrizeImage(processing_number) {
  let image = config.prizeUrl + processing_number + '.png'
  //大奖后面的小纪念品奖统一用一张图
  if(processing_number>14){
    image = config.prizeUrl + '15.png'
  }
  return image;
}

function updateRoute(page,app) {
  let logos = new Array();
  let processingNumber = parseInt(app.globalData.processingNumber)
  for (let i = 1; i <= page.data.logos.length; i++) {
    if (i <= processingNumber) {
      logos.push(config.logoUrl + '' + i + '.png')
    }
    else if (i == processingNumber + 1) {
      logos.push(config.logoUrl + 'logo' + i + '.png')
    } else {
      logos.push(page.data.defalutLogos[i - 1])
    }
  }
  page.setData({
    logos: logos,
    loading: false,
  })
  wx.stopPullDownRefresh()
}

module.exports = {
  login: login,
  logout: logout,
  join: join,
  init: init,
  route: route,
  updateRoute: updateRoute,
  stopRouteMessageWatcher: stopRouteMessageWatcher,
  stopIndexMessageWatcher: stopIndexMessageWatcher,
  stopStaffWatcher: stopStaffWatcher,
}

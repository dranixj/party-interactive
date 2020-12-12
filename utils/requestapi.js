const config = require("../config")
const util = require("./util")

wx.cloud.init({env: config.CLOUD_ENV})

const db = wx.cloud.database()

const login = (page, app, logout) => {
  if (app.globalData.userInfo == null){
    page.setData({
      loading: false
    })
    wx.stopPullDownRefresh()
    return
  }
  page.setData({
    loading: true
  })
  if (logout == undefined){
    logout = '0'
  }
  // 登录
  wx.login({
    success: res => {
      util.post('/container-interactive-back/login/',
      {no: page.data.inputValue},
      res=>{
        console.log(res.data)
      },
      res=>{
        console.log(res)
      })

      // db.collection('member')
      // .doc('c89bd61c5fd1cf9d010551326cbd1bfa')
      // .update({   
      //   data: {
      //     name: 'milk'
      //   }
      // }).then(res =>{
      //   console.log(res.stats.updated)
      // }).catch(err =>{
      //   console.log(err)
      // })
      
      db.collection('member1').where({
        no: page.data.inputValue,
        company:'ohs'
      }).get().then(res => {
          //正常取得数据的情况
          page.setData({
            loading: false
          })
          wx.stopPullDownRefresh()
          if (res.data.length > 0) {
            app.globalData.name = res.data[0].name
            app.globalData.times = res.data.times
            //app.globalData.winning = res.data.prize == '' ? '还未中奖' : res.data.prize
            page.setData({
              avatar: app.globalData.userInfo.avatarUrl,
              inputValue: '',
              hasStaff: true,
              realName: res.data[0].name,
              title: '当前活动:',
              //remainingCount: res.data.staff.times,
              //winningPrize: res.data.staff.prize == '' ? '还未中奖' : res.data.staff.prize,
              //processingNumber: res.data.processing_number,
              //prizeContent: findPrizeImage(res.data.processing_number),
              remainingCount: 2,
              winningPrize: '',
              processingNumber: 14,
              prizeContent: findPrizeImage(5),
              prizeCount: 14,
              prizeBackground: findImage(10, 1),
              winningRate: 10,
              canIJoin: false,
              shooting: true,
              desc: '',
              memo: '进行中',
              prize: 'aaaaaaaa',
            })
          }
          if (page.data.tag == '002') {
            page.setData({
              processingNumber: 10
            })
            console.log('抽奖进程画面')
            updateRoute(page)
          }
          if(logout=='1'){
            console.log('登出')
            //登出
            app.globalData.userInfo = null
            app.globalData.name = ''
            app.globalData.times = 0
            app.globalData.winning = '还未中奖'
            page.setData({
              avatar: '../../resource/default-avatar.png',
              hasStaff: false,
              realName: ''
            })
          }
          if (res.data.activity != undefined) {
            page.setData({
              desc: res.data.activity.activity_name,
              memo: res.data.activity.activity_memo,
              prize: res.data.activity.prize,
              canIJoin: false,
            })
            if (res.data.activity.activity_id == '000' || res.data.activity.activity_id == '001') {
              page.setData({
                processingCount: res.data.processing_count,
                processingRate: res.data.winning_rate,
                prizeBackground: findImage(res.data.winning_rate, 1),
                prizeBackgroundNext: findImage(res.data.winning_rate, 2),
                winningRate: joinRate(res.data.processing_count),
                canIJoin: res.data.canJoin,
              })
            }else{
              page.setData({
                prizeBackground: findImage(res.data.winning_rate, 1),
                processingCount: '',
                winningRate: 0,
                canIJoin: false,
                shooting: res.data.shooting
              })
            }
          } else {
            page.setData({
              //desc: '等待中',
              canIJoin: false
            })
          }
          page.setData({
            //desc: '等待中',
            canIJoin: false
          })
        }, (res) => {
          //取数据出错的情况
          page.setData({
            loading: false
          })
          wx.stopPullDownRefresh()
        }
      )
    }
  })
}

// 监听数据变化
db.collection('msgList')
  .watch({
    // 成功回调
    onChange: function(snapshot) {
      let reviceMsg = snapshot.docChanges[0]
      if(reviceMsg.dataType == 'add'){
        console.log(reviceMsg.doc)
        let talkData = that.data.talkData
        talkData.push(reviceMsg.doc)
        that.setData({
          talkData: talkData
        })
      }
    },
    // 失败回调
    onError: function(err) {
      console.error('the watch closed because of error', err)
    }
  })

const connectWS = (page, app) => {

  wx.onSocketMessage(function (res) {
    log(JSON.stringify(res))
    let data = JSON.parse(res.data)
    // 收到消息
    if (data.message.message == 'pong') {
      heartCheck.reset(app).start()
    } else {
      let message = data.message.message
      switch (message.activity) {
        case '001':
          login(page,app)
          break;
        case '002':
          page.setData({
            processingCount: message.processing_count,
            processingRate: message.winning_rate,
            prizeBackground: findImage(message.winning_rate, 1),
            prizeBackgroundNext: findImage(message.winning_rate, 2),
            winningRate: joinRate(message.processing_count)
          })
          break;
        case '003':
          login(page, app)
          break;
        default:
          log('default')
      }
    }
  })
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
  let image = config.prizeUrl + (parseInt(processing_number)+48) + '.png'
  return image;
}

function updateRoute(page) {
  let logos = new Array();
  let normalCount = 12
  let processingNumber = parseInt(page.data.processingNumber)
  console.log(processingNumber)
  for (let i = 1; i <= page.data.logos.length; i++) {
    if (i <= processingNumber && i < normalCount) {
      logos.push(config.logoUrl + '' + i + '.png')
    } else if (i <= processingNumber && i >= normalCount) {
      logos.push(config.logoUrl + 'V' + (i - normalCount + 1) + '.png')
    } else if (i == processingNumber + 1 && i < normalCount) {
      logos.push(config.logoUrl + 'logo' + i + '.png')
    } else if (i == processingNumber + 1 && i >= normalCount) {
      logos.push(config.logoUrl + 'logoV' + (i - normalCount + 1) + '.png')
    } else {
      logos.push(page.data.logos[i - 1])
    }
  }
  page.setData({
    logos: logos
  })
}

module.exports = {
  login: login
}

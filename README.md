# party-interactive
微信小程序代码（需要用微信开发工具打开）
下载地址<https://mp.weixin.qq.com/wxamp/thirdtools>

+ 开发文档<https://developers.weixin.qq.com/miniprogram/dev/framework/>
+ 云开发<https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html>

本程序客户端取得openid用到了云函数(云函数代码如文档示例）
```
const cloud = require('wx-server-sdk')
exports.main = async (event, context) => {
  let { OPENID, APPID } = cloud.getWXContext() // 这里获取到的 openId 和 appId 是可信的
  return {
    open_id:OPENID
  }
}
```

因为数据监听用客户端用到了openid,所以需要预先取得
+ 后续可以修改结合API修改为POST:login接口返回openid
+ 本地调试或在非小程序云端发布时API端无法通过req.headers['x-wx-openid']获取，需要预先获取openid

### 配置文件(config.js)
需配合小程序云的信息做调整
```
const config = {

  //云环境ID
  CLOUD_ENV:'interactive-5g9djyvud3542b74',
  // 下面的地址配合云端 Server 工作
  imageUrl: 'cloud://interactive-5g9djyvud3542b74.696e-interactive-5g9djyvud3542b74-1304473054/prize_background/prize-background-',
  logoUrl: 'cloud://interactive-5g9djyvud3542b74.696e-interactive-5g9djyvud3542b74-1304473054/logo/02_',
  prizeUrl: 'cloud://interactive-5g9djyvud3542b74.696e-interactive-5g9djyvud3542b74-1304473054/prize/02-',

  //云托管地址
  cloudUrl:'/container-interactive-api/',
  //测试用服务器地址
  serverUrl:'http://localhost/',

  loading: false,
  color: '#000',
  background: '#ffffff',
  show: true,
  animated: false,
  back: false,
  debug: false,
}
```
### util.js
```
module.exports = {
  log: log,
  post: postCloud
}
```
用本地服务器测试时，把post: postCloud修改为post: post

## 程序用资源文件放在小程序的存储中

+ 云路径（小程序内部用）
<cloud://interactive-5g9djyvud3542b74.696e-interactive-5g9djyvud3542b74-1304473054/>
+ HTTP路径
<https://696e-interactive-5g9djyvud3542b74-1304473054.tcb.qcloud.la/>

文件夹|文件|描述
-|-|-
logo/|02_1.png～02_14.png|各个奖品的内容Logo（抽奖进程界面用）
logo/|02_logo1.png～02_logo14.png|各个奖品的品牌Logo（抽奖进程界面用）
prize/|02-1.png～02-15.png|各个奖品的大图
prize_background/|prize-background-1.png～prize-background-17.png|参加页面的背景（根据参加人数百分比变化）

## 数据监听示例
监听Staff集合的open_id为当前用户open_id的数据，如果有变化，则刷新页面
```
const startStaffWatcher= (page,app) =>{
  if(staffWatcher!==null) return
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
```
__监听实际是通过WebSocket实现。也可以在服务端使用，但不能和其他的WebSocket服务（io.socket等）并存，否则会抛出异常。__

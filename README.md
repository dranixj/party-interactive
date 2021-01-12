# party-interactive
微信小程序代码（需要用微信开发工具打开）
下载地址<https://mp.weixin.qq.com/wxamp/thirdtools>

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
```
cloud://interactive-5g9djyvud3542b74.696e-interactive-5g9djyvud3542b74-1304473054/
logo/02_1.png～02_14.png  各个奖品的内容Logo（抽奖进程界面用）
logo/02_logo1.png～02_logo14.png 各个奖品的品牌Logo（抽奖进程界面用）
prize/02-1.png～02-15.png 各个奖品的大图
prize_background/prize-background-1.png～prize-background-17.png 参加页面的背景（根据参加人数百分比变化）
```

/**
 * 小程序配置文件
 */
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

module.exports = config
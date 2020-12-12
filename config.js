/**
 * 小程序配置文件
 */
const config = {

  //云环境ID
  CLOUD_ENV:'interactive-5g9djyvud3542b74',
  // 下面的地址配合云端 Server 工作
  imageUrl: 'https://tokyometo.oss-cn-shanghai.aliyuncs.com/Interactive-Wechat/prize-background-',
  logoUrl: 'https://tokyometo.oss-cn-shanghai.aliyuncs.com/Interactive-Wechat/02_',
  prizeUrl: 'https://tokyometo.oss-cn-shanghai.aliyuncs.com/Interactive-Wechat/02-',

  //云托管地址
  cloudUrl:'/container-interactive-back/',
  //测试用服务器地址
  serverUrl:'http://localhost/',

  loading: false,
  color: '#000',
  background: '#ffffff',
  show: true,
  animated: false,
  back: false
}

module.exports = config
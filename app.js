//app.js
App({
  onLaunch: function () {
    console.log("onLaunch")
    var that = this
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var _authtoken = wx.getStorageSync('authtoken') || ''
    that.globalData.authtoken = _authtoken

    var _userInfo = wx.getStorageSync('userInfo') || ''
    that.globalData.userInfo = _userInfo


    var _userMsgLastId = wx.getStorageSync('userMsgLastId') || []
    that.globalData.userMsgLastId = _userMsgLastId

    var _userMsg = wx.getStorageSync('userMsg') || []
    that.globalData.userMsg = _userMsg

  },
  /**
   * 1.判断如果登录token为空,调用登录方法
   * 2.判断如果userMsgLastId为空,从后台重新获取
   * 
   */
  onShow() {
    console.log("onShow")
    var that = this

    if (that.globalData.authtoken == '') {
      that.loginServer()
    }

    if (that.globalData.userMsgLastId == '') {
      that.getUserMsgLastId()
    }

  },
  /**
   * 微信小程序登录后台服务端
   * 
   */
  loginServer: function () {
    var that = this
    wx.login({
      success: function (logininfo) {
        var wxCode = logininfo.code
        wx.getUserInfo({
          success: function (res) {
            that.globalData.userInfo = res.userInfo
            wx.setStorageSync('userInfo', res.userInfo)

            var wxEncryptedData = res.encryptedData
            var wxIv = res.iv
            var wxAppId = that.globalData.wxAppId
            var clientType = '01'
            var accountType = '10'

            var apiurl = that.apiUrls.login
            var apidata = {
              clientType: clientType,
              accountType: accountType,
              wxAppId: wxAppId,
              wxCode: wxCode,
              wxEncryptedData: wxEncryptedData,
              wxIv: wxIv,
              person: { name: 'wangpf', email: 'wangpf@qq.com' }
            }

            that.apiPost(1,apiurl,apidata,function (res) {
                var authtoken = res.authtoken
                console.log("authtoken==" + authtoken)
                that.globalData.authtoken = authtoken
                wx.setStorageSync('authtoken', authtoken)
              })

          }
        })
      }
    })
  },
  getUserMsgLastId() {
    var that = this
    var apiurl = that.apiUrls.getUserMsgLastId
    var apidata = {}

    that.apiPost(1, apiurl, apidata, function (res) {
        var userMsgLastId = res.userMsgLastId
        that.globalData.userMsgLastId = userMsgLastId
        wx.setStorageSync('userMsgLastId', userMsgLastId)
      })
  }
  ,
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (loginres) {
          // console.log("code=="+loginres.code)
          wx.getUserInfo({
            success: function (res) {
              // console.log(res)
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  /**
   * ct : content-type 1:application/json 2:application/x-www-form-urlencoded
   * apiurl : api请求地址
   * apidata : api请求数据
   * success : api回调函数
   */
  apiPost: function (ct, apiurl, apidata, success) {
    var that = this

    var baseurl = that.apiUrls.baseurl
    var contentType = ''
    if (ct == 1) {
      contentType = 'application/json'
    } else if (ct == 2) {
      contentType = 'application/x-www-form-urlencoded'
    }
    wx.request({
      url: baseurl + apiurl,
      method: 'POST',
      data: apidata,
      header: {
        'content-type': contentType,
        'authtoken': that.globalData.authtoken
      },
      success: function (res) {
        // console.log(res.data)
        typeof success == "function" && success(res.data)
      }
    })
  },
  apiUrls: {
    baseurl: 'https://www.flybird.wang',
    login: '/api/authentication/doWeChatLogin',
    getUserMsgLastId: '/api/usermsg/getUserMsgLastId',
    getUserLastMsg: '/api/usermsg/getUserLastMsg'
  },
  globalData: {
    wxAppId: 'wx5493b08cb08b517c',
    userInfo: {},
    userMsg: [],
    userMsgLastId: '',
    authtoken: ''
  }
})
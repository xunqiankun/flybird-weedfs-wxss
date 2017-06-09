//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    grids: [0, 1, 2, 3, 4],
    motto: 'Hello World',
    userInfo: {},
    userMsg: []
  },
  //事件处理函数
  toUpLoadFile: function() {
    wx.navigateTo({
      url: '../uploadfile/uploadfile'
    })
  },
  onLoad: function () { 
    var that = this

    that.getNewUserMsg()

  },
  getNewUserMsg(){
    var that = this
    var userMsgLastId = app.globalData.userMsgLastId

    var apiurl = app.apiUrls.getUserLastMsg
    var apidata = { userMsgLastId: userMsgLastId}

    app.apiPost(2, apiurl, apidata, function (res) {
      var UserLastMsg = res.userMsgList
      var userMsg = app.globalData.userMsg
      for (var i = 0; i<UserLastMsg.length;i++){
        userMsg.unshift(UserLastMsg[i])
      }
      // 更新最新消息Id
      if (userMsg.length>0){
        var _newUserMsgLastId = userMsg[0].msgid
        app.globalData.usegetUserLastMsgrMsg = _newUserMsgLastId
        wx.setStorageSync('userMsgLastId', _newUserMsgLastId)
      }

      app.globalData.userMsg = userMsg
      wx.setStorageSync('userMsg', userMsg)
      that.setData({
        userMsg: userMsg
      })
    })

  }
})

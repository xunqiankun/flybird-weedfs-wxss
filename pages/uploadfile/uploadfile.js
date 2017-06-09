var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var sourceType = [['camera'], ['album'], ['camera', 'album']]
var sizeType = [['compressed'], ['original'], ['compressed', 'original']]

var camera = [['front'], ['back'], ['front', 'back']]
var duration = Array.apply(null, { length: 60 }).map(function (n, i) {
  return i + 1
})

function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

Page({
    data: {
        tabs: ["采集图片", "采集视频"],
        activeIndex: 1,
        sliderOffset: 0,
        sliderLeft: 0,

        imageList: [],
        sourceTypeIndex: 2,
        sourceType: ['拍照', '相册', '拍照或相册'],

        cameraIndex: 2,
        camera: ['前置', '后置', '前置或后置'],

        sizeTypeIndex: 2,
        sizeType: ['压缩', '原图', '压缩或原图'],

        durationIndex: 59,
        duration: duration.map(function (t) { return t + '秒' }),

        src: '',

        countIndex: 8,
        count: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    },
    onLoad: function () {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },
    sourceTypeChange: function (e) {
      this.setData({
        sourceTypeIndex: e.detail.value
      })
    },
    cameraChange: function (e) {
      this.setData({
        cameraIndex: e.detail.value
      })
    },
    durationChange: function (e) {
      this.setData({
        durationIndex: e.detail.value
      })
    },
    sizeTypeChange: function (e) {
      this.setData({
        sizeTypeIndex: e.detail.value
      })
    },
    countChange: function (e) {
      this.setData({
        countIndex: e.detail.value
      })
    },
    chooseImage: function () {
      var that = this
      wx.chooseImage({
        sourceType: sourceType[this.data.sourceTypeIndex],
        sizeType: sizeType[this.data.sizeTypeIndex],
        count: this.data.count[this.data.countIndex],
        success: function (res) {
          console.log(res)
          that.setData({
            imageList: res.tempFilePaths
          })
        }
      })
    },
    previewImage: function (e) {
      var current = e.target.dataset.src

      wx.previewImage({
        current: current,
        urls: this.data.imageList
      })
    },
    chooseVideo: function () {
      var that = this
      wx.chooseVideo({
        sourceType: sourceType[this.data.sourceTypeIndex],
        camera: camera[this.data.cameraIndex],
        maxDuration: duration[this.data.durationIndex],
        success: function (res) {
          that.setData({
            src: res.tempFilePath
          })
        }
      })
    },
    onReady: function (res) {
      this.videoContext = wx.createVideoContext('myVideo')
    },
    inputValue: '',
    bindInputBlur: function (e) {
      this.inputValue = e.detail.value
    },
    bindSendDanmu: function () {
      this.videoContext.sendDanmu({
        text: this.inputValue,
        color: getRandomColor()
      })
    }
});
const app = getApp()
Page({
  data: {
    isSave: false,              // 是否可提交

    isTime: null,               // 气泡定时器
    AlertBox: false,            // 显隐气泡
    AlertTxt: '',               // 气泡文案

    toTime: null,               // 气泡定时器
    ToastBox: false,            // 显隐气泡
    ToastTxt: '',               // 气泡文案

    seriesId: '',
    subCateId: '',
    stars: 0,
    text: '',
    place: '',
    isSuccess: true,
    oldtext: ''
  },
  // 红色提示框
  isShowAlert (txt) {
    let _this = this
    clearTimeout(this.data.isTime)
    this.data.isTime = null
    this.setData({
      AlertBox: true,
      AlertTxt: txt
    })
    this.data.isTime = setTimeout(function () {
      _this.setData({
        AlertBox: false,
        AlertTxt: ''
      })
    }, 2000)
  },
  // 黑色提示框
  isToast (txt) {
    let _this = this
    clearTimeout(this.data.toTime)
    this.data.toTime = null
    this.setData({
      ToastBox: true,
      ToastTxt: txt
    })
    this.data.toTime = setTimeout(function () {
      _this.setData({
        ToastBox: false,
        ToastTxt: ''
      })
      wx.navigateBack()
    }, 2000)
  },
  onLoad: function (option) {
    wx.setNavigationBarTitle({
      title: '写点评'
    })
    let serInfo = wx.getStorageSync('seriesInfo')
    let TXT = serInfo.F_SeriesName + serInfo.F_SubCategoryName 
    if (!serInfo.F_SeriesName) {
      TXT = serInfo.F_Nas
    }
    this.setData({
      seriesId: option.id,
      subCateId: option.uid,
      place: `关于${TXT},您想说点什么～ （不少于10个字）`
    })
  },
  isRep (testStr) {
    let resultStr = testStr.replace(/\s/g, '')
    resultStr = resultStr.replace(/\r\n/g, '')
    resultStr = resultStr.replace(/\n/g, '')
    return resultStr
  },
  inputEvn (e) {
    let tx = e.detail.value
    let txt = this.isRep(e.detail.value)
    this.setData({
      text: tx,
      oldtext: txt
    })
    if (txt.length > 9 && this.data.stars > 0) {
      this.setData({
        isSave: true
      })
    } else {
      this.setData({
        isSave: false
      })
    }
  },
  starsEvn (e) {
    // console.log(e.currentTarget.dataset.id)
    this.setData({stars: e.currentTarget.dataset.id})
    if (this.data.text.length > 10 && e.currentTarget.dataset.id > 0) {
      this.setData({
        isSave: true
      })
    } else {
      this.setData({
        isSave: false
      })
    }
  },
  issue () {
    let obj = {}
    obj.openId = wx.getStorageSync('OPENIDS')
    obj.content = encodeURIComponent(this.data.text)
    obj.seriesId = this.data.seriesId
    obj.subCateId = this.data.subCateId
    obj.star = this.data.stars
    obj.time = Date.parse(new Date())
    if (this.data.isSuccess) {
      this.setData({
        isSuccess: false
      })
      wx.getSetting({
        success: (res) => {
          if (!res.authSetting['scope.userInfo']) {
            wx.showModal({
              title: '用户未授权',
              content: '如需正常使用评论功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
              showCancel: false,
              success: (res) => {
                if (res.confirm) {
                  wx.openSetting({
                    success: (res) => {
                      // console.log('openSetting success', res.authSetting)
                      app.getUserInfo()
                    }
                  })
                }
              }
            })
          } else {
            wx.request({
              url: 'https://product.m.360che.com/index.php?r=weex/series/save-series-comment',
              data: obj,
              success: (res) => {
                if (res.data.info === 'ok') {
                  this.isToast('发布成功')
                } else {
                  this.isShowAlert('网络繁忙请稍候再试')
                  this.setData({
                    isSuccess: true
                  })
                }
              },
              fail: () => {

              }
            })
          }
        }
      })
    }
    
  },
  istoast () {
    if (this.data.stars === 0) {
      wx.showToast({
        title: '请选择星级',
        icon: 'none',
        duration: 1800
      })
      return false
    }
    if (this.data.oldtext.length < 10) {
      wx.showToast({
        title: '点评内容不少于10个字',
        icon: 'none',
        duration: 1800
      })
    }
  }
})

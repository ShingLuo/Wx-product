const app = getApp()
Page({
  data: {
    isTime: null,               // 气泡定时器
    AlertBox: false,            // 显隐气泡
    AlertTxt: '',               // 气泡文案

    toTime: null,               // 气泡定时器
    ToastBox: false,            // 显隐气泡
    ToastTxt: '',               // 气泡文案

    DATA: {},
    isZan: true,
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
    }, 2000)
  },
  onLoad: function (option) {
    let serInfo = wx.getStorageSync('seriesInfo')
    let TXT = serInfo.F_SeriesName + serInfo.F_SubCategoryName
    if (!serInfo.F_SeriesName) {
      TXT = serInfo.F_Nas
    }
    wx.setNavigationBarTitle({
      title: `${TXT}点评详情`
    })
    let obj = wx.getStorageSync('COMMSGS')
    this.setData({
      DATA: obj
    })
  },
  zan(e) {
    let json = {}
    let obj = this.data.DATA
    json.cid = obj['cid']
    json.openId = wx.getStorageSync('OPENIDS')
    json.time = Date.parse(new Date())
    if (e.currentTarget.dataset.em < 1 && this.data.isZan) {
      wx.request({
        url: 'https://product.m.360che.com/index.php?r=weex/series/save-series-comment-vote',
        data: json,
        success: (res) => {
          if (res.errMsg === 'request:ok' && res.data.info === 'ok') {
            obj['isVote'] = 1
            obj['voteNum']++
            this.setData({
              DATA: obj,
              isZan: true
            })
            // this.isToast('点赞成功')
            wx.showToast({
              title: '点赞成功',
              icon: 'success',
              duration: 1000
            })
          } else {
            this.isShowAlert('网络繁忙请稍候再试')
          }
        }
      })
    }
    if (e.currentTarget.dataset.em > 0) {
      wx.showToast({
        title: '已经点过赞',
        icon: 'none',
        duration: 2000
      })
    }
  },
})

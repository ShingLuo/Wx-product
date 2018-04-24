const app = getApp()
Page({
  data: {
    isLoad: true,
    isTime: null,               // 气泡定时器
    scrollAnimation: true,      // 禁止动画
    AlertBox: false,            // 显隐气泡
    AlertTxt: '',               // 气泡文案

    DATA: [],
  },
  isShowAlert(txt) {
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
  onLoad: function (option) {
    wx.setNavigationBarTitle({
      title: '计算结果'
    })
    const obj = JSON.parse(option.obj)
    wx.request({
      url: `${app.spdajax}speedcalculator/api/getcalculation.aspx`,
      data: obj,
      success: (res) => {
        if (res.errMsg === 'request:ok' && res.data.result === 1) {
          this.setData({
            DATA: res.data.data,
            isLoad: false
          })
        } else {
          this.isShowAlert('网络繁忙请稍候再试')
          wx.navigateBack()
        }
      },
      fail: () => {
        this.isShowAlert('网络繁忙请稍候再试')
        wx.navigateBack()
      }
    })
  },
  
})

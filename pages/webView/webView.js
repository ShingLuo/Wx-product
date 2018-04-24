Page({
  data: {
    urls: ''
  },
  // 页面初始化
  onLoad: function (options) {
    const webViewUrl = wx.getStorageSync('webViewUrl');
    this.setData({
      urls: webViewUrl
      // urls: 'https://bbs.360che.com'
    })
  }
})

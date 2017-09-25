// pages/searchResult/searchResult.js
let app = getApp(),
  util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //筛选结果数据
    resultData:{},
    //发送的数据
    getSearchData:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取选择数据的缓存
    wx.getStorage({
      key: 'getSearchData',
      success: res => {
        wx.request({
          url: `${app.ajaxurl}/index.php?r=weex/list`,
          data: res.data,
          success:ele => {
            this.setData({
              resultData:ele.data,
              getSearchData:res.data,
            })
            // 标题
            wx.setNavigationBarTitle({
              title: ele.data.h1
            })
            console.log(this.data.resultData)
          }
        })
      },
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
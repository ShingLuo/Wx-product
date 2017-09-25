// pages/searchCar/searchCar.js
let app = getApp(),
  util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //筛选页总数据
    searchData:{},
    // 是否显示 sidebar
    sidebarListPop: false,
    //sidebar  遮罩层
    shadeShow: false,
    // sidebar 所有数据
    sidebarData: {},
    //发送的数据
    getSearchData:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //请求筛选页面数据
    wx.request({
      url: `${app.ajaxurl}/index.php?r=weex/index`,
      success:res => {
        if (res.errMsg === 'request:ok'){
          this.setData({
            searchData:res.data
          })
          console.log(this.data.searchData)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  more(event){
    let id = event.currentTarget.dataset.id;
    wx.request({
      url: `${app.ajaxurl}/index.php?r=weex/index/cate-sub&cate_id=${id}`,
      success:res => {
        if (res.errMsg === 'request:ok') {
          console.log(res.data)
        }
      }
    })
    
  },
  // 点击品牌显示 sidebar
  sidebarShow(e) {
    //显示sidebar和遮罩层
    this.setData({
      sidebarListPop: true,
      shadeShow: true
    })
    let id = e.currentTarget.dataset.id;
    wx.request({
      url: `${app.ajaxurl}/index.php?r=weex/index/cate-sub&cate_id=${id}`,
      success: (res) => {
        if (res.errMsg == 'request:ok') {
          this.setData({
            sidebarData: res.data,
          })
          console.log(this.data.sidebarData)
        }
      }
    })
  },
  // 隐藏 sidebar
  sidebarListHide: function () {
    this.setData({
      sidebarListPop: false,
      shadeShow: false
    })
  },
  goResult(e){
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name

    let getSearchData = {};
    getSearchData[name] = id;

    //隐藏sidebar
    this.setData({
      sidebarListPop: false,
      shadeShow: false,
      getSearchData: getSearchData
    })

    wx.setStorage({
      key: 'getSearchData',
      data: getSearchData,
      success:res => {
        wx.navigateTo({
          url: '../searchResult/searchResult',
        })
      }
    })

  }
})
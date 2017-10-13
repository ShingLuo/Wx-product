// pages/searchResult/searchResult.js
let app = getApp(),
  util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //暂时存放的存储车系信息
    seriesInfo:{},
    //筛选结果数据
    resultData:{},
    //查看选中的类别
    typeIndex: '',
    //查看选中的发送参数名称
    typeName:'',
    //paramId
    paramId:[],
    // 是否显示 sidebar
    sidebarListPop: false,
    //sidebar  遮罩层
    shadeShow: false,
    // sidebar 所有数据
    sidebarData: {},
    //存储sidebar 列表的数量
    seriesListNumber:[],
    //发送的数据
    getSearchData:{
      brandId:'',
      paramId:'',
      order:'',
      page:1,
    },
    //展开分类选项
    fold:false,
    // 品牌索引导航
    indicateShow: true,
    indicateText: '',
    activeIndex: '',
    navInfo: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSearchData();
  },




  // 隐藏 sidebar
  sidebarListHide: function () {
    this.setData({
      sidebarListPop: false,
      shadeShow: false
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
})
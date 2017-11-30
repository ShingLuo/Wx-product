Page({
  data: {
    // 汽车排行
    carList:[],
    typeEN: '',
    searchList: [],
    locationInfo: {},
    //滚动容器动画
    scrollAnimation: true,
  },
  // 事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onShow:function(options){

  },
  // 切换车型
  cutBtn(e){
    this.setData({
      typeEN: e.currentTarget.dataset.tp
    })
    this.initData(e.currentTarget.dataset.tp)
  },
  // 跳转车型综述
  goMsg(e){
    var inx = parseInt(e.currentTarget.dataset.inx)
    var json = {
      locationInfo: this.data.locationInfo,
      productData:{
        F_SeriesId: this.data.carList[inx]['F_SeriesId'],
        F_ProductId: this.data.carList[inx]['F_ProductId']
      },
      seriesId: this.data.carList[inx]['F_SubCategoryId']
    }
    wx.navigateTo({
      url: '/pages/model/model?share=' + JSON.stringify(json)
    })
  },
  goPay(e){
    let productId = e.currentTarget.dataset.id
    //其他询底价
    wx.setStorage({
        key: 'priceProductId',
        data: productId,
        success: () => {
            wx.navigateTo({
                url: '../footerPrice/footerPrice',
            })
        }
    })
  },
  // 页面初始化
  onLoad: function (options) {
    //设置标题
    wx.setNavigationBarTitle({
      title: '热销排行'
    })
    this.initData()
    this.getLocation()
  },
  initData(tps){
    let urls = 'https://product.360che.com/index.php?r=weex/top/hot-sale';
    if(tps){
      urls += '&type=' + tps
    }
    wx.request({
      url: urls,
      data: {},
      success: (res) => {
        if (res.errMsg == 'request:ok' && res.data.code == 1) {
          // this.cancelLoading();
          //设置省份和indexNav数据
          this.setData({
            carList: res.data.data.list,
            searchList: res.data.data.searchList,
            typeEN: res.data.data.typeEnName
          })
        }
      }
    })
  },
  //定位地区
  getLocation() {
    // 微信获取经纬度
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        var latitude = res.latitude
        var longitude = res.longitude
        // 获取当前位置省市
        wx.request({
          url: 'https://product.360che.com/index.php?r=m/ajax/location/pos&longitude=' + longitude + '&latitude=' + latitude,
          data: {},
          success: (res) => {
            if (res.errMsg == 'request:ok') {
              let myRegion = {};
              myRegion.provincename = res.data.province.name
              myRegion.provincesn = res.data.province.id
              myRegion.cityname = res.data.city.name
              myRegion.citysn = res.data.city.id

              // 设置定位地区
              this.setData({
                locationInfo: myRegion
              })
              //存储定位城市
              wx.setStorage({
                key: "myRegion",
                data: myRegion
              })
            }
          }
        })
      },
      fail:ele => {
      }
    })
  }
})

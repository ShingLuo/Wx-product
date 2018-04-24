Page({
  data: {
    // 汽车排行
    carList:[],
    typeEN: '',
    navInx: 0,      // 索引菜单项目
    navAll: 0,        // 三菜单
    searchList: [],    // 类型
    typeList: [],      // 菜单类
    locationInfo: {},
    //滚动容器动画
    scrollAnimation: true,
    // 回顶部显示隐藏
    goTop: false,
    subId: 0,
    navInfo: '',
    isRequest: true    //  是否请求数据锁
  },
  // 事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onShow:function(options){

  },
  // 页面滑动索引导航固定
  scrollNav (e) {
    if (e.detail.scrollTop >= 1500) {
      this.setData({
        goTop: true
      })
    } else {
      this.setData({
        goTop: false
      })
    }
  },
  // 切换车型
  cutBtn (e) {
    this.setData({
      typeEN: e.currentTarget.dataset.tp,
      navInx: e.currentTarget.dataset.inx,
      navInfo: 'top'
    })
    if (this.data.navAll) {
      this.searchAll({ 
        desc: e.currentTarget.dataset.tp,
        type: this.data.navAll
      })
      return
    }
    this.searchAll({ desc: e.currentTarget.dataset.tp })
    
  },
  navType (e) {
    this.setData({
      navAll: e.currentTarget.dataset.ty
    })
    this.searchAll({
      desc: this.data.typeEN,
      type: e.currentTarget.dataset.ty
    })
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
    this.initData()
    this.getLocation()
  },
  initData () {
    let urls = 'https://product.360che.com/index.php?r=api/top/index'
    wx.request({
      url: urls,
      data: {},
      success: (res) => {
        if (res.errMsg == 'request:ok' && res.data.code == 1) {
          wx.setNavigationBarTitle({
            title: res.data.data.title
          })
          //设置省份和indexNav数据
          this.setData({
            carList: res.data.data.list,
            searchList: res.data.data.topList
          })
        }
      }
    })
  },
  searchAll (obj) {
    let urls = 'https://product.360che.com/index.php?r=api/top/detail'
    wx.showLoading({
      title: ' ',
    })
    if (!this.data.isRequest) {
      return false
    }
    this.setData({isRequest: false})
    wx.request({
      url: urls,
      data: obj,
      success: (res) => {
        if (res.errMsg == 'request:ok' && res.data.code == 1) {
          wx.setNavigationBarTitle({
            title: res.data.data.title
          })
          //设置省份和indexNav数据
          let navNum = 0
          for (let em in res.data.data.typeList) {
            if (res.data.data.typeList[em]['default'] == 1) {
              navNum = res.data.data.typeList[em]['type']
            }
          }
          this.setData({
            isRequest: true,
            navAll: navNum,
            subId: res.data.data.subCateId,
            typeList: res.data.data.typeList,
            carList: res.data.data.list,
            searchList: res.data.data.topList
          })
          wx.hideLoading()
        }
      }
    })
  },
  toPg (e) {
    let Sid = e.currentTarget.dataset.sid
    let Tid = e.currentTarget.dataset.id
    let groups = []
    switch (e.currentTarget.dataset.tp) {
      case 1:
        groups.push(e.currentTarget.dataset.group)
        groups.push(e.currentTarget.dataset.name)
        groups.push(this.data.searchList[this.data.navInx]['name'])
        wx.setStorageSync('myGroups', groups)
        wx.navigateTo({
          url: `/pages/group/group?t=${e.currentTarget.dataset.tog}`,
        })
        break;
      case 2:
        wx.navigateTo({
          url: `/pages/groupMsg/groupMsg?id=${Tid}`
        })
        break;
      case 3:
        wx.navigateTo({
          url: `/pages/follow/lists/lists?id=${Tid}`
        })
        break;
      case 4:
        wx.navigateTo({
          url: `/pages/series/series?share={"seriesInfo":{"F_SeriesId": ${Tid},"F_SubCategoryId": ${Sid}}}`
        })
        break;
      default:
        wx.navigateTo({
          url: `/pages/model/model?share={"productData":{"F_SeriesId": ${e.currentTarget.dataset.ser},"F_ProductId": ${Tid}},"seriesId": ${Sid}}`
        })
        break;
    }
  },
  //进入询底价页面
  goFooterPrice (e) {
    //其他询底价
    try {
      wx.setStorageSync('priceProductId', e.currentTarget.dataset.id)
    } catch (err) {}
    wx.navigateTo({
      url: '/pages/footerPrice/footerPrice',
    })
  },
  //定位地区
  getLocation () {
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
  },
  // 点击返回顶部
  backTop (e) {
    this.setData({
      navInfo: 'top'
    })
  }
})

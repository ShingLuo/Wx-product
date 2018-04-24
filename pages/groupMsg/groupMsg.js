Page({
  data: {
    scrollAnimation: true,
    navInfo: '',        // 猫链接
    navInx: '',         // 索引
    isHet: 0,           // 是否展开         
    checkNum: 0,        // 换一换
    brandName: '',      // 标题
    subList: [],        // 四大类按钮列表
    subCateList: [],    // 四大类车型列表
    postList: {},       // 论坛信息
    brandHotPro: [],    // 热门车型列表
    bdHP: [],           // 热门车型小列表
    articleList: [],    // 文章列表
  },
  // 换一换组内
  checkHP () {
    let chNum = this.data.checkNum
    chNum++
    if (chNum === this.data.brandHotPro.length - 1){
      this.setData({
        bdHP: this.data.brandHotPro[chNum],
        checkNum: -1
      })
    } else {
      this.setData({
        bdHP: this.data.brandHotPro[chNum],
        checkNum: chNum
      })
    }
  },
  onShow:function(options){},
  // 跳转车型图片页
  goMsg(e){
    const inx = parseInt(e.currentTarget.dataset.inx)
    // console.log(inx)
    const json = {
      seriesInfo: {
        F_SeriesId: this.data.bdHP[inx]['seriesInfo']['F_SeriesId'],
        F_SubCategoryId: this.data.bdHP[inx]['seriesInfo']['F_SubCategoryId']
      },
      photoData:{ typeId: 0 },
      productId: this.data.bdHP[inx]['F_ProductId']
    }
    // console.log(json)
    wx.navigateTo({
      url: '/pages/modelPhoto/modelPhoto?share=' + JSON.stringify(json)
    })
  },
  // 车系页
  goCarX (e) {
    const idx = e.currentTarget.dataset.idx
    const inx = e.currentTarget.dataset.inx
    const json = {
      seriesInfo: {
        F_SeriesId: this.data.subCateList[idx]['list'][inx]['F_SeriesId'],
        F_SubCategoryId: this.data.subCateList[idx]['list'][inx]['F_SubCategoryId']
      }
    }
    wx.navigateTo({
      url: '/pages/series/series?share=' + JSON.stringify(json)
    })
  },
  goView (e) {
    // console.log(e.currentTarget.dataset.url)
    wx.setStorage({
      key: 'webViewUrl',
      data: e.currentTarget.dataset.url,
      success: function () {
        wx.navigateTo({
          url: '/pages/webView/webView'
        })
      }
    })
  },
  checkDow () {
    this.setData({isHet: this.data.isHet > 0 ? 0 : 1})
  },
  // 询价
  xunPay (e) {
    wx.setStorage({
      key: 'priceProductId',
      data: e.currentTarget.dataset.pid,
      success: () => {
        wx.navigateTo({
          url: '../footerPrice/footerPrice',
        })
      }
    })
  },
  // 页内猫链接
  anchorEvn (e) {
    const ids = 'hot_car' + e.currentTarget.dataset.inx
    this.setData({
      navInfo: ids,
      navInx: e.currentTarget.dataset.inx
    })
  },
  // 页面初始化
  onLoad: function (option) {
    this.initData(option.id)
  },
  initData (ids) {
    let urls = 'https://product.360che.com/index.php?r=api/brand/detail';
    if (ids) {
      urls += '&id=' + ids
    }
    wx.request({
      url: urls,
      data: {},
      success: (res) => {
        if (res.data.code === 1) {
          wx.setNavigationBarTitle({
            title: res.data.data.brandName
          })
          this.setData({
            brandName: res.data.data.brandName,
            subList: res.data.data.subList,
            subCateList: res.data.data.subCateList,
            postList: res.data.data.postList,
            brandHotPro: res.data.data.brandHotPro,
            bdHP: res.data.data.brandHotPro[0],
            articleList: res.data.data.articleList,
            checkNum: res.data.data.brandHotPro.length > 1 ? 0 : -1
          })
        }
      }
    })
  }
})

Page({
  data: {
    scrollAnimation: true,
    navInfo: '',        // 猫链接
    navInx: '',         // 索引
    isHet: 0,           // 是否展开

    subList: [],        // 分类项
    seriesList: [],     // 车系列表
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
    let Sid = this.data.seriesList[e.currentTarget.dataset.inx]['F_SubCategoryId']
    let Tid = this.data.seriesList[e.currentTarget.dataset.inx]['F_SeriesId']
    switch (e.currentTarget.dataset.num) {
      case '1':
        wx.navigateTo({
          url: `/pages/series/series?share={"seriesInfo":{"F_SeriesId": ${Tid},"F_SubCategoryId": ${Sid}}}`
        })
        break;
      case '2':
        wx.navigateTo({
          url: `/pages/seriesConfig/seriesConfig?share={"seriesInfo":{"F_SeriesId": ${Tid},"F_SubCategoryId": ${Sid}}}`
        })
        break;
      default:
        wx.navigateTo({
          url: `/pages/seriesPhoto/seriesPhoto?share={"seriesInfo":{"F_SeriesId": ${Tid},"F_SubCategoryId": ${Sid}}}`
        })
        break;
    }
    
  },
  // 车型页
  goXar (e) {
    const idx = e.currentTarget.dataset.idx
    const inx = e.currentTarget.dataset.inx
    wx.navigateTo({
      url: `/pages/model/model?share={"productData":{"F_SeriesId": ${this.data.seriesList[idx]['list'][inx]['F_SeriesId']},"F_ProductId": ${this.data.seriesList[idx]['list'][inx]['F_ProductId']}},"seriesId": ${this.data.seriesList[idx]['list'][inx]['F_SubCategoryId']}}`
    })
  },
  // 进入询底价页面
  goFooterPrice(e) {
    console.log(e.currentTarget.dataset.id)
    //其他询底价
    try {
      wx.setStorageSync('priceProductId', e.currentTarget.dataset.id)
    } catch (err) { }
    wx.navigateTo({
      url: '/pages/footerPrice/footerPrice',
    })
  },
  checkDow () {
    this.setData({isHet: this.data.isHet > 0 ? 0 : 1})
  },
  // 页内猫链接
  anchorEvn (e) {
    const ids = 'hot_car' + e.currentTarget.dataset.inx
    this.setData({
      navInfo: ids,
      navInx: e.currentTarget.dataset.inx,
      isHet: 0
    })
  },
  // 页面初始化
  onLoad: function (option) {
    this.initData(option.id)
  },
  initData (ids) {
    let urls = 'https://product.360che.com/index.php?r=api/series/series'
    if (ids) {
      urls += '&id=' + ids
    }
    wx.request({
      url: urls,
      data: {},
      success: (res) => {
        if (res.data.code === 1) {
          wx.setNavigationBarTitle({
            title: res.data.data.name
          })
          let List = res.data.data.seriesList
          for (let inx in res.data.data.subList) {
            for (let nums in List[inx]['list']) {
              List[inx]['list'][nums]['F_Price'] = parseFloat(List[inx]['list'][nums]['F_Price'])
            }
          }
          this.setData({
            subList: res.data.data.subList,
            seriesList: List
          })
        }
      }
    })
  }
})

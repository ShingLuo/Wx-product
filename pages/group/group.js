Page({
  data: {
    scrollAnimation: true,    //滚动容器动画
    navInfo: '',              // 返回顶部
    goTop: false,             // 回顶部显示隐藏
    oneMor: [],               // 是否折叠
    defaTon: 0,               // 车重
    brandGroupInfo: {},       // 信息
    brandList: [],            // 品牌列表
    brandSeriesList: [],      // 车系列表
    tonnageList: [],          // 车重分类
  },
  // 车系页
  goCarX (e) {
    const idx = e.currentTarget.dataset.idx
    const inx = e.currentTarget.dataset.inx
    const json = {
      seriesInfo: {
        F_SeriesId: this.data.brandSeriesList[idx]['seriesList'][inx]['F_SeriesId'],
        F_SubCategoryId: this.data.brandSeriesList[idx]['seriesList'][inx]['F_SubCategoryId']
      }
    }
    wx.navigateTo({
      url: '/pages/series/series?share=' + JSON.stringify(json)
    })
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
  // 去品牌页
  goBrand (e) {
    wx.navigateTo({
      url: '/pages/groupMsg/groupMsg?id=' + e.currentTarget.dataset.id
    })
  },
  // 点击返回顶部
  backTop(e) {
    this.setData({
      navInfo: 'top'
    })
  },
  // 页面滑动索引导航固定
  scrollNav(e) {
    if (e.detail.scrollTop >= 1200) {
      this.setData({
        goTop: true
      })
    } else {
      this.setData({
        goTop: false
      })
    }
  },
  // 切换吨位
  tonnEvn (e) {
    this.setData({ defaTon: e.currentTarget.dataset.inx})
    this.initData(this.data.groupName[0], e.currentTarget.dataset.val)
    if (e.currentTarget.dataset.inx > 0) {
      wx.setNavigationBarTitle({
        title: `${this.data.groupName[1]}${this.data.tonnageList[e.currentTarget.dataset.inx]['name']}`
      })
    } else {
      wx.setNavigationBarTitle({
        title: this.data.groupName[1]
      })
    }
  },
  // 加载更多
  mroEvn (e) {
    let oneMor = this.data.oneMor
    let bdList = this.data.brandSeriesList
    if (oneMor[e.currentTarget.dataset.inx] === bdList[e.currentTarget.dataset.inx]['seriesList'].length) {
      oneMor[e.currentTarget.dataset.inx] = 5
    } else {
      oneMor[e.currentTarget.dataset.inx] = bdList[e.currentTarget.dataset.inx]['seriesList'].length
    }
    this.setData({oneMor: oneMor})
  },
  // 页面初始化
  onLoad: function (options) {
    const resdata = wx.getStorageSync('myGroups');
    this.setData({
      groupName: resdata
    })
    //设置标题
    if (resdata[1]) {
      wx.setNavigationBarTitle({
        title: resdata[1] + resdata[2]
      })
    }
    if (options.t) {
      this.initData(resdata[0], options.t)
      return
    }
    this.initData(resdata[0])
  },
  initData (tps, ton) {
    let urls = 'https://product.m.360che.com/index.php?r=api/group/index';
    if (tps) {
      urls += '&group=' + tps
    }
    if (ton) {
      urls += '&tonnage=' + ton
    }
    wx.request({
      url: urls,
      data: {},
      success: (res) => {
        if (res.data.code === 1) {
          this.setData({
            brandGroupInfo: res.data.data.brandGroupInfo,
            brandList: res.data.data.brandGroupInfo.brandList,
            brandSeriesList: res.data.data.brandSeriesList,
            tonnageList: res.data.data.tonnageList
          })
          let oneMos = []
          let inxAct = 0
          for (let en in res.data.data.brandSeriesList) {
            oneMos.push(5)
          }
          for (let num in res.data.data.tonnageList) {
            if (res.data.data.tonnageList[num]['default']) {
              inxAct = num
            }
          }
          this.setData({
            oneMor: oneMos,
            defaTon: inxAct
          })
        }
      }
    })
  }
})

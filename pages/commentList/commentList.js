const app = getApp()
Page({
  data: {
    isTop: '',
    goTop: false,
    isLoad: true,
    isMore: true,
    lodMore: true,
    scrollAnimation: true,      // 禁止动画

    isTime: null,               // 气泡定时器
    AlertBox: false,            // 显隐气泡
    AlertTxt: '',               // 气泡文案

    toTime: null,               // 气泡定时器
    ToastBox: false,            // 显隐气泡
    ToastTxt: '',               // 气泡文案

    stars: 0,
    seriesId: '',
    subCateId: '',
    pages: 1,

    comList: [],
    comNum: 0,
    isZan: true,
  },
  // 红色提示框
  isShowAlert (txt) {
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
  // 黑色提示框
  isToast (txt) {
    let _this = this
    clearTimeout(this.data.toTime)
    this.data.toTime = null
    this.setData({
      ToastBox: true,
      ToastTxt: txt
    })
    this.data.toTime = setTimeout(function () {
      _this.setData({
        ToastBox: false,
        ToastTxt: ''
      })
    }, 2000)
  },
  onShow: function (params) {
    // 点评列表
    this.getComList()
  },
  onLoad: function (option) {
    let serInfo = wx.getStorageSync('seriesInfo')
    let TXT = serInfo.F_SeriesName + serInfo.F_SubCategoryName
    if (!serInfo.F_SeriesName) {
      TXT = serInfo.F_Nas
    }
    wx.setNavigationBarTitle({
      title: `${TXT}点评`
    })
    this.setData({
      seriesId: option.id,
      subCateId: option.uid,
    })
    // this.getComList()
  },
  onHide: function () {
    this.setData({
      isLoad: true,
      pages: 1,
      comList: [],
      isMore: true
    })
  },
  zan(e) {
    let json = {}
    let obj = this.data.comList
    json.cid = obj[e.currentTarget.dataset.inx]['cid']
    json.openId = wx.getStorageSync('OPENIDS')
    json.time = Date.parse(new Date())
    if (e.currentTarget.dataset.em < 1 && this.data.isZan) {
      wx.request({
        url: 'https://product.m.360che.com/index.php?r=weex/series/save-series-comment-vote',
        data: json,
        success: (res) => {
          if (res.errMsg === 'request:ok' && res.data.info === 'ok') {
            obj[e.currentTarget.dataset.inx]['isVote'] = 1
            obj[e.currentTarget.dataset.inx]['voteNum']++
            this.setData({ 
              comList: obj,
              isZan: true
             })
            // this.isToast('点赞成功')
            wx.showToast({
              title: '点赞成功',
              icon: 'success',
              duration: 1000
            })
          }
        }
      })
    }
    if (e.currentTarget.dataset.em > 0) {
      wx.showToast({
        title: '已经点过赞',
        icon: 'none',
        duration: 2000
      })
    }
  },
  getComList() {
    let json = {}
    json.page = this.data.pages
    json.openId = wx.getStorageSync('OPENIDS')
    json.seriesId = this.data.seriesId
    json.subCateId = this.data.subCateId
    json.time = Date.parse(new Date())
    if (!this.data.isMore) {
      return false
    }
    if (this.data.lodMore) {
      this.setData({
        lodMore: false
      })
    } else {
      return false
    }
    wx.request({
      url: 'https://product.m.360che.com/index.php?r=weex/series/get-series-comment-list',
      data: json,
      success: (res) => {
        if (res.errMsg === 'request:ok' && res.data.info === 'ok') {
          let ress = res.data.list
          let pg = this.data.pages
          for (let em in ress) {
            ress[em]['time'] = app.getDateDiff(ress[em]['time'])
            ress[em]['content'] = decodeURIComponent(ress[em]['content'])
          }
          let COL = this.data.comList
          COL.push(...ress)
          pg++
          this.setData({
            pages: pg,
            comList: COL,
            comNum: res.data.num,
            isLoad: false,
            lodMore: true,
            isMore: res.data.page < pg ? false : true
          })
        }
      }
    })
  },
  // 跳转评论列表
  goComMsg(e) {
    wx.setStorageSync('COMMSGS', this.data.comList[e.currentTarget.dataset.inx])
    wx.navigateTo({
      url: '../commentMsg/commentMsg'
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
  // 点击返回顶部
  backTop(e) {
    this.setData({
      isTop: 'goTop'
    })
  },
  // 黑色提示框
  isToast(txt) {
    let _this = this
    clearTimeout(this.data.toTime)
    this.data.toTime = null
    this.setData({
      ToastBox: true,
      ToastTxt: txt
    })
    this.data.toTime = setTimeout(function () {
      _this.setData({
        ToastBox: false,
        ToastTxt: ''
      })
    }, 2000)
  },
  // 增加评论
  addCom () {
    wx.navigateTo({
      url: `../commentForm/commentForm?id=${this.data.seriesId}&uid=${this.data.subCateId}`,
    })
  },
})

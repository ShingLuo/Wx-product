Page({
  data: {
    isTime: null,               // 气泡定时器
    goTop: false,               // 会顶部按钮
    Scrolls: '',                // 回顶部
    scrollAnimation: true,      // 禁止动画
    isMore: true,               // 是否加载更多
    addMore: false,             // 锁定滑动加载更多
    AlertBox: false,            // 显隐气泡
    AlertTxt: '',               // 气泡文案
    driveList: [],              // 驱动组
    Ones: [],                   // 用途类别
    Twos: [],                   // 路况
    isSolid: false,             // 侧边栏
    inxShow: true,              // 字母品牌
    navInfo: '',           

    isLoad: true,               // 初始是否加载
    pages: 1,                   // 步骤页
    OneIndex: 0,                // step索引类别
    indexId: 0,                 // 类别id
    driveId: 0,                 // 组id
    tonVal: '',                 // 吨
    roadId: 0,                  // 驾驶路况
    slopeVal: '',               // 坡度
    speedVal: '',               // 车速
    order: 1,                   // 排序
    pg: 0,                      // 加载页码
    brandId: 'nosel',           // 品牌ID

    DATA: {},
    brandHot: [],
    brandList:{},
    letters:[],
    productList:[],
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '卡车之家'
    })
    this.initOne()
  },
  // onShow:function(options){},
  // 按钮步骤
  oneBtn(e){
    if(this.data.indexId === 0){
      return this.isShowAlert('请选择用途类别')
    }
    if(this.data.driveId === 0){
      return this.isShowAlert('请选择驱动形式')
    }
    if(this.data.tonVal === '' || 
      this.data.tonVal < 5 || 
      this.data.tonVal > 150){
      return this.isShowAlert('请确认车货总重（5-150吨）')
    }
    this.goPg(Number(e.currentTarget.dataset.pg))
  },
  twoBtn(e){
    this.goPg(Number(e.currentTarget.dataset.pg))
  },
  ovrBtn(e){
    if(this.data.roadId === 0){
      return this.isShowAlert('请选择驾驶路况')
    }
    if(this.data.slopeVal === '' || 
      this.data.slopeVal < 0 || 
      this.data.slopeVal > 12){
      return this.isShowAlert('请确认平均坡度（0-12％）')
    }
    if(this.data.speedVal === '' || 
      this.data.speedVal < 30 || 
      this.data.speedVal > 120){
      return this.isShowAlert('请确认平均经济车速（30-120km/h）')
    }
    this.setData({isLoad: true})
    this.loadData('lastPg',Number(e.currentTarget.dataset.pg))
  },
  // 重置筛选
  regBtn(e){
    this.setData({
      tonVal: '',
      navInfo: '',
      pg: 0,
      brandId: 'nosel',
      order: 1,
      indexId: 0,
      isMore: true,
      addMore: false,
      driveId: 0
    })
    this.goPg(Number(e.currentTarget.dataset.pg))
  },
  // 开始选择事件
  subBtn(e){
    let inx = Number(e.currentTarget.dataset.id)
    this.setData({
      tonVal: '',
      OneIndex: inx,
      indexId: this.data.Ones[inx]['subId']
    })
  },
  driBtn(e){
    if(this.data.indexId === 0){
      return this.isShowAlert('请选择用途类别')
    }
    this.setData({
      roadId: 0,
      slopeVal: '',
      speedVal: '',
      driveId: e.currentTarget.dataset.id
    })
    this.loadSech(1)
  },
  roaBtn(e){
    let inx = Number(e.currentTarget.dataset.id)
    // console.log(inx)
    this.setData({
      slopeVal: '',
      speedVal: '',
      roadId: this.data.Twos[inx]['id']
    })
    this.loadSech(5)
  },
  chengInput(e){
    let input = e.detail.value
    let num = Number(e.target.dataset.id)
    input = input.replace(/[^\d^\.]/g, '')
    if (input && num !== 1) {
      input = parseFloat(input.match(/\.*(.+)/)[1])
    }
    switch(num){
      case 0:
        this.setData({
          tonVal: input
        })
        break;
      case 1:
        this.setData({
          slopeVal: input
        })
        break;
      default:
        this.setData({
          speedVal: input
        })
    }
  },
  // 驱动页面转换
  goPg(num){
    this.setData({
      pages: num
    })
  },
  // 页面初始化请求
  initOne(){
    wx.request({
      url: 'https://product.360che.com/index.php?r=api/select/index',
      data: {},
      success: (res) => {
        if (res.errMsg === 'request:ok' && res.data.code === 1) {
          let oneIndex = 0
          for(let i in res.data.data.subList){
            if(res.data.data.subList[i]['subId'] === res.data.data.defaultSubId){
              oneIndex = i
              break
            }
          }
          this.setData({
            isLoad: false,
            OneIndex: oneIndex,
            driveList: res.data.data.driveList,
            Ones: res.data.data.subList,
            Twos: res.data.data.roadList
          })
        }
      }
    })
  },
  // 步骤请求
  loadSech(num){
    let urls = 'https://product.m.360che.com/index.php?r=api/select/param'
    switch(num){
      case 1:
        urls = `${urls}&subId=${this.data.indexId}&driveId=${this.data.driveId}&type=1`
        break;
      case 5:
        urls = `${urls}&subId=${this.data.indexId}&driveId=${this.data.driveId}&roadId=${this.data.roadId}&type=5`
        break;
      default:
        urls = `${urls}&subId=${this.data.indexId}&driveId=${this.data.driveId}&roadId=${this.data.roadId}&type=7`
    }
    wx.request({
      url: urls,
      data: {},
      success: (res) => {
        if (res.errMsg === 'request:ok' && res.data.code === 1) {
          switch(num){
            case 1:
              this.setData({
                tonVal: res.data.data.value
              })
              break;
            case 5:
              this.setData({
                slopeVal: res.data.data.value
              })
              this.loadSech(7)
              break;
            default:
              this.setData({
                speedVal: res.data.data.value
              })
          }
        }
      }
    })
  },
  // 筛选结果
  loadData(num,goPgs){
    let pgs = this.data.pg
    let urls = 'https://product.m.360che.com/index.php?r=api/select/list'
    urls = `${urls}&subId=${this.data.indexId}&driveId=${this.data.driveId}&roadId=${this.data.roadId}&weighTotal=${this.data.tonVal}&avgGradient=${this.data.slopeVal}&maxEncSpeed=${this.data.speedVal}&order=${this.data.order}&page=${this.data.pg}&brandId=${this.data.brandId}`
    wx.request({
      url: urls,
      data: {},
      success: (res) => {
        if (res.errMsg === 'request:ok' && res.data.code === 1) {
          let pdList = res.data.data.productList
          pgs++
          console.log(pdList.length)
          if(pdList.length !== 10){
            this.setData({
              isMore: false
            })
          }
          if(num && num !== 'lastPg'){
            let List = this.data.productList
            List.push(...res.data.data.productList)
            this.setData({
              pg: pgs,
              addMore: false,
              productList: List
            })
          } else {
            let obj = [{
              F_BrandId: 'nosel',
              F_BrandName: '不限',
              logo: false
            }]
            let Ary = res.data.data.brandList
            let Let = res.data.data.letters
            Ary.unshift(obj)
            Let.unshift('nosel')
            if(num === 'lastPg'){
              if(pdList.length > 0){
                this.goPg(goPgs)
                this.setData({
                  pg: pgs,
                  isLoad: false,
                  DATA: res.data.data,
                  brandHot: res.data.data.brandHot,
                  brandList: Ary,
                  letters: Let,
                  productList: res.data.data.productList,
                })
              }else{
                this.setData({
                  isLoad: false,
                })
                this.isShowAlert('抱歉，暂无车型')
              }
            }else{
              this.setData({
                pg: pgs,
                isLoad: false,
                DATA: res.data.data,
                brandHot: res.data.data.brandHot,
                brandList: Ary,
                letters: Let,
                productList: res.data.data.productList,
              })
            }
          }
        }
      },
      fail: error => {
        this.setData({
          isLoad: false,
        })
        this.isShowAlert('网络中断，请稍后重试')
      }
    })
  },
  loadMore(){
    if(this.data.DATA.pageCount > this.data.pg && this.data.isMore){
      if(!this.data.addMore){
        this.setData({
          addMore: true
        })
        this.loadData(1)
      }
    } else {
      this.setData({
        isMore: false
      })
    }
  },
  // 品牌id
  brdBtn(e){
    if(e.currentTarget.dataset.id === 'nosel'){
      this.setData({
        pg: 0,
        isMore: true,
        isSolid: false,
        brandId: 'nosel'
      })
    } else {
      this.setData({
        pg: 0,
        isSolid: false,
        isMore: true,
        brandId: e.currentTarget.dataset.id
      })
    }
    this.loadData()
  },
  // 热度和价格排序
  selectOrder(e){
    let num = Number(e.currentTarget.dataset.order)
    // console.log('order',this.data.order,'num',num)
    if(this.data.order === 1 && num === 1) return false
    if(this.data.order === 4 && num === 3){
      num = 4
    }
    switch(num){
      case 3:
        this.setData({pg: 0,order: 4})
        break;
      case 4:
        this.setData({pg: 0,order: 3})
        break;
      default:
        this.setData({pg: 0,order: 1})
    }
    this.loadData()
  },
  // 进入车型页
  goMod(e){
    wx.setStorage({
      key: 'productData',
      data: e.currentTarget.dataset.item,
      success:() => {
        wx.navigateTo({
          url: '../model/model'
        })
      }
    })
  },
  goPrice(e){
    wx.setStorage({
      key: 'priceProductId',
      data: e.currentTarget.dataset.id,
      success: () => {
        wx.navigateTo({
          url: '../footerPrice/footerPrice',
        })
      }
    })
  },
  // 页面滑动索引导航固定
  scrollNav(e){
    if (e.detail.scrollTop >= 1200){
      this.setData({goTop:true})
    }else{
      this.setData({goTop: false})
    }
  },
  showSolid(){
    this.setData({
      isSolid: !this.data.isSolid
    })
  },
  backTop(){
    this.setData({
      goTop: false,
      Scrolls: 'goTop'
    })
  },
  isShowAlert(txt) {
    let _this = this
    clearTimeout(this.data.isTime)
    this.data.isTime = null
    this.setData({
      AlertBox: true,
      AlertTxt: txt
    })
    this.data.isTime = setTimeout(function(){
      _this.setData({
        AlertBox: false,
        AlertTxt: ''
      })
    },2000)
  },
  // 点击索引导航
  indexNav(e, info) {
    let index = e.target.dataset.index
    this.setData({
      activeIndex: index,
      inxShow: false,
      navInfo: index,
    })
    let time = setTimeout(() => {
      this.setData({
        inxShow: true,
      })
      clearTimeout(time)
    }, 500)
  },
  //导航栏
  indexNavmove(e) {
    let num = e.target.dataset.number
    let top = e.target.offsetTop
    let index = this.data.letters[Math.floor((e.changedTouches[0].pageY - e.currentTarget.offsetTop) / (top / num))]
    if (index === this.data.activeIndex){
      return 
    }
    this.setData({
      activeIndex: index,
      inxShow: false,
      scrollAnimation:false,
      navInfo: index,
    })
  },
  indexNavEnd(e){
    let time = setTimeout(() => {
      this.setData({
        inxShow: true,
        scrollAnimation: true,
      })
      clearTimeout(time)
    }, 500)  
  }
})

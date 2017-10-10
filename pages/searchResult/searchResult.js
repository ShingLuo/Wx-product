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
  //请求搜索结果数据
  getSearchData(e){
    //点击用途类别
    if (e && e.currentTarget.dataset.id) {
      //显示Loading
      this.showLoading()

      //查看是否有选中项
      let resultData = this.data.resultData
      let fold = false
      resultData.paramList.forEach((res,index) => {
        if (index > 5 && res.selName){
          fold = true;
        }
      })

      let getSearchData = this.data.getSearchData
      getSearchData.subCateId = e.currentTarget.dataset.id

      this.setData({
        fold: fold,
        sidebarListPop: false,
        shadeShow: false,
        getSearchData: getSearchData
      })
      //请求初始数据
      this.getInitialData();      
    }else{
      //获取发送subCatId
      wx.getStorage({
        key: 'getSearchData',
        success: res => {
          let getSearchData = this.data.getSearchData
          for (let key in res.data) {
            getSearchData[key] = res.data[key]
          }
          console.log(getSearchData,'getSearchData')
          this.setData({
            getSearchData: getSearchData
          })  
          //请求初始数据
          this.getInitialData();        
        }
      })
    }
  },
  //请求初始化数据
  getInitialData(){
    //获取选择数据的缓存
    wx.request({
      url: `${app.ajaxurl}/index.php?r=weex/list`,
      data: this.data.getSearchData,
      success: ele => {

        //如果有类别选项
        if (ele.data.paramList.length) {
          let number = 0;
          ele.data.paramList.forEach((el, index) => {
            if (el.fId == '7') {
              number++;
            }
          })

          //添加品牌分类
          let brand = {
            name: '品牌',
            fId: '',
            option: 'brandId'
          }
          //如果选择品牌进入页面，默认品牌为选中
          if (ele.data.brandId) {
            //修改选择分类的值。
            brand.selected = ele.data.brandId
            brand.selName = ele.data.brandName
          }
          ele.data.paramList.splice(number, 0, brand)

          //如果选择价格，进入页面默认选中价格
          console.log(ele.data)

          //如果没有子类，添加子类分类
          if (!this.data.getSearchData.subCateId) {
            let subCate = {
              name: '用途类别',
              fId: '',
              option: 'subCateId'
            }
            ele.data.paramList.unshift(subCate)
          }
        }

        //给数据赋值
        this.setData({
          resultData: ele.data
        })
        // 标题
        wx.setNavigationBarTitle({
          title: ele.data.h1
        })

        //关闭Loading
        this.hideLoading()
      }
    })
  },
  // 请求sidebar内容 && 显示sidebar
  sidebarShow(e) {
    //显示sidebar和遮罩层
    this.setData({
      sidebarListPop: true,
      shadeShow: true,
      sidebarData: {}
    })
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    let index = e.currentTarget.dataset.index
    let option = e.currentTarget.dataset.option
    let getSearchData = this.data.getSearchData

    if (name != 'brandId' || getSearchData.brandId === ''){
      getSearchData[name] = id;
    }

    this.setData({
      getSearchData: getSearchData,
      typeIndex:index,
      typeName: option
    })

    console.log(name,'name')

    //请求品牌弹层列表
    if (name == 'brandId'){
      wx.request({
        url: `${app.ajaxurl}/index.php?r=weex/list/brand-filter`,
        data: this.data.getSearchData,
        success: res => {
          if (res.errMsg == 'request:ok') {
            // 添加标题
            res.data.params = {
              name:'品牌'
            }
            let unlimited = [{
              id:'',
              name:'不限',
              unlimited:true,
            }];
            res.data.letters.unshift('top')
            res.data.brandList.unshift(unlimited)

            console.log(res.data,'res.data')

            this.setData({
              sidebarData: res.data,
            })
          }
        }
      })
    } else if (name == 'subCateId'){
      //请求用途类别列表
      wx.request({
        url: `${app.ajaxurl}/index.php?r=weex/list/cate`,
        data:this.data.getSearchData,
        success: res => {
          console.log(res.data,'subCateId')
          let unlimited = {
            'id': '',
            'name': '不限',
            'is_disable': 0
          };
          let has = 1;
          res.data.forEach(ele => {
            if (ele.selected) {
              has = 0;
            }
          })

          unlimited['selected'] = has;

          res.data.unshift(unlimited)

          this.setData({
            sidebarData: res.data,
          })
        }
      })

    }else{
      //请求其他子类数据
      wx.request({
        url: `${app.ajaxurl}/index.php?r=weex/list/param-filter`,//&subCateId=${''}&fid=${id}&paramId=${''}&brandId=${''}`,
        data: this.data.getSearchData,
        success: res => {
          if (res.errMsg == 'request:ok') {
            let unlimited = {
              'id': '',
              'name': '不限',
              'is_disable': 0
            };
            let has = 1;
            res.data.params.list.forEach(ele => {
              if (ele.selected) {
                has = 0;
              }
            })

            unlimited['selected'] = has;

            res.data.params.list.unshift(unlimited)

            this.setData({
              sidebarData: res.data,
            })
          }
        }
      })
    }
    //请求子类车系
    // wx.request({
    //   url: `${app.ajaxurl}/index.php?r=weex/list/cate&brandId=${this.brandId}&paramId=${id}`,
    //   success: (res) => {
    //     if (res.errMsg == 'request:ok') {
    //       this.setData({
    //         sidebarData: res.data,
    //       })
    //       console.log(this.data.sidebarData)
    //     }
    //   }
    // })
  },
  //点击 sidebar
  clickSidebar(e){
    //查看按钮是否是禁用状态
    let disable = e.currentTarget.dataset.disable;
    if(disable){
      return 
    }
    
    //显示Loading
    this.showLoading()

    //获取点击的id
    let id = e.currentTarget.dataset.id
    //存储 paramId
    let paramId = this.data.paramId
    //增加选择框高亮显示
    let resultData = this.data.resultData;
    //点击的名字
    let name = e.currentTarget.dataset.name
    //发送参数的值
    let getSearchData = this.data.getSearchData
    getSearchData.order = ''

    //封装 paramId 参数
    if (this.data.typeName === 'paramId'){
      paramId[this.data.typeIndex] = id;
      //暂时存储 paramId
      let arr = []

      paramId.forEach(ele => {
        if(ele){
          arr.push(ele)
        }
      })
      //存储 paramId 的值
      getSearchData[this.data.typeName] = arr.join('-')

    } else if (this.data.typeName === 'brandId'){
      //存储brandId的值
      getSearchData[this.data.typeName] = id;
    }

    //如果选择品牌的不限，那么选项显示品牌
    if (name == '不限') {
      name = ''
    }
    console.log(name)
    
    //修改选择分类的值。
    resultData.paramList[this.data.typeIndex].selected = id
    resultData.paramList[this.data.typeIndex].selName = name

    console.log(this.data.getSearchData,'this.data')

    this.setData({
      //增加列别选项的高亮显示
      resultData: resultData,
      //存储发送的存储对象
      getSearchData: getSearchData,
      //存储paramId
      paramId: paramId,
      //隐藏sidebar
      sidebarListPop: false,
      shadeShow: false
    })
    this.searchResult(res => {
      console.log(res.data)
      //改变列表的值
      let resultData = this.data.resultData;
      resultData.total = res.data.total;
      resultData.seriesList = res.data.seriesList;
      resultData.productList = res.data.productList;

      //改变标题名称
      wx.setNavigationBarTitle({
        title: res.data.h1
      })

      //重新赋值
      this.setData({
        resultData: resultData
      })

      //关闭Loading
      this.hideLoading()
    })
  },
  //点击热度和价格
  selectOrder(e) {

    let getSearchData = this.data.getSearchData
    let order = e.currentTarget.dataset.order
    //如果点击的是一样的，那么return掉
    if (getSearchData.order == order){
      return
    }

    //显示Loading
    this.showLoading()

    getSearchData.order = order
    this.setData({
      getSearchData: getSearchData
    })
    this.searchResult(res => {
      //改变列表的值
      let resultData = this.data.resultData;
      resultData.total = res.data.total;
      resultData.seriesList = res.data.seriesList;
      resultData.productList = res.data.productList;
      //改变标题名称
      wx.setNavigationBarTitle({
        title: res.data.h1
      })

      //重新赋值
      this.setData({
        resultData: resultData
      })
      //关闭Loading
      this.hideLoading()
    })
  }, 
  //搜索结果
  searchResult(callback){
    wx.request({
      url: `${app.ajaxurl}/index.php?r=weex/list&isList=1`,
      data:this.data.getSearchData,
      success:res => {
        callback(res)
      }
    })
  },
  //点击车系列表
  clickSeriesList(e){
    let id = e.currentTarget.dataset.id
    let subId = e.currentTarget.dataset.subid

    //存储车系内容
    let seriesInfo = {
      'F_SubCategoryId': subId,
      'F_SeriesId': id
    };
    this.setData({
      seriesInfo: seriesInfo
    })
    wx.setStorage({
      key: 'seriesInfo',
      data: seriesInfo,
    })

    console.log(e.currentTarget.dataset.item)

    //显示sidebar和遮罩层
    this.setData({
      //显示sidebar
      sidebarListPop: true,
      shadeShow: true,
      //置空sidebar数据内容
      sidebarData: {},
      //置空车系弹层数量
      seriesListNumber:[],
    })

    //请求车系弹层列表
    wx.request({
      url: `${app.ajaxurl}/index.php?r=weex/list/product&subId=${subId}&seriesId=${id}&paramId=${this.data.getSearchData.paramId}&brandId=${this.data.getSearchData.brandId}`,
      success:res => {       
        //改变sidebar的值并且显示sidebar
        this.setData({
          sidebarData:res.data
        })
      }
    })
  },
  //进入车系页
  goSeries(){
    wx.navigateTo({
      url: '../series/series'
    })   
  },
  //进入车型页
  goModel(e){
    let productData = this.data.seriesInfo;
    productData['F_ProductId'] = e.currentTarget.dataset.id
    wx.setStorage({
      key: 'productData',
      data: productData,
      success: () => {
        wx.navigateTo({
          url: '../model/model'
        })
      }
    })
  },
  //进入询底价页
  goFooterPrice(e){
    wx.setStorage({
      key: 'priceProductId',
      data: e.currentTarget.dataset.id,
      success: () => {
        wx.navigateTo({
          url: '../footerPrice/footerPrice'
        })
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
  fold(e){
    this.setData({
      fold:!this.data.fold
    })
  },
  //点击显示更多车系弹层列表
  loadMore(e){
    let index = e.currentTarget.dataset.index
    let seriesListNumber = this.data.seriesListNumber
    if (seriesListNumber[index]){
      seriesListNumber[index] += 5;
    }else{
      seriesListNumber[index] = 10;
    }
    this.setData({
      seriesListNumber: seriesListNumber
    })
  },
  // 点击索引导航
  indexNav(e, info) {
    let index = e.target.dataset.index;
    this.setData({
      activeIndex: index,
      indicateShow: false,
      navInfo: index,
    })
    let time = setTimeout(() => {
      this.setData({
        indicateShow: true,
      })
      clearTimeout(time)
    }, 500)

    console.log(this.data.navInfo)
  },
  //导航栏
  indexNavmove(e) {
    let num = e.target.dataset.number;
    let top = e.target.offsetTop;
    let index = this.data.indexNav[Math.floor((e.changedTouches[0].pageY - e.currentTarget.offsetTop) / (top / num))];

    if (index === this.data.activeIndex) {
      return
    }

    this.setData({
      activeIndex: index,
      indicateShow: false,
      scrollAnimation: false,
      navInfo: index,
    })
  },
  indexNavEnd(e) {
    console.log('结束')
    let time = setTimeout(() => {
      this.setData({
        indicateShow: true,
        scrollAnimation: true,
      })
      clearTimeout(time)
    }, 500)
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  showLoading: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 3000
    });
  },
  hideLoading: function () {
    wx.hideToast();
  },
})
const app = getApp()
Page({
  data: {
    isLoad: true,
    isTime: null,               // 气泡定时器
    isAlert: true,              // 风阻系数提示
    AlertBox: false,            // 显隐气泡
    AlertTxt: '',               // 气泡文案
   
    isSolid: false,             // 侧边栏
    isMask: false,              // 遮层
    inxShow: true,              // 字母品牌
    navInfo: '',                // 字母提示

    solidIndex:'',              // 侧边栏索引
    solidData:'',               // 侧边栏数据
    solidTitle: '',             // 标题

    ebrand: '',                // 发动机品牌
    ebrandVal: '',                 // 发动机品牌val-------
    emodel: '',                // 发动机型号
    emodelVal: '',                // 发动机型号val-------
    speed: '',                 // 转速
    tbrand: '',                // 变速箱品牌
    tbrandVal: '',                // 变速箱品牌val-------
    tmodel: '',                // 变速箱型号
    tmodelVal: '',                // 变速箱型号val-------
    speedratio: '',            // 后桥速比
    speratVal: '',                // 后桥val-------
    tiremodel: '',             // 轮胎labe
    tirdelVal: '',                // 轮胎val-------
    weight: '',                // 重量
    weightVal: '',                // 重量val-------
    road: '',                  // 路面状况
    roadVal: '',                  // 路面val------
    drag: '',                  // 风阻系数
    carwide: '',               // 车宽
    carhigh: '',               // 车高

    brandAry: {},             // 发动机品牌数据
    tbranAry: {},             // 变速箱品牌数据
    speedAry: [],             // 后桥速比数据
    tiremAry: [],             // 轮胎数据
    weighAry: [],             // 重量数据
    roadsAry: [],             // 路面状况数据

    emodelAry: [],            // 发动机型号数据
    tmodelAry: [],            // 变速箱型号数据
    speedObj: {},             // 发动机转速数据

    names: [
      '发动机品牌',
      '发动机型号',
      '变速箱品牌',
      '变速箱型号',
      '后桥速比',
      '轮胎型号',
      '整车吨位',
      '路面状况',
    ],
    vals: [
      'ebrand',
      'emodel',
      'tbrand',
      'tmodel',
      'speedratio',
      'tiremodel',
      'weight',
      'road',
    ],
    inxs: [-1,-1, -1, -1,-1,-1,-1,-1],
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '车速计算器'
    })
    this.initARR()
  },
  // 更多选择，一层系列
  showSelect (e) {
    if (e.currentTarget.dataset.id === '1' && !this.data.ebrand) {
      this.isShowAlert('请选择发动机品牌')
      return
    }
    if (e.currentTarget.dataset.id === '3' && !this.data.tbrand) {
      this.isShowAlert('请选择变速箱品牌')
      return
    }
    this.setData({
      isSolid: true,
      solidIndex: e.currentTarget.dataset.id,
      solidData: this.data[e.currentTarget.dataset.db],
      solidTitle: this.data.names[e.currentTarget.dataset.id],
    })
  },
  // 弹层选择事件
  setSelt (e) {
    let ary = this.data.inxs
    switch (this.data.solidIndex) {
      case '0':
        this.setData({
          ebrandVal: e.currentTarget.dataset.id,
          emodel: '',
          speed: ''
        })
        this.getSon({ ebrand: escape(e.currentTarget.dataset.id)}, 0, 0)
        ary[1] = -1
        break;
      case '1':
        this.setData({ emodelVal: e.currentTarget.dataset.id })
        this.getSon({
          ebrand: escape(this.data.ebrandVal),
          emodel: escape(e.currentTarget.dataset.id)
        }, 0, 1)
        break;
      case '2':
        this.setData({
          tbrandVal: e.currentTarget.dataset.id,
          tmodel: ''
        })
        this.getSon({ tbrand: escape(e.currentTarget.dataset.id), }, 1, 0)
        ary[3] = -1
        break;
      case '3':
        this.setData({ tmodelVal: e.currentTarget.dataset.id })
        break;
      case '4':
        this.setData({ speratVal: '' })
        break;
      case '5':
        this.setData({ tirdelVal: e.currentTarget.dataset.id })
        break;
      case '6':
        this.setData({ weightVal: '' })
        break;
      case '7':
        this.setData({ roadVal: e.currentTarget.dataset.id })
        break;
    }
    // console.log(e.currentTarget.dataset.inx)
    if (this.data.solidIndex !== '0' && this.data.solidIndex !== '2') {
      ary[parseInt(this.data.solidIndex)] = e.currentTarget.dataset.inx
    }
    this.setData({
      [this.data.vals[this.data.solidIndex]]: e.currentTarget.dataset.val,
      isSolid: false,
      inxs: ary
    })
    // console.log(this.data.solidIndex, ary)
  },
  // 输入值
  inputEvn(e){
    this.setData({
      [e.target.dataset.name]: e.detail.value
    })
    if (e.target.dataset.name === 'speratVal') {
      this.setData({ speedratio: ''})
    }
    if (e.target.dataset.name === 'weightVal') {
      this.setData({ weight: '' })
    }
  },
  // 计算结果
  ovrBtn (e) {
    let speVal = this.data.speratVal
    let weiVal = this.data.weightVal

    let drags = this.data.drag
    if (this.data.speedratio) {
      speVal = this.data.speedratio
    }
    if (this.data.weight) {
      weiVal = this.data.weight
    }
    const dbs = {
      ebrand:{
        val: escape(this.data.ebrandVal),
        name: '请选择发动机品牌'
      },
      emodel: {
        val: escape(this.data.emodelVal),
        name: '请选择发动机型号'
      },
      speed: {
        val: escape(this.data.speed), 
        name: '请选择发动机转速'
      },
      tbrand: {
        val: escape(this.data.tbrandVal),
        name: '请选择变速箱品牌'
      },
      tmodel: {
        val: escape(this.data.tmodelVal),
        name: '请选择变速箱型号'
      },
      speedratio: {
        val: escape(speVal),
        name: '请选择常见速比'
      },
      tiremodel: {
        val: escape(this.data.tirdelVal),
        name: '请选择轮胎型号'
      },
      weight: {
        val: escape(weiVal),
        name: '请选择整车吨位'
      },
      road: {
        val: escape(this.data.roadVal),
        name: '请选择路面状况'
      },
      drag: {
        val: escape(drags),
        name: '请填写风阻系数'
      },
      carwide: {
        val: escape(this.data.carwide),
        name: '请填写车宽(米)'
      },
      carhigh: {
        val: escape(this.data.carhigh),
        name: '请填写车高(米)'
      },
    }
    const obj = {}
    let isOk = 1
    for (let em in dbs) {
      if (dbs[em]['val']) {
        obj[em] = dbs[em]['val']
      } else {
        this.isShowAlert(dbs[em]['name'])
        isOk = 0
        break
      }
      if (em === 'speedratio') {
        if (parseFloat(speVal)) {
          if (speVal < 0 || speVal > 50) {
            this.isShowAlert('请确认后桥速比(0~50)')
            isOk = 0
            break
          }
        } else {
          this.isShowAlert('请确认后桥速比(0~50)')
          isOk = 0
          break
        }
      }
      if (em === 'weight') {
        if (parseFloat(weiVal)) {
          if (weiVal < 5 || weiVal > 150) {
            this.isShowAlert('请确认整车吨位(5~150吨)')
            isOk = 0
            break
          }
        } else {
          this.isShowAlert('请确认整车吨位(5~150吨)')
          isOk = 0
          break
        }
      }
      if (em === 'drag') {
        if (parseFloat(drags)) {
          if (drags < 0.5 || drags > 1.5) {
            this.isShowAlert('请确认风阻系数(0.5-1.5)')
            isOk = 0
            break
          }
        } else {
          this.isShowAlert('请确认风阻系数(0.5-1.5)')
          isOk = 0
          break
        }
      }
      if (em === 'carwide') {
        if (!parseFloat(dbs[em]['val'])) {
          this.isShowAlert('请填写车宽(米)')
          isOk = 0
          break
        }
      }
      if (em === 'carhigh') {
        if (!parseFloat(dbs[em]['val'])) {
          this.isShowAlert('请填写车高(米)')
          isOk = 0
          break
        }
      }
    }
    if (isOk) {
      wx.navigateTo({
        url: `../speedResult/speedResult?obj=${JSON.stringify(obj)}`,
      })
    }
  },
  // 重置筛选
  regBtn(e){
    this.setData({
      ebrand: '',                // 发动机品牌
      ebrandVal: '',                 // 发动机品牌val-------
      emodel: '',                // 发动机型号
      emodelVal: '',                // 发动机型号val-------
      speed: '',                 // 转速
      tbrand: '',                // 变速箱品牌
      tbrandVal: '',                // 变速箱品牌val-------
      tmodel: '',                // 变速箱型号
      tmodelVal: '',                // 变速箱型号val-------
      speedratio: '',            // 后桥速比
      speratVal: '',                // 后桥val-------
      tiremodel: '',             // 轮胎labe
      tirdelVal: '',                // 轮胎val-------
      weight: '',                // 重量
      weightVal: '',                // 重量val-------
      road: '',                  // 路面状况
      roadVal: '',                  // 路面val------
      drag: '',                  // 风阻系数
      carwide: '',               // 车宽
      carhigh: '',               // 车高
      inxs: [-1, -1, -1, -1, -1, -1, -1, -1],
    })
  },
  // 加减发动机转速
  speedAC (e) {
    if (!this.data.ebrand) {
      this.isShowAlert('请选择发动机品牌')
      return
    }
    if (!this.data.emodel) {
      this.isShowAlert('请选择发动机型号')
      return
    }
    let spd = Number(this.data.speed)
    if (!spd) {
      this.isShowAlert('网络错误，请刷新重试')
      return
    }
    if(Number(e.currentTarget.dataset.fn)){
      spd = spd + 50
      if (spd > this.data.speedObj.maxspeed) {
        spd = this.data.speedObj.maxspeed
        this.isShowAlert('已经是最高转速')
      }
    } else {
      spd = spd - 50
      if (spd < this.data.speedObj.minspeed) {
        spd = this.data.speedObj.minspeed
        this.isShowAlert('已经是最低转速')
      }
    }
    this.setData({
      speed: spd
    })
  },
  // 获取型号等子类数据
  getSon (obj, typ, inx) {
    let ajax = `${app.spdajax}speedcalculator/api/getengine.aspx`
    if (typ === 1) {
      ajax = `${app.spdajax}speedcalculator/api/gettransmission.aspx`
    }
    wx.request({
      url: ajax,
      data: obj,
      success: (res) => {
        if (res.errMsg === 'request:ok' && res.data.result === 1) {
          if (!typ) {
            if (!inx) {
              this.setData({
                emodelAry: res.data.data,        // 发动机型号数据
              })
            } else {
              this.setData({
                speedObj: res.data.data[0],
                speed: res.data.data[0]['minspeed']
              })
            }
          } else {
            this.setData({
              tmodelAry: res.data.data,         // 变速箱型号数据
            })
          }
        }
      }
    })
  },
  showSolid(){
    this.setData({
      isSolid: !this.data.isSolid
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
  // 点击弹窗
  showAlert () {
    this.setData({
      isAlert: !this.data.isAlert,
      isMask: !this.data.isMask
    })
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
        navInfo: '',
      })
      clearTimeout(time)
    }, 500)
  },
  // 初始数据获取
  initARR () {
    wx.request({
      url: `${app.spdajax}speedcalculator/api/getengine.aspx`,
      success: (res) => {
        if (res.errMsg === 'request:ok' && res.data.result === 1) {
          const obj = this.creatObj(res.data.data)
          this.setData({
            brandAry: obj,
          })
          // console.log(this.data.brandAry)
        }
      }
    })
    wx.request({
      url: `${app.spdajax}speedcalculator/api/gettransmission.aspx`,
      success: (res) => {
        if (res.errMsg === 'request:ok' && res.data.result === 1) {
          const obj = this.creatObj(res.data.data)
          this.setData({
            isLoad: false,
            tbranAry: obj,
          })
          // console.log(this.data.tbranAry)
        }
      }
    })
    wx.request({
      url: `${app.spdajax}speedcalculator/api/getspeedratio.aspx`,
      success: (res) => {
        if (res.errMsg === 'request:ok' && res.data.result === 1) {
          this.setData({
            speedAry: res.data.data,
          })
        }
      }
    })
    wx.request({
      url: `${app.spdajax}speedcalculator/api/gettire.aspx`,
      success: (res) => {
        if (res.errMsg === 'request:ok' && res.data.result === 1) {
          this.setData({
            tiremAry: res.data.data,
          })
        }
      }
    })
    wx.request({
      url: `${app.spdajax}speedcalculator/api/getvehicletonnage.aspx`,
      success: (res) => {
        if (res.errMsg === 'request:ok' && res.data.result === 1) {
          this.setData({
            weighAry: res.data.data,
          })
        }
      }
    })
    wx.request({
      url: `${app.spdajax}speedcalculator/api/getroadconditions.aspx`,
      success: (res) => {
        if (res.errMsg === 'request:ok' && res.data.result === 1) {
          this.setData({
            roadsAry: res.data.data,
          })
        }
      }
    })
  },
  // 处理品牌数据定位
  creatObj (ary) {
    let az = []
    let data = []
    for (let em in ary) {
      const num = az.indexOf(ary[em]['initials'])
      if (num === -1) {
        az.push(ary[em]['initials'])
        data.push([])
      }
    }
    for (let em in ary) {
      const num = az.indexOf(ary[em]['initials'])
      const obj = {
        label: ary[em]['label'],
        value: ary[em]['value']
      }
      if (num !== -1) {
        data[num].push(obj)
      }
    }
    return {az, data}
  }
})

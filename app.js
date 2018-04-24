//app.js
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.ajaxurl = 'https://product.360che.com/'
    this.spdajax = 'https://tools.360che.com/'
    this.deaajax = 'https://dealer-api.360che.com/'
  },
  scopeSetting: function () {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo'] || !res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {}
          })
          wx.authorize({
            scope: 'scope.userLocation',
            success() { }
          })
        }
      }
    })
  },
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
        typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      if (wx.getStorageSync('OPENIDS')) {
        let USER = wx.getStorageSync('USERINFO')
        wx.request({
          url: `https://product.m.360che.com/index.php?r=weex/series/save-user-info&openId=${wx.getStorageSync('OPENIDS')}&name=${USER.nickName}&photo=${USER.avatarUrl}&time=${timObj}`
        })
        return false
      }
      var timObj = Date.parse(new Date())
      wx.login({
        success: function(ress) {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              wx.setStorageSync('USERINFO', res.userInfo)
              typeof cb == "function" && cb(that.globalData.userInfo)
              wx.request({
                url: `https://product.m.360che.com/index.php?r=weex/series/get-wechat-user-open-id&code=${ress.code}&time=${timObj}`,
                success: (opens) => {
                  that.globalData.openId = opens.data.openid
                  wx.setStorageSync('OPENIDS', opens.data.openid)
                  wx.request({
                    url: `https://product.m.360che.com/index.php?r=weex/series/save-user-info&openId=${opens.data.openid}&name=${res.userInfo.nickName}&photo=${res.userInfo.avatarUrl}&time=${timObj}`
                  })
                }
              })
            }
          })
        }
      })
    }
  },
  //进入页面判断是否是转发过来
  updateDataForShare(options, _this, success, fail) {
    // console.log(_this.route,'_this.route')
    // console.log(options, 'options.share')
    // console.log(options.share,'options.share')
      if (options.share) {
        let share = JSON.parse(options.share)
          // console.log(share,'share')
          //给data信息赋值
          _this.setData(share)
          //存储信息缓存
          for (let key in share){
            wx.setStorage({
              key: key,
              data: share[key],
            })
          }
          // wx.showToast({
          //   title: '转发进来',
          //   icon: 'success',
          //   duration: 2000
          // })
          success && success.call(_this)
      } else {
        // wx.showToast({
        //   title: '正常进来',
        //   icon: 'success',
        //   duration: 2000
        // })
          fail && fail.call(_this)
      }
  },
  //页面分享转发
  shareCurrentPage(shareParams, _this) {
    let [params, path, title] = [{}, '', '']
    shareParams.forEach(item => {
        params[item] = _this.data[item]
    })
    title = this.globalData.shareTitle
    // console.log(params,'params')
    path = `${_this.route}?share=${JSON.stringify(params)}`
    // console.log(path,'path')
    return {
      title: title,
      path: path,
      success: function(res) {
        console.log(path)
          // 转发成功
        // wx.showToast({
        //   title: '成功',
        //   icon: 'success',
        //   duration: 2000
        // })
      },
      fail: function(res) {
          // 转发失败
      }
    }
  },
  getDateDiff(dateTimeStamp) {
    let tmObj = new Date(dateTimeStamp * 1000)
    // let timeMp = Date.parse(timeSta)
    let minute = 1000 * 60
    let hour = minute * 60
    let day = hour * 24
    let halfamonth = day * 15
    let month = day * 30
    let now = Date.now()
    // let diffValue = now - timeMp
    let diffValue = now - dateTimeStamp * 1000
    if (diffValue < 0) { return }
    let monthC = diffValue / month
    let weekC = diffValue / (7 * day)
    let dayC = diffValue / day
    let hourC = diffValue / hour
    let minC = diffValue / minute
    let result = ''
    if (monthC >= 1 || dayC > 5) {
      let mon = tmObj.getMonth() > 9 ? tmObj.getMonth() + 1 : `0${tmObj.getMonth() + 1}`
      let dat = tmObj.getDate() > 9 ? tmObj.getDate() + 1 : `0${tmObj.getDate() + 1}`
      result = `${tmObj.getFullYear()}-${mon}-${dat}`
    } else if (dayC >= 1) {
      result = "" + parseInt(dayC) + "天前"
    } else if (hourC >= 1) {
      result = "" + parseInt(hourC) + "小时前"
    } else if (minC >= 1) {
      result = "" + parseInt(minC) + "分钟前"
    } else {
      result = "刚刚"
    }
    return result
  },
  globalData: {
    openId: '',
    userInfo: null,
    // 分享的标题
    shareTitle: '',
    //显示loading
    showLoading: function(name) {
      return wx.showToast({
          title: name,
          icon: 'loading'
      });
    },
    //关闭loading
    hideLoading: function() {
      return wx.hideToast();
    }
  }
})



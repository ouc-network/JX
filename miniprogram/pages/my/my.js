// pages/my/my.js
var wxCharts = require("../../utils/wxcharts.js");
var yuelineChart = null;
var openid
var score = 0
var task_number = 1
var task_number_done = 1
var dateTimeArr
var sum = []

const app = getApp()

//这个页面还差一点监听逻辑
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageWidth: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    score: score,
    task_number: task_number,
    task_number_done: task_number_done,
    item: ""
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //getAPP().setWatcher(this.data, this.watch); // 设置监听
    //created()
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        openid = res.data
        wx.cloud.database().collection('userdata').where({
          //先是查询用户名是否存在
          _openid: res.data
        }).get({
          success(res) {
            // console.log("找到了");
            score = res.data[0].score
            task_number = res.data[0].task_number
            task_number_done = res.data[0].task_number_done
            console.log("找到了", task_number)
            that.setData({
              score: res.data[0].score,
              task_number: res.data[0].task_number,
              task_number_done: res.data[0].task_number_done
            })
          }
        })
      }
    })
    // this.setData({
    //   canIUseGetUserProfile: true,
    //   score:score,
    //   task_number:task_number,
    //   task_number_done:task_number_done
    //   // openid: options.openid
    // })
    // console.log("here",task_number)
  },
  onShow() {
    var that = this
    //getAPP().setWatcher(this.data, this.watch); // 设置监听
    //created()
    sum=[]
    wx.cloud.database().collection('userdata').where({_openid:openid}).get({
      success(res) {
        // console.log("找到了");
        score = res.data[0].score
        task_number = res.data[0].task_number
        task_number_done = res.data[0].task_number_done
        console.log("找到了", task_number)
        that.setData({
          score: res.data[0].score,
          task_number: res.data[0].task_number,
          task_number_done: res.data[0].task_number_done,
        })
        dateTimeArr = res.data[0].dateTime
        // console.log("sum",res.data.dateTime,dateTimeArr)
        var dateArr = []
        for (var i = 1; i <= 12; i++) {
        dateTimeArr.forEach((item) => {
          // console.log("here",item)
          dateArr = []
            if (item.getFullYear() == new Date().getFullYear() && item.getMonth() + 1 == i) {
              dateArr.push(item.getDate())
            }
          })
          sum.push(dateArr.length)
        }
        console.log("sum",sum)
      }
    })
    // try {
    //   var res = wx.getSystemInfoSync();
    //   windowWidth = res.windowWidth;
    // } catch (e) {
    //   console.error('getSystemInfoSync failed!');
    // }
    yuelineChart = new wxCharts({ //当月用电折线图配置
      canvasId: 'yueEle',
      type: 'line',
      categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], //categories X轴
      animation: true,
      series: [{
        name: 'A',
        //替换成月数据
        data: sum,
        format: function (val, name) {
          return val + '';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '每月打卡次数',
        format: function (val) {
          return val;
        },
        max: 15,
        min: -5
      },
      width: 300,
      height: 290,
      dataLabel: false,
      dataPointShape: true,
      // extra: {
      //   lineStyle: 'curve'
      // }
    });
  },

  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // onLoad(options) {

  //console.log(options.openid)
  // if (wx.getUserProfile) {
  //   this.setData({
  //     canIUseGetUserProfile: true,
  //     //openid: options.openid
  //   })
  // }
  // wx.getStorage({
  //   key: 'openid',
  //   success: function (res) {
  //     openid:res.data.openid
  //     console.log("my",res);
  //   }
  // });
  // },

  getUserProfile(e) {
    //console.log("here")
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    //console.log("找到了", task_number)
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
    // console.log("找到了", task_number)
  },
  handleChange() {
    let db = wx.cloud.database() //设置数据库
    var that = this
    db.collection('userdata').where({
      _openid: openid
    }).watch({
      onChange: function (res) {
        console.log(res)
        score = res.data[0].score
        task_number = res.data[0].task_number
        task_number_done = res.data[0].task_number_done
      }
    })
    //let val = this.data.count
    thst.setData({
      score: score,
      task_number: task_number,
      task_number_done: task_number_done
    })
  },
  // 监听事件
  setWatcher(data, watch) {
    Object.keys(watch).forEach(key => {
      this.observe(data, key, watch[key])
    })
  },
  observe(obj, key, watchFun) {
    let val = obj[key]
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function (value) {
        watchFun(value, val)
        val = value
      },
      get: function () {
        return val
      }
    })
  },
  // watch 属性，设置需要监听的属性
  watch: {
    count: function (newVal, oldVal) {
      console.log('newVal:', newVal);
      console.log('oldVal:', oldVal);
    },
  }
})
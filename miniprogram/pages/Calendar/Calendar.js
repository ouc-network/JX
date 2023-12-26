// miniprogram/pages/punchCard/calendarCard/calendarCard.js
var openid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    icon: "",
    disabledFlag: false,
    totalDays: 0,
    monthDays: 0,
    habitInfo: {},
    currentDate: null,
    currentMonth: null,
    currentYear: null,
    nowYear: new Date().getFullYear(),
    nowMonth: new Date().getMonth(),
    nowDate: new Date().getDate(),
    punchCardDateArr: [] //用于存放当月打卡日期-日

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.getStorage({
      key: 'Calender',
      success: function (res) {
        openid = res.data
        // console.log("Calender",openid)
      }
    })
    //console.log(options);
    // this.setData({
    //   // openid: options.openid,
    //   name: options.name,
    //   icon: options.icon
    // })
    var nowYear = new Date().getFullYear()
    var nowMonth = new Date().getMonth()
    wx.nextTick(() => {
      this.getHabitInfo(nowYear, nowMonth)
    })
  },
  // 获取子组件的数据
  getObj(e) {
    console.log("获取子组件的数据", e);
    this.setData({
      currentDate: e.detail.currentDate,
      currentMonth: e.detail.currentMonth,
      currentYear: e.detail.currentYear,
    })
    this.getHabitInfo(e.detail.currentYear, e.detail.currentMonth - 1)
  },
  // 获取当月的打卡数据
  getHabitInfo(year, month) {
    var task_number
    var task_number_done
    var that=this
    // 注意month范围 0-11，0代表1月
    const db = wx.cloud.database()
    db.collection('userdata').where({
      openid: openid,
    }).get().then(res => {
      // console.log("从数据库获取数据[res]===", res);
      task_number=res.data[0].task_number
      task_number_done=res.data[0].task_number_done
      var dateTimeArr = res.data[0].dateTime
      var dateArr = []
      dateTimeArr.forEach((item) => {
        if (item.getFullYear() == year && item.getMonth() == month) {
          dateArr.push(item.getDate())
        }
      })
      console.log(year, month, that.data.nowDate);
      // if (!this.data.currentDate || (year == this.data.nowYear && month > this.data.nowMonth) || (year == this.data.nowYear && month == this.data.nowMonth && this.data.currentDate > this.data.nowDate)) {
      //   // 打卡按钮禁用的情况（1）页面初始化时，未点击任何日期（2）当前点击的日期在今天之后
      //   var flag = true
      // } 
      if (task_number==task_number_done && task_number!=0) {
        // 打卡按钮禁用的情况（1）页面初始化时，未点击任何日期（2）当前点击的日期在今天之后
        var flag = false
        task_number=0
        task_number_done=0
      }else {
        // 打卡按钮禁用的情况 （3）当前日期已打卡
        if(task_number!=0 && task_number!=task_number_done)
        var flag=true
        // var flag = dateArr.indexOf(this.data.nowDate) == -1 ? false : true
      }
      that.setData({
        habitInfo: res.data[0],
        punchCardDateArr: dateArr,
        disabledFlag: flag,
        totalDays: dateTimeArr.length,
        monthDays: dateArr.length
      })
    }).catch(err => {
      console.log(err);
    })
  },
  // 点击打卡按钮-打卡
  punchCard() {
    console.log(this.data.nowYear, this.data.nowMonth - 1, this.data.nowDate);
    var that=this
    var currentTime = new Date(this.data.nowYear, this.data.nowMonth - 1, this.data.nowDate)
    const db = wx.cloud.database()
    //修改这里的逻辑使其能够更新打卡统计的数字，不行就不做了
    db.collection('userdata').doc(openid).update({
      data: {
        dateTime: db.command.push(currentTime)
      },
      success: res => {
        that.getHabitInfo(that.data.nowYear, that.data.nowtMonth - 1)
        if(that.data.habitInfo.task_number==that.data.habitInfo.task_number_done)
        {
          that.setData({
            disabledFlag:true
          })
          wx.showToast({
            title: '打卡成功',
          })
        }
        else
        {
          that.setData({
            disabledFlag:false
          })
          wx.showToast({
            title: '任务还未全部完成',
          })
        }
       },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  }
})
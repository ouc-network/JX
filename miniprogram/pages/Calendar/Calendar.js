// miniprogram/pages/punchCard/calendarCard/calendarCard.js
var openid
var id
var dateTimeArr
var dateArr = []
var task_number
var task_number_done
var n=0
const db = wx.cloud.database()
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
    // dateArr = []
    wx.getStorage({
      key: 'Calender',
      success: function (res) {
        openid = res.data
        console.log("Calender", openid)
      }
    })
    var nowYear = new Date().getFullYear()
    var nowMonth = new Date().getMonth()
    var flag = dateArr[dateArr.length-1] == this.data.nowDate ? true : false
    // this.setData({
    //   disabledFlag:flag
    // })
    wx.nextTick(() => {
      this.getHabitInfo(nowYear, nowMonth)
    })
  },
  // 获取子组件的数据
  getObj(e) {
    // console.log("获取子组件的数据", e);
    this.setData({
      currentDate: e.detail.currentDate,
      currentMonth: e.detail.currentMonth,
      currentYear: e.detail.currentYear,
    })
    // this.getHabitInfo(e.detail.currentYear, e.detail.currentMonth - 1)
  },
  // 获取当月的打卡数据
  getHabitInfo(year, month) {
    var that = this
    var flag
    n++
    db.collection('userdata').doc("09e78768658a586304d4a19d73b3c162").get({
      success(res) {
        console.log("here month", res)
        // console.log("从数据库获取数据[res]===", res);
        task_number = res.data.task_number
        task_number_done = res.data.task_number_done
        dateTimeArr = res.data.dateTime
        // console.log("dateTimeArr", n)
        //获取了该用户的打卡天数数据
        //然后经过判断将数据添加到数据中，获取数组大小
        dateArr=[]
        dateTimeArr.forEach((item) => {
          // console.log("here",item)
          if (item.getFullYear() == year && item.getMonth() == month) {
            dateArr.push(item.getDate())
          }
        })
        console.log(dateArr)
        console.log(year, month + 1, that.data.nowDate)
        
        // if (task_number == 0) {
        //   // 打卡按钮禁用的情况（1）页面初始化时，未点击任何日期（2）当前点击的日期在今天之后
        //   var flag = false
        //   // task_number = 0
        //   // task_number_done = 0
        // } else {
        //   // 打卡按钮禁用的情况 （3）当前日期已打卡
        // if (task_number = 0){
        //     flag = true
        // console.log(hereflag)
        // }
        // console.log("here flag")
        var length=dateArr.length-1
        var flag = false
        // console.log("flag",dateArr[length],that.data.nowDate)
        if(dateArr[length] == that.data.nowDate)
        {
          console.log("ture")
          flag=true
        } 
        console.log("here flag")
        that.setData({
          habitInfo: res.data,
          punchCardDateArr: dateArr,
          disabledFlag: flag,
          totalDays: dateTimeArr.length,
          monthDays: dateArr.length
        })
      }
    })
    // that.onLoad()
  },
  // 点击打卡按钮-打卡
  punchCard() {
    console.log(this.data.nowYear, this.data.nowMonth + 1, this.data.nowDate);
    var that = this
    var currentTime = new Date(this.data.nowYear, this.data.nowMonth, this.data.nowDate)
    //修改这里的逻辑使其能够更新打卡统计的数字，不行就不做了
    //在这里添加数据
    console.log(currentTime)
    db.collection('userdata').doc("09e78768658a586304d4a19d73b3c162").update({
      data: {
        dateTime: db.command.push(currentTime)
      },
      success: function (res) {
        console.log("数据添加成功", res)
        that.getHabitInfo(that.data.nowYear, that.data.nowMonth)
        that.setData({
          disabledFlag: true
        })
        wx.showToast({
          title: '打卡成功',
        })
        that.onLoad()
        // if (that.data.habitInfo.task_number == 0) {
        //   that.setData({
        //     disabledFlag: true
        //   })
        //   that.onLoad()
        //   wx.showToast({
        //     title: '打卡成功',
        //   })
        // } else {
        //   that.setData({
        //     disabledFlag: false
        //   })
        //   that.onLoad()
        //   wx.showToast({
        //     title: '任务还未全部完成',
        //   })
        // }
      },
      fail: err => {
        if (that.data.habitInfo.task_number == 0) {
          that.setData({
            disabledFlag: true
          })
          // that.onLoad()
          wx.showToast({
            title: '打卡成功',
          })
        } else {
          that.setData({
            disabledFlag: false
          })
          // that.onLoad()
          wx.showToast({
            title: '任务还未全部完成',
          })
        }
        // console.error('[数据库] [新增记录] 失败：', err)
      }
    })
    // that.onLoad()
  }
})
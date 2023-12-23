// pages/my/my.js
var openid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    score: 0,
    task_number: 0,
    task_number_done: 0,
    item:""
  },

  created() {
    let d = new Date();
    let day = d.getDay(); //获取今天所在星期，以进行后续计算
    let today = d.getDate(); //获取今天的日数

    this.current.year = d.getFullYear(); //初始化今日的年月日
    this.current.month = d.getMonth();
    this.current.date = d.getDate();

    let info = {}; //用来存放某一天的数据对象（年月日、isToday、level）      
    let month = ""; //后续计算某月第一天在哪一列用，表示第几月
    let weekOfMonth = "" //后续计算某月第一天在哪一列用，表示第几列

    /**
     *前提：Date对象通过setDate()设置到某一天的年月日，例如setDate(1)就是设置日期月本月1号
     *而setDate(0)则是上个月最后一天，setDate(-1)则是设置为上个月倒数第二天
     *以此类推，假如今天是星期五，如果周日算本周第一天，则今天是本周第6天，也就是本周在今日前面还有5天，本周在第12列，则今天前的日期有11*7+5=82天，所以第1列第1格为82天前。
     *假如今天是13日，82-13=69，那么第1列第1格为本月第1天的前69天，则那天的日期设置为setDate(-69+1)（+1是为了算上0），最后就能获得那一天的年月日对象，再获得年月日数值。
     *知道前提后下面的代码可以自己体会了
     */
    for (let i = 0; i < 84; i++) {
      d.setFullYear(this.current.year); //每次循环要重置年月日为今天否则会以上次循环结尾的年月日计算而计算错误
      d.setMonth(this.current.month);
      d.setDate(this.current.date);

      d.setDate(today - 77 - day + i); //设置到本次循环的date   
      //(today-(84-(7-day)+i)

      let level = Math.floor(Math.random() * 3); //这里是随机设置每天的频率等级，后续开发要替换为自己计算的真实等级（不同等级对应不同颜色方格）

      if ( //判断是否为今天，是则做些标记，后续渲染时可以突出强调今天的格子
        d.getMonth() == this.current.month &&
        d.getDate() == this.current.date
      ) {
        info = { //每个格子（天）的info对象
          year: d.getFullYear(), //年月日
          month: d.getMonth() + 1,
          date: d.getDate(),
          number: 10, //今日的数据量
          level: level, //今日数据量对应的等级
          isToday: true, //是否是今天
        };
        this.infos.push(info);
      } else {
        info = {
          year: d.getFullYear(),
          month: d.getMonth() + 1,
          date: d.getDate(),
          number: 10,
          level: level,
          isToday: false,
        };
        this.infos.push(info);
      }
      //判断每月第一天在12列种的哪一列
      if (d.getDate() == 1) { //date为1的肯定是某月第一天
        month = d.getMonth() + 1 //获取这一天对应的月份（0-11，所以还要+1）
        weekOfMonth = parseInt((i + 1) / 7) //这个月的第一天的index（84天的第几天）除以7获得所在列的index（12列的第几列），作为下面monthBar的index，并把原来空的内容用替换为xx月
        this.monthBar[weekOfMonth] = month + "月"
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
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
    wx.login({
      success: (res) => {
        console.log(res);
        if (res.code) {
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxeb51ad541e4728f7&secret=d5c87cfa094ab2ee03203d380eab205e&js_code=' + res.code + '&grant_type=authorization_code',
            success: (res) => {
              console.log(res);
              openid = res.data.openid
              //获取到你的openid
              console.log(openid);
            }
          })
          wx.cloud.database().collection('userdata').where({
            //先是查询用户名是否存在
            openid: this.data.openid
          }).get({
            success(res) {
              this.data.score = res.score
              this.data.task_number = res.task_number
              this.data.task_number_done = res.task_number_done
            }
          })
        }
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
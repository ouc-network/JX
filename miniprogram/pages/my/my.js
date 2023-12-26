// pages/my/my.js
var openid
var score = 0
var task_number=1
var task_number_done=1
//这个页面还差一点监听逻辑
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
    score: score,
    task_number: task_number,
    task_number_done: task_number_done,
    item: ""
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
  onLoad: function (options) {
    var that=this
    //getAPP().setWatcher(this.data, this.watch); // 设置监听
    //created()
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        openid = res.data
      }
    })
    wx.cloud.database().collection('userdata').where({
      //先是查询用户名是否存在
      openid: openid
    }).get({
      success(res) {
        // console.log("找到了");
        score = res.data[0].score
        task_number = res.data[0].task_number
        task_number_done = res.data[0].task_number_done
        console.log("找到了", task_number)
        that.setData({
          score:res.data[0].score,
          task_number:res.data[0].task_number,
          task_number_done:res.data[0].task_number_done
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
  handleChange(){
    let db = wx.cloud.database() //设置数据库
    db.collection('userdata').where({
      openid: openid
    }).watch({
      onChange: function (res) {
        console.log(res)
        score = res.data[0].score
        task_number = res.data[0].task_number
        task_number_done = res.data[0].task_number_done
      }
    })
    //let val = this.data.count
    this.setData({ 
      score: score,
      task_number: task_number,
      task_number_done: task_number_done
     })
  },
  // 监听事件
  setWatcher(data, watch){
    Object.keys(watch).forEach(key => {
      this.observe(data, key, watch[key])
    })
  },
  observe(obj, key , watchFun){
   let val = obj[key]
     Object.defineProperty(obj, key, {
       configurable: true,
       enumerable: true,
      set: function(value){
           watchFun(value, val)
           val = value
      },
      get: function(){
        return val
      }
    })
  },
  // watch 属性，设置需要监听的属性
  watch:{
    count:function(newVal, oldVal){
        console.log('newVal:',newVal);
        console.log('oldVal:',oldVal);
    },
  }
})
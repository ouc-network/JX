// pages/login/login.js
var openid
var code

Page({

  /**
   * 页面的初始数据
   */
  data: {},

  getUserInfo() {
    wx.login({
      //成功放回
      success: (res) => {
        console.log(res);
        if (res.code) {
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxeb51ad541e4728f7&secret=d5c87cfa094ab2ee03203d380eab205e&js_code=' + res.code + '&grant_type=authorization_code',
            success: (res) => {
              console.log(res);
              openid = res.data.openid
              wx.setStorage({
                key: 'openid',
                data: openid,
                success: function () {
                  console.log('设置缓存数据成功');
                }
              });
              wx.setStorage({
                key: 'Calender',
                data: openid,
                success: function () {
                  console.log('设置缓存数据成功2');
                }
              });
              wx.setStorage({
                key: 'index',
                data: openid,
                success: function () {
                  console.log('设置缓存数据成功2');
                }
              });
              //获取到你的openid
              console.log(openid);
            }
          })
          // wx.cloud.database().collection('userdata').add({
          //   data: {
          //     openid: this.data.openid,
          //     score: 0,
          //     task_number: 0,
          //     //记录已经完成多少任务
          //     task_number_done: 0,
          //     //下面是任务相关内容
          //     task_name: "",
          //     task_score: 0,
          //     task_time_begin: "",
          //     task_time_done: "",
          //     //记录是否完成任务，如果完成任务，则将对应值赋值为1
          //     task_done: 0,
          //   }
          // }).then(res => {
          //   console.log('添加成功', res)
          // }).catch(err => {
          //   console.log('添加失败', err) //失败提示错误信息
          // })
          if (openid == 'o37eI6xxr0JiNF2fIilUQb77NiIU') {
            userCollection.add({
              data: {
                openid: this.data.openid,
                score: 0,
                task_number: 0,
                //记录已经完成多少任务
                task_number_done: 0,
                //下面是任务相关内容
                task_name: "",
                task_score: 0,
                task_time_begin: "",
                task_time_done: "",
                //记录是否完成任务，如果完成任务，则将对应值赋值为1
                task_done: 0,
              }
            }).then(res => {
              console.log('添加成功', res)
            }).catch(err => {
              console.log('添加失败', err) //失败提示错误信息
            })
          }
          wx.cloud.database().collection('userdata').where({
            //先是查询用户名是否存在
            openid: this.data.openid
          }).get({
            success(res) {
              console.log("获取数据成功", res)
              console.log('')
              wx.switchTab({
                url: '/pages/index/index',
              })
              // wx.navigateTo({
              //     url: '/pages/index/index',
              //   }),
              wx.showToast({
                title: '登陆成功',
              })
            },
            fail(res) {
              userCollection.add({
                data: {
                  openid: this.data.openid,
                  score: 0,
                  task_number: 0,
                  //记录已经完成多少任务
                  task_number_done: 0,
                  //下面是任务相关内容
                  task_name: "",
                  task_score: 0,
                  task_time_begin: "",
                  task_time_done: "",
                  //记录是否完成任务，如果完成任务，则将对应值赋值为1
                  task_done: 0,
                }
              }).then(res => {
                console.log('添加成功', res)
              }).catch(err => {
                console.log('添加失败', err) //失败提示错误信息
              })
              // wx.setStorage({
              //   key: 'openid',
              //   data: {
              //     openid: this.data.openid
              //   },
              //   success: function () {
              //     console.log('设置缓存数据成功',);
              //   }
              // });
              // wx.switchTab({
              //   url: '/pages/my/my?openid=' + this.data.openid,
              // })
              // wx.navigateTo({
              //     url: '/pages/index/index',
              //   }),
            }
          })
        }
        //wx.setStorageSync('openid', openid);
        wx.switchTab({
          url: '/pages/index/index'
        })
        wx.showToast({
          title: '登陆成功',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
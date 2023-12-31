//index.js
import Todo from '../../models/Todo'
import todoStore from '../../store/todoStore'

var currentYear = null
var currentMonth = null
var currentDate = null
var nowYear = new Date().getFullYear()
var nowMonth = new Date().getMonth()
var nowDate = new Date().getDate()

//获取应用实例
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    // todos
    todos: [],

    // todo 计数
    uncompletedCount: 0,
    completedCount: 0,

    // 是否动画延迟
    delay: true
  },

  onLoad() {
    var that = this
    if (currentDate != nowDate || currentMonth != nowMonth || currentYear != nowYear) {
      currentYear = nowYear
      currentMonth = nowMonth
      currentDate = nowDate
      that.setData({
        todos: [],
        uncompletedCount: 0,
        completedCount: 0
      })
      //修改对应数据库中的值
      db.collection('userdata').doc("09e78768658a586304d4a19d73b3c162").update({
        data: {
          task_number_done: that.data.completedCount,
          task_number: that.data.uncompletedCount,
          todos: this.data.todos
        },
        success(res) {
          console.log("todos", res)
        }
      })
      // console.log("todos")
      // console.log("todos2",todos)
    } else {
      //没有到新一天，从数据库中获取值
      db.collection('userdata').doc("09e78768658a586304d4a19d73b3c162").get({
        success(res) {
          that.setData({
            uncompletedCount: res.data.task_number,
            completedCount: res.data.task_number_done,
            todos: res.data.todos
          })
          console.log(res)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 为了新建后列表能更新，此逻辑必须写在 onShow 事件
    this.syncData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    this.syncData()
  },

  /**
   * 分享
   */
  onShareAppMessage: function (options) {

  },

  /**
   * 同步数据
   */
  syncData() {
    // 获取列表
    this.data.todos = todoStore.getTodos()
    this.update()
    // 更新置顶标题
    let uncompletedCount = todoStore.getUncompletedTodos().length
    let todayCompletedCount = todoStore.getTodayCompletedTodos().length
    let title = ['TodoList（进行中: ', uncompletedCount, ', 今日已完成: ', todayCompletedCount, '）'].join('')
    wx.setTopBarText({
      text: title
    })
    // 动画结束后取消动画队列延迟
    setTimeout(() => {
      this.update({
        delay: false
      })
    }, 2000)
  },

  /**
   * Todo 数据改变事件
   */
  handleTodoItemChange(e) {
    let index = e.currentTarget.dataset.index
    let todo = e.detail.data.todo
    let item = this.data.todos[index]
    if (todo.completed == true) {
      var score = 0
      db.collection('userdata').doc("09e78768658a586304d4a19d73b3c162").get({
        success(res) {
          score = res.data.score
          console.log("todos score", score)
          console.log("中间变量1", score, parseInt(todo.score))
          score = score + parseInt(todo.score)
          console.log("中间变量", parseInt(todo.score))
          db.collection('userdata').doc("09e78768658a586304d4a19d73b3c162").update({
            data: {
              score: score
            },
            success(res) {
              console.log("todos", score)
            }
          })
        }
      })
    } else {
      var score = 0
      db.collection('userdata').doc("09e78768658a586304d4a19d73b3c162").get({
        success(res) {
          score = res.data.score
          console.log("todos", score)
          score = score - parseInt(todo.score)
          db.collection('userdata').doc("09e78768658a586304d4a19d73b3c162").update({
            data: {
              score: score
            },
            success(res) {
              console.log("todos", res)
            }
          })
        }
      })
    }
    console.log("todo", todo)
    Object.assign(item, todo)
    this.update()
  },

  /**
   * Todo 长按事件
   */
  handleTodoLongTap(e) {
    // 获取 index
    let index = e.currentTarget.dataset.index
    wx.showModal({
      title: '删除提示',
      content: '确定要删除这项任务吗？',
      success: (e) => {
        if (e.confirm) {
          this.data.todos.splice(index, 1)
          this.update()
        }
      }
    })
  },

  /**
   * 更新数据
   */
  update(data) {
    data = data || this.data
    data.completedCount = todoStore.getCompletedTodos().length
    data.uncompletedCount = todoStore.getUncompletedTodos().length
    this.setData(data)
    var that = this
    db.collection('userdata').doc("09e78768658a586304d4a19d73b3c162").update({
      data: {
        task_number_done: that.data.completedCount,
        task_number: that.data.uncompletedCount,
        todos: this.data.todos,
        // score:score+todos.item.score
      },
      success(res) {
        console.log("todosupdate", res)
      }
    })
  },

  /**
   * 新建事件
   */
  handleAddTodo(e) {
    wx.navigateTo({
      url: '../todo/create'
    })
  }
})
// pages/todos/create.js
import Todo from '../../models/Todo'
import todoStore from '../../store/todoStore'

var task_number=0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // todo
    todo: new Todo(),

    // 级别
    levels: ['紧急且重要', '重要不紧急', '紧急不重要', '不紧急不重要'],
  },

  //点击控制下拉框的展示、隐藏
  select:function(){
    var isSelect = this.data.isSelect
    this.setData({ isSelect:!isSelect})
  },
  //点击下拉框选项，选中并隐藏下拉框
  getType:function(e){
    let value = e.currentTarget.dataset.score
    this.setData({
      score:value ,
      isSelect: false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.todo = new Todo()
    this.update()
  },

  /**
   * 分享
   */
  onShareAppMessage: function (options) {

  },

  /**
   * Todo 改变事件
   */
  handleTodoItemChange (e) {
    let todo = e.detail.data.todo
    Object.assign(this.data.todo, todo)
    this.update()
  },

  
  /**
   * 级别改变事件
   */
  handleLevelChange(e) {
    this.data.todo.level = parseInt(e.detail.value) + 1
    this.update()
  },

  bindScoreInput(e){
    let score=e.detail.value
    this.data.todo.score = e.detail.value
    this.update()
    // Object.assign(this.data.todo, todo)
    // this.update()
    // console.log(this.data.score)
  },


  /**
   * 描述输入事件
   */
  handleDescChange (e) {
    this.data.todo.desc = e.detail.value
    this.update()
  },

  /**
   * 取消按钮点击事件
   */
  handleCancelTap (e) {
    wx.navigateBack()
  },

  /**
   * 保存按钮点击事件
   */
  handleSaveTap(e) {
    todoStore.addTodo(this.data.todo)
    todoStore.save()
    wx.navigateBack()
  },

  /**
   * 更新数据
   */
  update (data) {
    data = data || this.data
    this.setData(data)
  }
})
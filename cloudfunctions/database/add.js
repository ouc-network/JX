let db = wx.cloud.database() //设置数据库
let userCollection = db.collection('userdata') //单引号里为刚刚新建的集合名
userCollection.add({
  //这个可能要换成对应的数据
	data: {
      openid: 0,
      score: 0,
      task_number:0,
      //记录已经完成多少任务
      task_number_done:0,
      //下面是任务相关内容
      task_name:"",
      task_score:0,
      task_time_begin:"",
      task_time_done:"",
      //记录是否完成任务，如果完成任务，则将对应值赋值为1
      task_done:0
    }
}).then(res => {
	console.log('添加成功',res)
	this.setData({
    //将增加的值添加到当前页面的变量里
    //number当作用户id
    tele_number: res.tele_number,
    //用户积分
    score:res.score,
    //记录任务多少
    task_number:res.task_number,
    //记录已经完成多少任务
    task_number_done:res.task_number_done,
    //下面是任务相关内容
    task_name:res.task_name,
    task_score:res.task_score,
    task_time_begin:res.task_time_begin,
    task_time_done:res.task_time_done,
     //记录是否完成任务，如果完成任务，则将对应值赋值为1
    task_done:res.task_done
  })
}).catch(err => {
	console.log('添加失败',err)//失败提示错误信息
})
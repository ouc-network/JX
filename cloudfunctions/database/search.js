let db = wx.cloud.database() //设置数据库
let userCollection = db.collection('userdata') //单引号里为刚刚新建的集合名
userCollection.where({
	//where其实是向集合里查询是否有里面这对数据，如果有就返回这条数据记录
	//一般是使用openid（一个用户只有一个openid，具有唯一性，方便查询操作）
  //但目前获取openid需要使用云函数，所以这里就不细讲了，我这里使用每条记录都带有的_id来进行查询
  number:this.data.number
}).get().then(res => {
  console.log('数据查询成功',res)//将返回值存到res里
  //return res
	this.setData({
    //将查询到的数据记录里的number的值存放到data.number
    //稍后再写，将看看怎么显示值
		number: res.data[0].number
	})
}).catch(err => {
	console.log('查询失败',err)//失败提示错误信息
})

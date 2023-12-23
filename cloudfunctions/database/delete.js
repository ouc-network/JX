let db = wx.cloud.database() //设置数据库
let userCollection = db.collection('test_user') //单引号里为刚刚新建的集合名
userCollection.where({
  //先查询
  number:this.data.dataId
}).remove().then(res => {
	console.log('删除成功')
	this.setData({
    //数据库删除了，那也得将data里的值也删了，不然数据容易出错
    
    
	})
}).catch(err => {
	console.log('删除失败',err)//失败提示错误信息
})
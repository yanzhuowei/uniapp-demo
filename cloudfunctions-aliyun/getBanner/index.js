'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	// 获取云数据库对象
	let db = uniCloud.database();
	// 获取 `banner` 集合的引用
	let res = await db.collection("banner").get()

	// let res = await collection.doc("5f46630ddbc28f000122be20").get() // 获取对应的某条数据


	// let res = await collection.add([
	// 	{
	// 		name:"小工2",
	// 		age:100
	// 	},
	// 	{
	// 		name:"小工3",
	// 		age:100
	// 	},
	// 	{
	// 		name:"小工4",
	// 		age:100
	// 	}
	// ])


	// let res = await collection.doc('5f46679eb804650001e71fc1').remove() 删

	// let res =  await collection.doc('5f46670a29c5d3000171f094').update({
	// 	name:"小红"
	// })
	// let res =  await collection.doc('5f46670a29c5d3000171f094').set({
	// 	name:"小红"
	// })
	// set 若没有这条id的时候 会新增数据； update只能更新 在没有对应的数据的时候 更新失败




	//返回数据给客户端
	return {
		data: res.data
	}
};

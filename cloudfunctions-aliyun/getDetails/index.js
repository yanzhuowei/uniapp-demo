'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)

	// 获取云数据库对象
	let db = uniCloud.database();
	let collection = db.collection("details")
	let res = await collection.where({
		goods_id: event.id
	}).get()

	//返回数据给客户端
	return {
		data: res.data
	}
};

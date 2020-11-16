'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	// 获取云数据库对象
	let db = uniCloud.database();
	// 获取 `banner` 集合的引用
	let res = await db.collection("banner").get()

	//返回数据给客户端
	return {
		data: res.data
	}
};


const cloud = require('wx-server-sdk')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database()
const MAX_LIMIT = 20
exports.main = async (event, context) => {
  console.log('调用查询资料函数')
  // 先取出集合记录总数
  const countResult = await db.collection(event.tag).count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 20)
  const RandomSet = Math.floor(Math.random() * batchTimes)
  // 承载所有读操作的 promise 的数组
  var promise = []
  if(total>=20 && (total%20)==0){
    promise =await db.collection(event.tag).skip(RandomSet * MAX_LIMIT).limit(MAX_LIMIT).field({_id:false}).get()
  }
  else if(total>=20 && (total%20)!=0 && batchTimes==(RandomSet+1)){
    promise =await db.collection(event.tag).skip(total-22).limit(MAX_LIMIT).field({_id:false}).get()
  }
  else{
    promise =await db.collection(event.tag).field({_id:false}).get()
  }
  // 等待所有
  return promise
}
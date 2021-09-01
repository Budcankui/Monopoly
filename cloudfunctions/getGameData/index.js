// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
  const db = cloud.database();
  const _ =  db.command;   
// 云函数入口函数
exports.main = async (event, context) => {
  console.log('调用查询存档函数')
  const wxContext =  cloud.getWXContext()
  const num = await db.collection('gameData').where({ openid: wxContext.OPENID}).count()
  if(num.total==1){//如果找到用户存档，返回gameData
   let gameData = await db.collection('gameData')
    .where({
     openid:wxContext.OPENID,
   }).field({
     _id:false,
     openid:false,
   }).get()
    return gameData.data[0]
  }
  else{
     db.collection('gameData').add({//如果没有，新增记录
     data:{
      n: 0, //当前格子n对应blocks下标
      toola: 10, //普通骰子数量
      toolb: 0, //不产生事件道具数量
      toolc: 0, //提示问题答案道具数量
      tool1: 0, // 前进1格骰子道具数量
      tool2: 0, //前进2格骰子道具数量
      tool3: 0, //前进3格骰子道具数量
      usetoolb: false, //是否使用道具b
      score: 0,
      openid:wxContext.OPENID
    }
  })
  return {
    n: 0, 
    toola: 10, 
    toolb: 0, 
    toolc: 0, 
    tool1: 0, 
    tool2: 0, 
    tool3: 0, 
    usetoolb: false, 
    score: 0,
  }
  }
}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  console.log('调用保存存档函数')
const wxContext = cloud.getWXContext()
  db.collection('gameData').where({ openid: wxContext.OPENID}).update({
    data: {
      n: event.gameData.n, 
      toola: event.gameData.toola, 
      toolb:event.gameData.toolb, 
      toolc: event.gameData.toolc,  
      tool1:event.gameData.tool1, 
      tool2: event.gameData.tool2, 
      tool3: event.gameData.tool3, 
      usetoolb: event.gameData.usetoolb, 
      score: event.gameData.score,
    },
  })

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}
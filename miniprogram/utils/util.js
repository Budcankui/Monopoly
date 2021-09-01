const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
function getBlocks(W,H){
  //格子位置.起点事件类型用0，终点用-1.表示无事件
const blocks=[
  {
    x: W / 4 ,
    y: H - H / 4 ,
    eventType: 0,
    url: '',
    id:0
  },
  {
    x: W*0.46 ,
    y: H - H / 4 ,
    eventType: 1,
    url: '',
    id:1
},
{
  x: W*0.52 ,
  y: H*0.64 ,
  eventType: 2,
  url: '',
  id:2
},
{
  x: W*0.60 ,
  y: H*0.54 ,
  eventType: 3,
  url: '',
  id:3
},
{
  x: W*0.65 ,
  y: H*0.42 ,
  eventType:2,
  url: '',
  id:4
},
{
  x: W*0.69 ,
  y: H*0.30 ,
  eventType: 1,
  url: '',
  id:5
},
{
  x: W*0.76 ,
  y: H*0.20 ,
  eventType: 3,
  url: '',
  id:6
},
{
  x: W*0.56 ,
  y: H*0.19 ,
  eventType: -1,
  url: '',
  id:7
},
{
  x: W*0.35 ,
  y: H*0.19 ,
  eventType: 2,
  url: '',
  id:8
},
{
  x: W*0.29 ,
  y: H*0.29 ,
  eventType: 1,
  url: '',
  id:9
},
{
  x: W*0.25 ,
  y: H*0.41 ,
  eventType: 1,
  url: '',
  id:10
},
{
  x: W*0.21 ,
  y: H*0.53 ,
  eventType: 2,
  url: '',
  id:11
},
{
  x: W*0.14 ,
  y: H*0.64 ,
  eventType: 3,
  url: '',
  id:12
},
{
  x: W*0.07 ,
  y: H*0.76 ,
  eventType:4,
  url: '',
  id:13
}
]
return blocks
}

function  getUrls(name,callback) {
  wx.cloud.init({
    env: 'cloud1-0gutn9fvb14fb557',
  })
  const db = wx.cloud.database();
　　db.collection(name).field({_id:false,}).orderBy('序号','asc').where({}).get().then(res => {
       callback(res.data)
　　}).catch(err => {
　　　　console.log(err); //如果更新数据失败则输出失败信息
　　})
}

module.exports = {
  formatTime: formatTime,
  getBlocks: getBlocks,
  getUrls:getUrls
}


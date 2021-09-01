// pages/rank/rank.js
wx.cloud.init({
  env: 'cloud1-0gutn9fvb14fb557',
})
const db = wx.cloud.database();
const _ = db.command
var app = getApp()
const NAME_LENGTH = 6
const MIN_SCORE=0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMadal: true,
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    if (options.hasUesInfo==='1') {//如果已有用户信息
      this.setData({
        showMadal: false
      })
     this.show()
    }
  },

  show: async function(){
    wx.showLoading({
      title: '加载中……',
    })
    this.rankData = [] //储存所有需要渲染的排名信息
    await this.getOpenidsAndScore()
    await this.getUserInfoData()
    this.sortRankData()
    this.setData({
      rankData: this.rankData
    })
    this.myrank()
    wx.hideLoading({
    })
  },

  getOpenidsAndScore: async function () {
    let res = await db.collection('gameData').where({
      score: _.gt(MIN_SCORE)
    }).orderBy('score', 'desc').limit(20).field({
      _id: false,
      score: true,
      openid: true
    }).get()
    this.openids = []
    res.data.forEach((item, i, arr) => {
      this.rankData.push({
        score: item.score,
        openid: item.openid,
        avatarUrl:"https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E6%A9%98%E7%8C%AB%E5%A4%B4%E5%83%8F.png?sign=d089aa843e2404a723a3e8d23d57eaf5&t=1630386587",
        nickName:"匿名"
      })
      this.openids.push(item.openid)
    })
  },

  getUserInfoData: async function () {
    
    let res = await db.collection('UserInformation').where({
      _openid: _.in(this.openids)
    }).orderBy('score', 'desc').field({
      _id: false,
      _openid: true,
      avatarUrl: true,
      nickName: true
    }).get()
    console.log("用户信息：",res.data)
    res.data.forEach((item, i, arr) => {
      for (var j = 0; j < this.rankData.length; j++) {
        if (this.rankData[j].openid == item._openid) {
          this.rankData[j].avatarUrl = item.avatarUrl
          // if (item.nickName.length > NAME_LENGTH) {
            // item.nickName.splice(NAME_LENGTH, item.nickName.length - NAME_LENGTH)
          // }
          this.rankData[j].nickName = item.nickName
        } 
      }
    })
  },

  sortRankData: function () {
    function cmp(v1, v2) {
      return v2 - v1
    }
    this.rankData.sort(cmp)
    console.log("排序后的完整信息", this.rankData)
  },
  myrank: function () {
    var rank = 0
    this.rankData.forEach((item, i, arr) => {
      if (arr[i].openid == app.globalData.openid)
        rank = i + 1
    })
    if (rank)
      this.setData({
        myRank: rank
      })
    else
      this.setData({
        myRank: "未上榜"
      })

  },

  confirmHandle: async function () {
    wx.getUserProfile({
      desc: 'desc',
      success: (res) => {
        db.collection('UserInformation').add({
          data: res.userInfo
        }).then(res => {
        this.show()//展示排名信息

          this.hasUesrInfo = true
          console.log('保存用户信息成功:', res)
        })
      },
      fail: (e) => {
        wx.showToast({
          title: '授权失败',
          icon: "error"
        })
       this.show()//展示排名信息
     
      }
    })
  },

  backHandle: function () {
    this.show()//展示排名信息
    // wx.navigateBack({
    //   delta: 1,
    // })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
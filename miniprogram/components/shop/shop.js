// components/shop.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: true
    },
    fish: {
      type: Number,
      value: 0
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
//生命周期函数
lifetimes: {
  attached: function() {
    // 在组件实例进入页面节点树时执行
      this.setData({
        background:"https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E5%95%86%E5%BA%97/%E5%95%86%E5%BA%97%E8%83%8C%E6%99%AF.png?sign=57738cfe5db6057afe52d765e9b8e8e6&t=1630251726",
        btn:"https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E5%95%86%E5%BA%97/%E8%BF%94%E5%9B%9E%E6%8C%89%E9%92%AE.png?sign=265794f0407f6147cbf23d2e74e79271&t=1630251767",
        toolc:"https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E5%95%86%E5%BA%97/%E9%97%AE%E7%AD%94%E6%8F%90%E7%A4%BA.png?sign=0a3a095fefaf8f3fbe8551b8efe90c4f&t=1630146226", 
        toolb:"https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E5%95%86%E5%BA%97/%E8%B7%B3%E8%BF%87%E7%89%B9%E6%AE%8A%E4%BA%8B%E4%BB%B6.png?sign=380a0066ff70f072b0d3d94bfe5611e1&t=1630146204",
        toola:"https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E5%95%86%E5%BA%97/%E6%99%AE%E9%80%9A%E9%AA%B0%E5%AD%90.png?sign=565098d3278595e91c8a88d34ab4c092&t=1630146187",
        tool1:"https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E5%95%86%E5%BA%97/%E5%89%8D%E8%BF%9B%E4%B8%80%E6%AD%A5.png?sign=0d1c274dbe8f874e188949f54a14e03e&t=1630146166",
        tool2:"https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E5%95%86%E5%BA%97/%E5%89%8D%E8%BF%9B%E4%B8%A4%E6%AD%A5.png?sign=8bde0279066e7aa5daa72236eff01acf&t=1630146152",
        tool3:"https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E5%95%86%E5%BA%97/%E5%89%8D%E8%BF%9B3%E6%AD%A5.png?sign=74cc9548e13d91ab0abd5e02c78e1c53&t=1630146129",
      })
  },
  detached: function() {
    // 在组件实例被从页面节点树移除时执行
  },
},
  /**
   * 组件的方法列表
   */
  methods: {
hideHandle:function(){
  this.triggerEvent('hideShop')
},

buyToola:function(){
  if(this.properties.fish<1){
    wx.showToast({
      title: '小鱼饼干不足',
      duration:500,
      icon:'erorr'
    })
  return 
  }
  wx.showToast({
    title: '购买成功',
    duration:500
  })
  this.triggerEvent('buyToola')
},
buyToolb:function(){
  if(this.properties.fish<5){
    wx.showToast({
      title: '小鱼饼干不足',
      duration:500,
      icon:'erorr'
    })
  return 
  }
  wx.showToast({
    title: '购买成功',
    duration:500
  })
  this.triggerEvent('buyToolb')
},
buyToolc:function(){
  if(this.properties.fish<5){
    wx.showToast({
      title: '小鱼饼干不足',
      duration:500,
      icon:'erorr'
    })
  return 
  }
  wx.showToast({
    title: '购买成功',
    duration:500
  })
  this.triggerEvent('buyToolc')
},

buyTool1:function(){
  if(this.properties.fish<5){
    wx.showToast({
      title: '小鱼饼干不足',
      duration:500,
      icon:'erorr'
    })
  return 
  }
  wx.showToast({
    title: '购买成功',
    duration:500
  })
  this.triggerEvent('buyTool1')
},
buyTool2:function(){
  if(this.properties.fish<5){
    wx.showToast({
      title: '小鱼饼干不足',
      duration:500,
      icon:'erorr'
    })
  return 
  }
  wx.showToast({
    title: '购买成功',
    duration:500
  })
  this.triggerEvent('buyTool2')
},
buyTool3:function(){
  if(this.properties.fish<5){
    wx.showToast({
      title: '小鱼饼干不足',
      duration:500,
      icon:'erorr'
    })
  return 
  }
  wx.showToast({
    title: '购买成功',
    duration:500
  })
  this.triggerEvent('buyTool3')
},
disable:function(){}


  }
})

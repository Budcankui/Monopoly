// components/que/que.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: true
    },
    ansone: {
      type: String,
    },
    anstwo: {
      type: String,
    },
    ansthree: {
      type: String,
    },
    ansfour: {
      type: String,
    },
    reason:{
      type: String,
      value:''
    },
    ques: {
      type: String,
      value:'河流在区域经济发展中有重要的作用,但这种作用在不同的河流、不同的河段其表现不同在河流经宁夏和内蒙古时,它的主要作用是为当地经济发展提供'
    },
    num: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
showtoolc:true
  },
  //生命周期函数
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
        this.setData({
          content:"https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E9%97%AE%E9%A2%98/%E9%97%AE%E7%AD%94%E6%A1%86.png?sign=e70b3ec2b5c0e6f8184e6e955d4ed684&t=1630145760",
          que:"https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E9%97%AE%E9%A2%98/%E6%96%87%E5%AD%97%E6%A1%86.png?sign=6f0d37d9d81e8d0984392e29dfdc23f7&t=1630145634" ,
          item:"https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E9%97%AE%E9%A2%98/%E9%80%89%E9%A1%B9%E6%A1%86.png?sign=f276b8cce2976380b2eefbd64fb6620c&t=1630145672",
          toolBar:"https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E9%97%AE%E9%A2%98/%E9%81%93%E5%85%B7%E6%A1%86.png?sign=3b4af1652837976aa48ec2978dbccf5a&t=1630145708",
          tool:"https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E9%97%AE%E9%A2%98/%E9%81%93%E5%85%B7.png?sign=06db9d5339c7568ec9de1562f68537d9&t=1630145734",
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
    hitone() {
        this.triggerEvent('hitone')
      this.setData({
        // show: false,
        showtoolc:true
      })
    },
    hittwo() {
        this.triggerEvent('hittwo')
      this.setData({
        // show: false,
        showtoolc:true
      })
    },
    hitthree() {
        this.triggerEvent('hitthree')
      this.setData({
        // show: false,
        showtoolc:true
      })
    },
    hitfour() {
        this.triggerEvent('hitfour')
      this.setData({
        // show: false,
        showtoolc:true
      })
    },
    toolcHandle() {
      this.setData({
        showtoolc:false
      })
      this.triggerEvent('toolcHandle');
    },
    disable() {
     
    }
  }
})
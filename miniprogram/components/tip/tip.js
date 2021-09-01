// components/tip/tip.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value:true
    },
    content:{
      type:String,
      value:"战国以后随着铁农具的广泛使用和秦国经济中心向关中迁移，黄河流域与黄土高原的植被开始遭到破坏。由于黄河流域在很长一段时间内一直是中国文明的中心之地(《中国历史地理学》，蓝勇，2002 年)，加之以古代中国重农轻牧的现象，黄河流域植被破坏成为长期、大量的现象。"
    },
    url:{
      type:String,
    }
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
        cat:"https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E7%A7%91%E6%99%AE/%E7%A7%91%E6%99%AE%E6%A0%8F%E4%B8%8A.png?sign=5c741d53eb962f862993098961216966&t=1630146378",
        btn:"https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E7%A7%91%E6%99%AE/%E7%A1%AE%E8%AE%A4.png?sign=308e5f43f962a97716b405781e4ba4a7&t=1630145371", 
        con:"https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E7%A7%91%E6%99%AE/%E7%A7%91%E6%99%AE%E6%A0%8F%E4%B8%8B.png?sign=68c04c85f3e4b5d3a76a0461c0b55b70&t=1630140073",
        text:"https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E7%A7%91%E6%99%AE/%E6%96%87%E5%AD%97%E6%A1%86.png?sign=e8a9a42562cafcbb174c6a8b77b4e78d&t=1630145310",
        img:"https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E7%A7%91%E6%99%AE/%E5%9B%BE%E7%89%87%E6%A1%86.png?sign=1b4afc2028863395aaa2379a4b51e0a5&t=1630145278",
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
    confirm() {
      this.triggerEvent('confirm')
    }
  },
  disable(){}
})

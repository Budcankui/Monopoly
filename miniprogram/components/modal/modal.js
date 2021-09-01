// components/modal/modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: true
    },
    title: {
      type: String,
      value: '新的开始'
    },
    content: {
      type: String,
      value: '是否覆盖原先存档，开始新的游戏？'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    confirm() {
      this.setData({
        show: false
      })
      this.triggerEvent('confirm')
    },
    cancel() {
      this.setData({
        show: false
      })
      this.triggerEvent('cancel')
    },

  }
})
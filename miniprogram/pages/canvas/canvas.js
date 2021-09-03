var systemInfo = wx.getSystemInfoSync()
const W = systemInfo.windowWidth //WXSS中Map的 px 尺寸
const H = systemInfo.windowHeight //WXSS中Map的 px   尺寸
const RATE = systemInfo.windowHeight / systemInfo.windowWidth //当前设备屏幕比例
const BLOCKNUM = 14 //格子总数
const ENDBLOCK = 7,
  STARTBLOCK = 0 //终点格子 起点格子的下标
const EVENT1 = 4,
  EVENT2 = 4,
  EVENT3 = 3,
  EVENT4 = 1 //事件类型个数.起点和终点没有类型
const TIP = 1,
  QUESTION = 2,
  REWARD = 3,
  PUNISH = 4 //科普，问答，奖励，后退
//格子位置.起点事件类型用0，终点用-1.表示无事件
const util = require('../../utils/util.js')
const blocks = util.getBlocks(W, H)
//问题数组
var currentQ //记录当前问题下标
var currentT //记录当前科普下标
var questions = []
var tips = []
var time //定时器
var flagRemake = false
var flagGetGameData = false

var app = getApp()
wx.cloud.init({
  env: 'cloud-6gjcg45vb8bb67da',
})
const db = wx.cloud.database();
const _ = db.command

Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    blockWidth: 12,
    blockHeight: 12 / RATE,
    roleWidth: 12,
    roleHeight: 12 / RATE,
    blocks: blocks,
    topText: "普通骰子会触发格子事件，商店可以购买和查看道具用途。",
    toola: 10, //普通骰子数量
    toolb: 0, //不产生事件道具数量
    toolc: 0, //提示问题答案道具数量
    tool1: 0, // 前进1格骰子道具数量
    tool2: 0, //前进2格骰子道具数量
    tool3: 0, //前进3格骰子道具数量
    score: 0, //分数可以换游戏币 TODOS：自定义商店组件，操纵score
    disabletools: false, //禁用骰子
    showShop: false,
    showUnfoldToolBar: false,
    showKepu: false,
    showQuestion: false,
    showMadal: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    wx.showLoading({
      title: '加载中……',
    })
    //获取openid
    await this.getOpenid()
    //读取问题数组
    this.getQuestions()
    //读取科普数组
    this.getTips()
    time = setInterval(function () { //之后每15分钟更新一次科普和问题数组
      this.getQuestions()
      this.getTips()
    }.bind(this), 1000 * 60 * 15)

    if (options.id == 1) //点击开始按钮，重开新游戏
      this.newGame()

    if (options.id == 2) //点击继续按钮，读取缓存游戏数据并渲染到页面
      this.getGameData()

    setInterval(function () { //每0.5秒检查一次破产状态
      if (flagGetGameData == true && this.data.loading == false && this.gameData.score == 0 && this.gameData.tool1 == 0 && this.gameData.tool2 == 0 && this.gameData.tool3 == 0 && this.gameData.toola == 0)
        flagRemake = true
      if (flagRemake && !this.data.disabletools && this.data.showShop == false && this.data.showKepu == false && this.data.showQuestion == false)
        this.remake()
    }.bind(this), 500)
  },

  async getOpenid() {
    if (!app.globalData.openid) { //如果没有id,获取openid
      let res = await wx.cloud.callFunction({
        name: 'getOpenid'
      })
      app.globalData.openid = res.result.openid
      console.log('获取openid成功:', app.globalData.openid)
    }
  },

  newGame:async function() {
    this.gameData = {
      blocks: blocks, //开始格子和结束格子事件类型设为0
      n: STARTBLOCK, //当前格子n对应blocks下标
      toola: 10, //普通骰子数量
      toolb: 0, //不产生事件道具数量
      toolc: 0, //提示问题答案道具数量
      tool1: 0, // 前进1格骰子道具数量
      tool2: 0, //前进2格骰子道具数量
      tool3: 0, //前进3格骰子道具数量
      usetoolb: false, //是否使用道具b
      score: 0,
    }
    //保存数据
     await wx.cloud.callFunction({
      // 云函数名称
      name: 'saveGameData',
      // 传给云函数的参数
      data: {
        gameData: this.gameData
      },
    })
    this.mysetData()
  },


  remake() {
    //数据处理
    flagRemake = false
    this.gameData.toolb = 0,
      this.gameData.toolc = 0,
      this.gameData.toola += 10
    this.gameData.n = STARTBLOCK
    //提示信息
    this.changeTopTextTo("当小鱼饼干和可前进道具数量为零时猫猫破产，其他道具数量也会清零。")
    //1秒后弹出模态窗
    setTimeout(function () {
      this.setData({
        showMadal: true,
      })
    }.bind(this), 1000)
  },
  continueHandle: function () {
    this.setData({
      showMadal: false
    })
    //渲染数据
    this.setData({
      toolb: this.gameData.toolb,
      toolc: this.gameData.toolc,
      toola: this.gameData.toola,
    })
    //画出人物位置(开始位置)
    this.moveRoleToN(this.gameData.n, 1)
  },
  exitHandle: function () {
    this.setData({
      showMadal: false
    })
    //返回上一个页面
    wx.navigateBack({
      delta: 1,
    })
  },

  getQuestions: function () { //调用云函数读取问题数组
    wx.cloud.callFunction({
      name: 'getRandomContent',
      data: {
        tag: 'QA',
      },
      success: function (res) {
        questions = res.result.data
        console.log('读取问题成功', questions.length)
      },
      fail: function (error) {
        console.log(error)
        questions = [{
          content: "问题的答案是()",
          item1: "选项",
          item2: "选项",
          item3: "选项",
          item4: "选项",
          ans: 1
        }]
      }
    })
  },
  getTips: function () { //调用云函数读取科普数组
    wx.cloud.callFunction({
      name: 'getRandomContent',
      data: {
        tag: 'Kepus',
      },
      success: function (res) {
        tips = res.result.data
        console.log('读取科普成功', tips.length)
      },
      fail: function (error) {
        console.log(error)
        tips = [{
          content: "科普内容",
          url: 'https://tse1-mm.cn.bing.net/th/id/R-C.788a3ca3fc34a8f457b6a9a582cbebd6?rik=Nlwza%2bi%2f1I2W4Q&riu=http%3a%2f%2fimg.pptjia.com%2fimage%2f20180117%2f16e6d1b2adcb7796e411899957f5f686.jpg&ehk=4%2bqM6f6DYFdLm6Cu4IPioBdsQT5fiqSYmQ073igic8Y%3d&risl=&pid=ImgRaw&r=0'
        }]
      }
    })
  },
  getGameData: function () { //调用云函数读取存档
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getGameData',
      // 传给云函数的参数
      data: {
        gameData: this.gameData
      },
      success: function (res) { //读取存档后渲染页面
        this.gameData = res.result

        this.gameData.blocks = blocks
        flagGetGameData = true
        console.log('读取游戏存档成功')
        this.mysetData() //渲染页面
      }.bind(this),
      fail: function (error) {
        console.log(error)
        this.newGame()
      }.bind(this)
    })
  },

  mysetData: function () { //页面加载第一次渲染
    this.setData({ //数据渲染
      toola: this.gameData.toola,
      toolb: this.gameData.toolb,
      toolc: this.gameData.toolc,
      tool1: this.gameData.tool1,
      tool2: this.gameData.tool2,
      tool3: this.gameData.tool3,
      score: this.gameData.score,
    })
    //画出人物位置
    this.moveRoleToN(this.gameData.n, 1)
    //画出格子类型
    this.drawBlocks(this.gameData.blocks)
    wx.hideLoading({
      success: (res) => {},
    })
    this.setData({
      loading: false,
    })

  },

  moveRoleToN(n, time) { //根据传入当前的格子下标n,移动人物到第n格
    let animationRole = wx.createAnimation({
      duration: time
    })
    animationRole.top(blocks[n].y).left(blocks[n].x).step()
    //执行动画
    this.setData({
      animationRole: animationRole.export()
    })
  },

  a: function (i, n) { //i->n人物顺时针按格前进
    if (i < n) {
      setTimeout(function () {
        let animationRole = wx.createAnimation({
          duration: 300
        })
        animationRole.top(blocks[i + 1].y).left(blocks[i + 1].x).step()
        //执行动画
        this.setData({
          animationRole: animationRole.export()
        })
        i++
        if (i >= n) return //动画完成后，递归结束
        this.a(i, n)
      }.bind(this), 300)
    }
  },

  b: function (i, n) { //i->n人物逆时针按格前进
    if (i > n) {
      setTimeout(function () {
        let animationRole = wx.createAnimation({
          duration: 300
        })
        animationRole.top(blocks[i - 1].y).left(blocks[i - 1].x).step()
        //执行动画
        this.setData({
          animationRole: animationRole.export()
        })
        i--
        //动画完成后，递归结束，骰子类道具可用
        if (i <= n) return
        this.b(i, n)
      }.bind(this), 300)
    }
  },

  //列表渲染的方式画出blocks类型
  drawBlocks: function (bks) {
    for (var i = 0; i < BLOCKNUM; i++) {
      switch (bks[i].eventType) {
        case TIP:
          this.data.blocks[i].url = "https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E7%A7%91%E6%99%AE%E6%A0%BC%E5%AD%90.png?sign=dc5e0996513208d1b9a2c9d432aa5cef&t=1630143309"
          break;
        case QUESTION:
          this.data.blocks[i].url = "https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E9%97%AE%E9%A2%98%E6%A0%BC%E5%AD%90.png?sign=af1b9908c6c328da6711a09b34ecc6f7&t=1630143266"
          break;
        case REWARD:
          this.data.blocks[i].url = "https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E5%89%8D%E8%BF%9B%E6%A0%BC%E5%AD%90.png?sign=aade8a3aefee5518ee9b3ff82219feb7&t=1630143283"
          break;
        case PUNISH:
          this.data.blocks[i].url = "https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E5%90%8E%E9%80%80%E6%A0%BC%E5%AD%90.png?sign=57a8f867476297cd3d054131cac85114&t=1630143294"
          break;
        case 0:
          this.data.blocks[i].url = "https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E5%BC%80%E5%A7%8B%E6%A0%BC%E5%AD%90.png?sign=a6f2d654a45eb5e60bae934b8e586980&t=1630143342"
          break;
        case -1:
          this.data.blocks[i].url = "https://636c-cloud1-0gutn9fvb14fb557-1306666924.tcb.qcloud.la/%E5%9B%BE%E7%89%87/%E7%BB%93%E6%9D%9F%E6%A0%BC%E5%AD%90.png?sign=c1ba6ca8591a758c14acd249d9b59a91&t=1630143253"
          break;
      }
    }
    this.setData({
      blocks: this.data.blocks
    })
  },

  //顶部提示文字
  changeTopTextTo: function (str) {
    this.setData({
      topText: str
    })
  },

  moveRoleByN: function (n) {
    var oldN = this.gameData.n
    this.gameData.n += n; //前进相应格数,更新游戏数据：
    if (n >= 0) //顺时针前进
    {
      if (this.gameData.n < BLOCKNUM) {
        this.a(oldN, this.gameData.n)
      }
      if (this.gameData.n == BLOCKNUM) {
        this.gameData.n = STARTBLOCK
        this.a(oldN, BLOCKNUM - 1)

        setTimeout(function () {
          this.moveRoleToN(STARTBLOCK, 300)
        }.bind(this), 300 * (BLOCKNUM - oldN))

      }
      if (this.gameData.n > BLOCKNUM) {
        this.a(oldN, BLOCKNUM - 1)

        setTimeout(function () {
          this.moveRoleToN(STARTBLOCK, 300)
        }.bind(this), 300 * (BLOCKNUM - oldN))

        this.gameData.n %= blocks.length
        setTimeout(function () {
          this.a(STARTBLOCK, this.gameData.n)
        }.bind(this), 300 + 300 * (BLOCKNUM - oldN))

      }
    }
    if (n < 0) //逆时针前进
    {
      this.b(oldN, this.gameData.n)
    }
  },

  gameWin: function () {
    //积分+20
    this.gameData.score += 20;
    this.setData({
      score: this.gameData.score,
      disabletools: true
    })
    //存储所有格子的下标。防止重复绑定事件
    var indexArr = []
    var index
    for (var i = 0; i < EVENT1; i++) {
      //随机数0 ~ BLOCKNUM-1 对应随机下标
      index = Math.floor(Math.random() * BLOCKNUM)
      //如果该格子已经被绑定过事件，继续产生随机数
      while (indexArr.find(item => {
          return item == index
        }) || index == STARTBLOCK || index == ENDBLOCK) {
        index = Math.floor(Math.random() * BLOCKNUM)
      }
      //绑定事件 下标压入下标数组
      this.gameData.blocks[index].eventType = TIP
      indexArr.push(index)
    }
    for (var i = 0; i < EVENT2; i++) {
      //随机数0 ~ BLOCKNUM-1 对应随机下标
      index = Math.floor(Math.random() * BLOCKNUM)
      //如果该格子已经被绑定过事件，继续产生随机数
      while (indexArr.find(item => {
          return item == index
        }) || index == STARTBLOCK || index == ENDBLOCK) {
        index = Math.floor(Math.random() * BLOCKNUM)
      }
      //绑定事件 下标压入下标数组
      this.gameData.blocks[index].eventType = QUESTION
      indexArr.push(index)
    }
    for (var i = 0; i < EVENT3; i++) {
      //随机数0 ~ BLOCKNUM-1 对应随机下标
      index = Math.floor(Math.random() * BLOCKNUM)
      //如果该格子已经被绑定过事件，继续产生随机数
      while (indexArr.find(item => {
          return item == index
        }) || index == STARTBLOCK || index == ENDBLOCK) {
        index = Math.floor(Math.random() * BLOCKNUM)
      }
      //绑定事件 下标压入下标数组
      this.gameData.blocks[index].eventType = REWARD
      indexArr.push(index)
    }
    for (var i = 0; i < EVENT4; i++) {
      //随机数0 ~ BLOCKNUM-1 对应随机下标
      index = Math.floor(Math.random() * BLOCKNUM)
      //如果该格子已经被绑定过事件，继续产生随机数
      while (indexArr.find(item => {
          return item == index
        }) || index == STARTBLOCK || index == ENDBLOCK) {
        index = Math.floor(Math.random() * BLOCKNUM)
      }
      //绑定事件 下标压入下标数组
      this.gameData.blocks[index].eventType = PUNISH
      indexArr.push(index)
    }
    //重画格子
    this.drawBlocks(this.gameData.blocks)
    //人物回到开始位置
    this.gameData.n = STARTBLOCK
    this.moveRoleToN(this.gameData.n, 1000)
    setTimeout(function () {
      //提示信息
      this.changeTopTextTo('恭喜您达到终点，奖励小鱼饼干×20，进入下一关。')
      this.setData({ //骰子可用
        disabletools: false
      })
    }.bind(this), 1000)
  },



  //事件处理函数-------------
  throwHandle: function (e) { //处理点击掷普通骰子
    //禁用骰子
    this.setData({
      disabletools: true
    })

    //提示道具不足
    if (this.gameData.toola == 0) {
      this.changeTopTextTo('道具数量不足！')
      this.setData({ //骰子可用
        disabletools: false
      })
      return
    }

    //数量减一，渲染
    this.gameData.toola--
    this.setData({
      toola: this.gameData.toola
    })

    //前进相应点数
    let n = Math.floor(Math.random() * 6 + 1) //产生随机数1-6 
    this.changeTopTextTo('掷出' + n + '步！')
    //传入移动格数，画出移动后人物 ,此时骰子仍禁用
    this.moveRoleByN(n)
    //延时等待移动完成执行下一步操作
    setTimeout(function () {
      this.happenEvent()
    }.bind(this), 300 * (n + 3))
  },
  happenEvent: function () {
    //如果到达终点
    if (this.gameData.n == ENDBLOCK)
      return this.gameWin()

    //如果是起点格子，无事件，挂掉函数,骰子设为可用
    if (this.gameData.n == STARTBLOCK) {
      this.setData({
        disabletools: false
      })
      return
    }

    //如果使用了道具2，直接return，函数结束，同时usetoolb状态被清空
    if (this.gameData.usetoolb == true) {
      this.setData({ //骰子可用
        disabletools: false
      })
      return this.gameData.usetoolb = false;
    }
    //处理格子对应事件
    this.eventHandle(this.gameData.n) //传入参数：当前格子数 n
  },

  eventHandle: function (n) { //处理四种掷骰子后发生的事件
    if (this.gameData.blocks[n].eventType == TIP) { //科普事件 
      console.log('科普事件 ', this.gameData.toola, this.data.disabletools)
      this.changeTopTextTo("阅读科普知识，奖励小鱼饼干×5。")
      //随机从科普数组中读取一个
      currentT = Math.floor(Math.random() * tips.length) //随机数

      this.setData({
        score: this.gameData.score += 5,
        showKepu: true,
        disabletools: false, //骰子可用
        tipContent: tips[currentT].content,
        tipUrl: tips[currentT].url
      })

    } else if (this.gameData.blocks[n].eventType == QUESTION) { //问答事件 
      console.log('问答事件 ', this.gameData.toola, this.data.disabletools)
      this.changeTopTextTo("回答正确随机奖励一件道具，使用下方道具提示正确答案。")
      //随机从问题数组中读取一个问题
      currentQ = Math.floor(Math.random() * questions.length) //随机数
      this.setData({
        question: questions[currentQ].content, //问题传入界面层渲染
        item1: questions[currentQ].item1,
        item2: questions[currentQ].item2,
        item3: questions[currentQ].item3,
        item4: questions[currentQ].item4,
        showQuestion: true,
      })
      this.setData({ //骰子可用
        disabletools: false
      })
    } else if (this.gameData.blocks[n].eventType == REWARD) { //奖励事件 TODOS:
      console.log('奖励事件 ', this.gameData.toola, this.data.disabletools)
      let n = Math.floor(Math.random() + 0.5) //随机数0或1
      if (n) {
        //画出移动后人物
        this.moveRoleByN(1)
        setTimeout(function () {
          //提示信息
          let r = Math.floor(Math.random() * 3 + 1)
          if (r == 1) {
            this.changeTopTextTo('你帮助了一个黄河纤夫，他决定免费载你前进一步。')
          }
          if (r == 2) {
            this.changeTopTextTo('你参观了甘肃省黄河文化主题美术作品展，心有感悟，额外前进一步。')
          }
          if (r == 3) {
            this.changeTopTextTo('你救下一只秦岭细鳞鲑，获得赠礼，额外前进一步。')
          }

          if (this.gameData.n == ENDBLOCK) { //如果到达终点
            return this.gameWin()
          } else {
            this.setData({ //骰子可用
              disabletools: false
            })
          }
        }.bind(this), 500)
      } else {
        //提示信息
        Math.floor(Math.random() + 0.5) ? this.changeTopTextTo('你收到热情的当地人赠送的一包植物种子。') : this.changeTopTextTo('泥沙中似乎埋着一些亮闪闪的东西……')
        //随机奖励一种道具
        let n = Math.floor(Math.random() * 6 + 1)
        switch (n) {
          case 1:
            this.gameData.toola++,
              this.setData({
                toola: this.gameData.toola,
                disabletools: false //骰子可用
              })
            break;
          case 2:
            this.gameData.toolb++,
              this.setData({
                toolb: this.gameData.toolb,
                disabletools: false //骰子可用
              })
            break;
          case 3:
            this.gameData.toolc++,
              this.setData({
                toolc: this.gameData.toolc,
                disabletools: false //骰子可用
              })
            break;
          case 4:
            this.gameData.tool1++,
              this.setData({
                tool1: this.gameData.tool1,
                disabletools: false //骰子可用
              })
            break;
          case 5:
            this.gameData.tool2++,
              this.setData({
                tool2: this.gameData.tool2,
                disabletools: false //骰子可用
              })
            break;
          case 6:
            this.gameData.tool3++,
              this.setData({
                tool3: this.gameData.tool3,
                disabletools: false //骰子可用
              })
            break;
        }
      }
    } else if (this.gameData.blocks[n].eventType == PUNISH) { //惩罚事件
      console.log('惩罚事件 ', this.gameData.toola, this.data.disabletools)
      //画出移动后人物
      this.moveRoleByN(-1)
      setTimeout(function () {
        //提示信息
        let n = Math.floor(Math.random() * 3 + 1)
        if (n == 1) {
          this.changeTopTextTo('你突然遇到一个急性水流，后退一步。')
        }
        if (n == 2) {
          this.changeTopTextTo('你决定在当地滞留一段时间了解少数民族的“黄河情“，额外后退一步。')
        }
        if (n == 3) {
          this.changeTopTextTo('你途径废弃矿山的修复工作，后退一步。')
        }
        if (this.gameData.n == ENDBLOCK) {
          this.moveRoleByN(-1) //再后退移动一格
          setTimeout(function () {
            this.changeTopTextTo('遇到终点再后退' + 1 + '步') //提示信息
            this.setData({ //骰子可用
              disabletools: false
            })
          }.bind(this), 500)
        } else {
          this.setData({ //骰子可用
            disabletools: false
          })
        }
      }.bind(this), 500)
    }
  },

  ans1Handle: function (e) {
    setTimeout(function () {
      this.setData({
        showQuestion: false,
        reason: ''
      })
      this.ansIsTrue(1)
    }.bind(this), 200);
  },
  ans2Handle: function (e) {
    setTimeout(function () {
      this.setData({
        showQuestion: false,
        reason: ''
      })
      this.ansIsTrue(2)
    }.bind(this), 200);
  },

  ans3Handle: function (e) {
    setTimeout(function () {
      this.setData({
        showQuestion: false,
        reason: ''
      })
      this.ansIsTrue(3)
    }.bind(this), 200);
  },
  ans4Handle: function (e) {
    setTimeout(function () {
      this.setData({
        showQuestion: false,
        reason: ''
      })
      this.ansIsTrue(4)
    }.bind(this), 200);
    this.ansIsTrue(4)
  },
  ansIsTrue: function (ans) {
    if (ans == questions[currentQ].ans) {
      this.changeTopTextTo('回答正确！随机奖励一件道具。') //提示信息
      //产生随机数奖励道具
      let n = Math.floor(Math.random() * 6 + 1)
      switch (n) {
        case 1:
          this.setData({
            toola: this.gameData.toola++
          })
          break;
        case 2:
          this.setData({
            toolb: this.gameData.toolb++
          })
          break;
        case 3:
          this.setData({
            toolc: this.gameData.toolc++
          })
          break;
        case 4:
          this.setData({
            tool1: this.gameData.tool1++
          })
          break;
        case 5:
          this.setData({
            tool2: this.gameData.tool2++
          })
          break;
        case 6:
          this.setData({
            tool3: this.gameData.tool3++
          })
          break;
      }
    } else {
      this.changeTopTextTo('回答错误！') //提示信息
    }
  },

  tool1Handle: function () {
    //道具数量不足
    if (this.gameData.tool1 <= 0)
      return this.changeTopTextTo('道具数量不足！')
    //禁用骰子
    this.setData({
      disabletools: true
    })

    //道具数量减1并绑定数据渲染出来
    this.gameData.tool1--
    this.setData({
      tool1: this.gameData.tool1
    })
    this.moveRoleByN(1) //前进一格
    this.changeTopTextTo('使用特殊骰子，掷出一步。') //提示信息
    //延时等待移动完成。
    setTimeout(function () {
      this.happenEvent()
    }.bind(this), 1000)
  },
  tool2Handle: function () {
    //道具数量不足
    if (this.gameData.tool2 <= 0)
      return this.changeTopTextTo('道具数量不足!')
    //禁用骰子
    this.setData({
      disabletools: true
    })

    //道具数量减1并绑定数据渲染出来
    this.gameData.tool2--
    this.setData({
      tool2: this.gameData.tool2
    })
    this.moveRoleByN(2) //前进二格
    this.changeTopTextTo('使用特殊骰子，掷出二步！') //提示信息
    //延时等待移动完成。
    setTimeout(function () {
      this.happenEvent()
    }.bind(this), 1200)
  },
  tool3Handle: function () {
    //道具数量不足
    if (this.gameData.tool3 <= 0)
      return this.changeTopTextTo('道具数量不足!')
    //禁用骰子
    this.setData({
      disabletools: true
    })
    //道具数量减1并绑定数据渲染出来
    this.gameData.tool3--
    this.setData({
      tool3: this.gameData.tool3
    })
    this.moveRoleByN(3) //前进三格
    this.changeTopTextTo('使用特殊骰子，掷出三步！') //提示信息
    //延时等待移动完成。
    setTimeout(function () {
      this.happenEvent()
    }.bind(this), 1600)
  },

  toolbHandle: function () { //不产生事件道具toolb
    //道具数量不足
    if (this.gameData.toolb <= 0)
      return this.changeTopTextTo('道具数量不足!')
    //如果已经使用过一次
    if (this.gameData.usetoolb == true)
      return this.changeTopTextTo('不能重复使用道具！')
    //道具数量减1并绑定数据渲染出来
    this.gameData.toolb--
    this.setData({
      toolb: this.gameData.toolb
    })
    //游戏状态改为使用了道具b
    this.gameData.usetoolb = true
    this.changeTopTextTo("使用成功，下次掷出普通骰子不触发格子事件。")
  },
  toolcHandle: function () {
    //没有问题弹窗。不能使用
    if (!this.data.showQuestion)
      return this.changeTopTextTo('该道具当前不可使用！')
    //道具数量不足
    if (this.gameData.toolc <= 0)
      return this.changeTopTextTo('道具数量不足!')

    //提示正确答案
    switch (questions[currentQ].ans) {
      case 1:
        this.changeTopTextTo('正确答案【A】')
        this.setData({
          reason: questions[currentQ].reason
        })
        break
      case 2:
        this.changeTopTextTo('正确答案【B】')
        this.setData({
          reason: questions[currentQ].reason
        })
        break
      case 3:
        this.changeTopTextTo('正确答案【C】')
        this.setData({
          reason: questions[currentQ].reason
        })
        break
      case 4:
        this.changeTopTextTo('正确答案【D】')
        this.setData({
          reason: questions[currentQ].reason
        })
        break
    }
    //道具数量减1并绑定数据渲染出来
    this.gameData.toolc--
    this.setData({
      toolc: this.gameData.toolc
    })
  },
  disableHandle: function () {
    //防止事件冒泡
  },
  tapToolBarFoldedHanddle: function () { //点击道具图标，道具栏展开
    //如果人物还在移动，挂掉函数
    if (this.data.disabletools == true) return
    setTimeout(function () {
      this.setData({
        showUnfoldToolBar: true
      })
    }.bind(this), 150)

  },
  tapToolBarUnFoldedMaskHandle: function () { //点击展开的道具栏以外的地方，道具栏折叠
    setTimeout(function () {
      this.setData({
        showUnfoldToolBar: false
      })
    }.bind(this), 200)

  },
  hiddeKepuHandle: function () { //点击后科普隐藏
    this.setData({
      showKepu: false,
    })
  },
  showShopHandle: function () { //点击展开商店
    setTimeout(function () {
      this.setData({
        showShop: true,
      })
    }.bind(this), 150)
  },
  hideShopHandle: async function () { //点击关闭商店
    //更新游戏数据到数据库
    await wx.cloud.callFunction({
      // 云函数名称
      name: 'saveGameData',
      // 传给云函数的参数
      data: {
        gameData: this.gameData
      },
    })
    await this.delay(150)
    this.setData({
      showShop: false,
    })

  },
  buyTool: function (type) {
    if (type == 1) {
      //扣除积分,道具数量增加并渲染
      this.gameData.tool1++,
        this.gameData.score -= 5
      this.setData({
        tool1: this.gameData.tool1,
        score: this.gameData.score
      })
    }
    if (type == 2) {
      //扣除积分,道具数量增加并渲染
      this.gameData.tool2++,
        this.gameData.score -= 5
      this.setData({
        tool2: this.gameData.tool2,
        score: this.gameData.score
      })
    }
    if (type == 3) {
      //扣除积分,道具数量增加并渲染
      this.gameData.tool3++,
        this.gameData.score -= 5
      this.setData({
        tool3: this.gameData.tool3,
        score: this.gameData.score
      })
    }
    if (type == 'a') {
      //扣除积分,道具数量增加并渲染
      this.gameData.toola++,
        this.gameData.score--
      this.setData({
        toola: this.gameData.toola,
        score: this.gameData.score
      })
    }
    if (type == 'b') {
      //扣除积分,道具数量增加并渲染
      this.gameData.toolb++,
        this.gameData.score -= 5
      this.setData({
        toolb: this.gameData.toolb,
        score: this.gameData.score
      })
    }
    if (type == 'c') {
      //扣除积分,道具数量增加并渲染
      this.gameData.toolc++,
        this.gameData.score -= 5
      this.setData({
        toolc: this.gameData.toolc,
        score: this.gameData.score
      })
    }

  },
  buyTool1Handle: function () { //点击后科普隐藏
    this.buyTool(1)
  },
  buyTool2Handle: function () { //点击后科普隐藏
    this.buyTool(2)
  },
  buyTool3Handle: function () { //点击后科普隐藏
    this.buyTool(3)
  },
  buyToolaHandle: function () { //点击后科普隐藏
    this.buyTool('a')
  },
  buyToolbHandle: function () { //点击后科普隐藏
    this.buyTool('b')
  },
  buyToolcHandle: function () { //点击后科普隐藏
    this.buyTool('c')
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
    clearInterval(time) //清除定时器
    //离开页面则保存数据
    wx.cloud.callFunction({
      // 云函数名称
      name: 'saveGameData',
      // 传给云函数的参数
      data: {
        gameData: this.gameData
      },
    })
  },

  delay: async function (time) {
    setTimeout(() => {

    }, time)
    return 1
  },

  rankHandle: async function () {
    await wx.cloud.callFunction({
      name: 'saveGameData',
      data: {
        gameData: this.gameData
      },
    })
    await this.delay(200) //延时200毫秒
    await this.getOpenid()
    await this.ifHasUesrInfo()
    if (this.hasUesrInfo) {
      wx.navigateTo({
        url: '../../pages/rank/rank?hasUesInfo=1',
      })
    } else {
      wx.navigateTo({
        url: '../../pages/rank/rank?hasUesInfo=0',
      })
    }

  },

  ifHasUesrInfo: async function () {
    if (!this.hasUesrInfo) { //如果未查询过,查询是否已有用户信息
      let res = await db.collection('UserInformation').where({
        _openid: app.globalData.openid
      }).count()
      if (res.total) {
        this.hasUesrInfo = true
        console.log("查询用户信息完成，this.hasUesrInfo：", this.hasUesrInfo)
      }
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(time) //清除定时器
    //离开页面则保存数据
    wx.cloud.callFunction({
      // 云函数名称
      name: 'saveGameData',
      // 传给云函数的参数
      data: {
        gameData: this.gameData
      },
    })
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
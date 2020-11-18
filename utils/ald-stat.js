(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global.Ald = factory());
}(this, function () {
  var config = require("./ald-stat-conf");
  if (typeof wx.Queue === "undefined") {
    wx.Queue = new Queue();
    wx.Queue.all();
  }
  if (config.app_key === "") {
    console.error("请在ald-stat-conf.js文件中填写小程序统计/广告监测平台创建小程序后生成的app_key，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南！");
  }
  if (config.useOpen) {
    console.warn("提示：开启了useOpen配置后，如果不上传用户OpendID则不会上报数据，上传方式：http://doc.aldwx.com 小程序统计/广告监测平台-快速接入指南-上传OpenID！");
  }
  var v = "7.4.0";
  var url = "log";
  var TYPE = "wx";
  var APPID = getAppid();
  //框架
  var isMpvue = false;
  //session
  var aldstat_access_token = createSession(); //appshow -apphide  会话的session
  var aldstat_launch_session = ""; //applaunch  生成的session 可以计算启动次数
  //时间记录
  var aldstat_appShow_time = Date.now();
  var aldstat_appHide_time = 0;
  //app 变量
  var aldstat_session_key = ""; //user session_key
  var aldstat_openid = getOpenid(); //user openid
  var aldstat_user_img = ""; //user img src
  var request_cont = 0; //requrest count
  var aldstat_showoption = ""; //场景值信息
  var aldstat_is_first_open = ""; //是否首次进入
  var aldstat_uuid = get_uuid(); //uuid
  var aldstat_share_src = ""; //share arguments query ald_share_src
  var aldstat_qr = ""; //二维码参数
  var aldstat_sr = ""; //share  arguments query ald_share_src
  var aldstat_error_count = 0; //error count
  var aldstat_group_info = ""; //share group info
  var aldstat_user_info = ""; //user info
  var sendData = {};
  var aldstat_is_first_page = false;
  var page_use_is_30s_session = false;
  //page 变量
  var page_current = ""; //current page
  var page_up_page = ""; //up page
  var page_options = ""; //page onload arguments
  var aldstat_first_page = "";
  var is_fiist_show = true; // is fist appShow
  var is_share_open_show = false;
  var aldstat_old_scene = "";
  var _catch = new cache();

  var limit = true  // 限制获取头像上报次数

  //阿拉丁事件
  var game_freeze_fn = ['aldVisit', 'aldPayOrder'];

  //page time
  var page_onShow_time = 0;
  var page_dr = 0;

  //addListener wx api
  var addListener_wx_api_list = [{ name: "scanCode" }, { name: "chooseAddress" }, { name: "chooseImage" }, { name: "previewImage" }, { name: "chooseInvoiceTitle" }, { name: "chooseInvoice" }];
  var is_wx_api_open_show = false;
  addListenerWX();
  function addListenerWX() {
    addListener_wx_api_list.forEach(function (item) {
      item.fn = wx[item.name];
      var itemName = item.name;
      try {
        Object.defineProperty(wx, itemName, {
          get: function () {
            is_wx_api_open_show = true;
            return item.fn;
          }
        });
      } catch (error) {
      }
    });
  }

  // setOpenid方法
  var set_openid_fn = "";


  //init json
  init_app_json();

  // 请求队列
  function Queue() {
    this.concurrency = 4;
    this.queue = [];
    this.tasks = [];
    this.activeCount = 0;
    var _this = this;
    this.push = function (fn) {
      this.tasks.push(new Promise(function (resolve, reject) {
        var task = function () {
          _this.activeCount++;
          fn().then(function (data) {
            resolve(data);
          }).then(function () {
            _this.next();
          });
        };
        if (_this.activeCount < _this.concurrency) {
          task();
        } else {
          _this.queue.push(task);
        }
      }));
    };
    this.all = function () {
      return Promise.all(this.tasks);
    };
    this.next = function () {
      _this.activeCount--;
      if (_this.queue.length > 0) {
        _this.queue.shift()();
      }
    };
  }
  wx.aldstat = new AldStat("");



  //request请求缓存列表
  function cache() {
    this.request = [];
    this.updata = false;
    this.push = function (arg) {

      if (this.request.length >= 8 && !this.updata) {
        this.updata = true;
        _setOpenid();
      }
      if (this.request.length >= 10) {
        let Overrun = this.request.shift();
        Overrun().then(function (data) {
          console.log('超出缓存请求数，上报成功！')
        }).catch(err => {
          console.log(err)
        })
        this.request.push(arg);
      } else {
        this.request.push(arg);
      }
    };
    this.concat = function () {
      this.request.map(function (x) {
        wx.Queue.push(x);
      });
      this.request = [];
    };
  }
  //get System Info
  try {
    var res = wx.getSystemInfoSync();
    sendData.br = res.brand;
    sendData.pm = res.model;
    sendData.pr = res.pixelRatio;
    sendData.ww = res.windowWidth;
    sendData.wh = res.windowHeight;
    sendData.lang = res.language;
    sendData.wv = res.version;
    sendData.wvv = res.platform;
    sendData.wsdk = res.SDKVersion;
    sendData.sv = res.system;
  } catch (e) {
    // this.AldStat.error("get equipment info error ");
  }
  //获取网络状态
  wx.getNetworkType({
    success: function (res) {
      sendData.nt = res.networkType;
    }
  });
  // 获取用户appid
  function getAppid() {
    if (typeof wx.getAccountInfoSync == "undefined") {
      return "";
    }
    return wx.getAccountInfoSync().miniProgram.appId.split("").map(function (x) {
      return x.charCodeAt(0) + 9;
    }).join("-");
  }
  // 获取openid方法
  function getOpenid() {
    var openid = "";
    try {
      openid = wx.getStorageSync("aldstat_op");
    } catch (e) { }
    return openid;
  }
  // setOpend 调用用户传过来的方法
  function _setOpenid() {
    if (typeof set_openid_fn === "function" && aldstat_openid === "") {
      set_openid_fn().then(function (res) {
        if (res.length === 28) {
          aldstat_openid = res;
          wx.setStorageSync("aldstat_op", res);
        }
      });
    }
  }
  // 获取精度纬度 地理位置
  wx.getSetting({
    success: function (res) {
      if (res.authSetting["scope.userLocation"]) { //能获取到用户信息
        wx.getLocation({
          type: "wgs84",
          success: function (res) {
            sendData.lat = res.latitude;
            sendData.lng = res.longitude;
            sendData.spd = res.speed;
          }
        });
      } else {
        if (config.getLocation) {
          wx.getLocation({
            type: "wgs84",
            success: function (res) {
              sendData.lat = res.latitude;
              sendData.lng = res.longitude;
              sendData.spd = res.speed;
            }
          });
        }
      }
    }
  });
  //自定义事件
  function AldStat(app) {
    this.app = app;
  }
  //自定义事件上报 event:String 上报事件名称 ,content上报参数 Object
  AldStat.prototype["sendEvent"] = function (event, args) {
    if (event !== "" && typeof event === "string" && event.length <= 255) {
      if (typeof args === "string" && args.length <= 255) {
        custom_log("event", event, args);
      } else if (typeof args === "object") {
        if (JSON.stringify(args).length >= 255) {
          console.error("自定义事件参数不能超过255个字符，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-自定义事件！");
          return;
        } else if (eventNested(args)) {
          console.error("事件参数内部只支持Number、String等类型，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-自定义事件！");
          return;
        }
        custom_log("event", event, JSON.stringify(args));
      } else if (typeof args === "undefined") {
        custom_log("event", event, false);
      } else {
        console.error("事件参数必须为String、Object类型，且参数长度不能超过255个字符，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-自定义事件！");
      }
    } else {
      console.error("事件名称必须为String类型且不能超过255个字符，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-自定义事件！");
    }
  };
  //send session,解密用户信息和群信息
  AldStat.prototype["sendSession"] = function (session) {
    //基本判断
    if (session === "" || !session) {
      console.error("请传入从后台获取的session_key");
      return;
    }
    aldstat_session_key = session;
    var data = listData();
    data.tp = "session";
    data.ct = "session";
    data.ev = "event";
    // 查看是否授权，获取用户信息
    if (aldstat_user_info === "") {
      wx.getSetting({
        success: function (res) {
          if (res.authSetting["scope.userInfo"]) { //能获取到用户信息
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function (res) {
                data.ufo = ListUserInfo(res);
                aldstat_user_img = maxLength(res.userInfo.avatarUrl.split("/"));
                if (aldstat_group_info !== "") {
                  data.gid = aldstat_group_info;
                }
                wx_request(data);
              }
            });
          } else { //不能获取到用户信息
            if (aldstat_group_info !== "") {
              data.gid = aldstat_group_info;
              wx_request(data);
            }
          }
        }
      });
    } else { //当前已经获取到了用户信息
      data.ufo = aldstat_user_info;
      if (aldstat_group_info !== "") { //获取群分享信息
        data.gid = aldstat_group_info;
      }
      wx_request(data);
    }
  };
  AldStat.prototype["sendOpenid"] = function (openid) {
    if (openid === "" || !openid || openid.length !== 28) {
      console.error("OpenID不符合规则，请参考接入文档 http://doc.aldwx.com 小程序统计/广告监测平台-快速接入指南！");
      return;
    }
    aldstat_openid = openid; //http中header中
    //缓存openid
    wx.setStorageSync("aldstat_op", openid);
    var data = listData();
    data.tp = "openid";
    data.ev = "event";
    data.ct = "openid";
    wx_request(data);
  };
  AldStat.prototype.setOpenid = function (methods) {
    if (typeof methods === "function") {
      set_openid_fn = methods;
      _setOpenid();
    }
  };
  //类型检查@return boolean number string function array date regexp object error symbol
  function _type(obj) {
    var class_type = {};

    function toString(o) {
      return Object.prototype.toString.call(o)
    }

    "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function (name, i) {
      class_type["[object " + name + "]"] = name.toLowerCase();
    });
    return (function type() {
      if (obj == null) {
        return obj
      }
      return typeof obj === "object" || typeof obj === "function" ?
        class_type[toString.call(obj)] || "object" :
        typeof obj;
    })()
  }
  var aldEvent = {
    // 智慧零售访问上报
    aldVisit: function (options) {
      // 校验基础必传字段是否符合规则
      function Check(c, i, n) {
        if (_type(c) !== "string" || c.length > 32) {
          console.error("category字段(商品类别)只支持String类型，且长度小于32个字符，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！");
          return false
        }
        if (_type(i) !== "number" && _type(i) !== "string") {
          console.error("id字段(商品唯一id)只支持Number类型和String类型，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！");
          return false
        }
        if (_type(n) !== "string" || n.length > 32) {
          console.error("name字段(商品名称)只支持String类型，且长度小于32个字符，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！");
          return false
        }
        return true
      }

      // 判断options值
      if (Object.prototype.toString.call(options) === "[object Object]") {
        // 对optios里参数做校验
        var { category, id, name } = options
        if (category && (id === 0 ? true : id) && name) {
          if (!Check(category, id, name)) return
          var obj = {
            category: options.category,
            id: options.id,
            name: options.name
          }
          custom_log("visit", null, obj);
        } else {
          console.error("category、id、name为必传字段且数据类型必须符合规则,请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！");
          return;
        }
      } else {
        console.error("wx.aldVisit()传参不符合规则，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！");
        return;
      }
    },
    // 智慧零售订单上报
    aldPayOrder: function (options) {
      // 校验基础必传字段是否符合规则
      function Check(p, d) {
        if (p == true && p != 1) {
          console.error("price字段(付费金额)只支持Number类型和数字字符串，且不能小于0，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！");
          return false
        }
        p = Number(p)
        if (_type(p) !== "number" || p < 0 || isNaN(p)) {
          console.error("price字段(付费金额)只支持Number类型和数字字符串，且不能小于0，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！");
          return false
        }
        if (Object.prototype.toString.call(d) !== "[object Array]" || d.length < 1) {
          console.error("details字段(订单详细信息)为Array类型，且长度不能小于1，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！");
          return false
        }
        return true
      }

      function _test(item) {
        var { amount, category, id, name } = item
        if (amount == 0) {
          console.error("details参数下amount字段值(商品数量)只支持Number类型和数字字符串，且不能小于或等于0，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！");
          return false
        }
        if (amount && category && (id === 0 ? true : id) && name) {
          if (amount == true && amount != 1) {
            console.error("details参数下amount字段值(商品数量)只支持Number类型和数字字符串，且不能小于或等于0，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！");
            return false
          }
          amount = Number(amount)
          if (_type(amount) !== "number" || amount <= 0 || isNaN(amount)) {
            console.error("details参数下amount字段值(商品数量)只支持Number类型和数字字符串，且不能小于或等于0，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！");
            return false
          }
          if (_type(id) !== "number" && _type(id) !== "string") {
            console.error("id字段(商品唯一id)只支持Number类型和String类型，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！");
            return false
          }
          if (_type(category) !== "string" || category.length > 32) {
            console.error("details参数下category字段值(商品类别)只支持String类型，且长度小于32个字符，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！");
            return false
          }
          if (_type(name) !== "string" || name.length > 32) {
            console.error("details参数下name字段值(商品类别)只支持String类型，且长度小于32个字符，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！");
            return false
          }
        } else {
          console.error("amount、category、id、name为必传字段且数据类型必须符合规则,请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！");
          return false
        }
        return true
      }

      // 判断options值
      if (Object.prototype.toString.call(options) === "[object Object]") {
        // 对optios里参数做校验
        var { price, details } = options
        if ((price === 0 ? true : price) && details) {
          if (!Check(price, details)) return
          for(var i = 0;i<details.length;i++) {
            if (!_test(details[i])) return
          }
          var obj = {
            price: options.price,
            details: options.details
          }
          custom_log("pay", null, obj);
        } else {
          console.error("price、details为必传字段且数据类型必须符合规则,请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！");
          return;
        }
      } else {
        console.error("wx.aldPayOrder()传参不符合规则，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！");
        return;
      }
    }
  }
  //不可修改
  function freeze(name, value) {
    Object.defineProperty(wx, name, {
      value: value,
      writable: false,
      enumerable: true,
      configurable: true
    })
  }
  for (var i = 0; i < game_freeze_fn.length; i++) {
    freeze(game_freeze_fn[i], aldEvent[game_freeze_fn[i]])
  }


  //app
  function appOnlaunch(options) {
    aldstat_launch_session = createSession();
    aldstat_showoption = options; //场景值信息复制
    aldstat_old_scene = options.scene;
    this.aldstat = new AldStat(this); //实例化
    // session_log("app", "launch");
  }

  function appOnShow(options) {
    _setOpenid();
    var is_same_scent;
    if (options.scene == aldstat_old_scene) {
      is_same_scent = false;
    } else {
      is_same_scent = true;
    }
    aldstat_old_scene = options.scene;
    request_cont = 0;
    aldstat_showoption = options;
    aldstat_share_src = options.query.ald_share_src;
    aldstat_qr = options.query.aldsrc || "";
    aldstat_sr = options.query.ald_share_src;

    if (!is_fiist_show && !is_share_open_show && !is_wx_api_open_show) { //是否是一次执行app_onShow ,用来处理新用户的
      aldstat_is_first_open = false;
    }
    is_fiist_show = false;

    //1.hide是否超超过30s
    //2.是否是分享打开
    if (aldstat_appHide_time !== 0 && (Date.now() - aldstat_appHide_time) > 30000 || is_same_scent) {//如果当前执行过appHide，当前onHide 超过30S，则重新生成session
      if (!is_share_open_show) {//当前不是分享打开的话
        aldstat_access_token = createSession();
        aldstat_appShow_time = Date.now();
        page_dr = 0;
      }
    }

    if (aldstat_appHide_time !== 0 && (Date.now() - aldstat_appHide_time) < 30000) {
      page_use_is_30s_session = true;
    }
    //分享信息上报
    if (options.query.ald_share_src && options.scene == "1044" && options.shareTicket) {
      // get group info
      wx.getShareInfo({
        shareTicket: options.shareTicket,
        success: function (res) {
          aldstat_group_info = res;
          custom_log("event", "ald_share_click", JSON.stringify(res));
        }
      });
      //其他类型分享
    } else if (options.query.ald_share_src) {
      custom_log("event", "ald_share_click", 1);
    }
    //获取用户信息
    if (aldstat_user_info === "") {
      wx.getSetting({
        withCredentials: true,
        success: function (res) {
          if (res.authSetting["scope.userInfo"]) {
            var data = sendData;
            if (limit) {
              limit = false
              wx.getUserInfo({
                withCredentials: true,
                success: function (res) {
                  var data = listData();
                  aldstat_user_info = res;
                  data.ufo = ListUserInfo(res);
                  aldstat_user_img = maxLength(res.userInfo.avatarUrl.split("/"));
                  wx_request(data);
                }
              });
            }

          }
        }
      });
    }
    session_log("app", "show");

    if (aldstat_openid === '') {
      let ai = wx.getAccountInfoSync().miniProgram.appId;
      wx.login({
        success(res) {
          // console.log('sdk-login-jscode', res)
          // 参数 jscode && uu 请求openid
          wx.request({
            url: 'https://log.aldwx.com/authorize/mini_program_openid',
            data: {
              ai: ai,
              uuid: aldstat_uuid,
              jc: res.code,
              reqid: '1'
            },
            success(res) {
              if (!res.data.code) {
                aldstat_openid = res.data.data.openid;
                wx.setStorageSync("aldstat_op", res.data.data.openid);
              }
            }
          })
        },
        fail(err) {
          console.log('sdk-login-err', err)
        }
      })
    }

  }

  function appOnHide() {
    _setOpenid();
    aldstat_appHide_time = Date.now();
    if (aldstat_user_info === "") { //当前有用户信息，不用在获取和上报用户信息
      wx.getSetting({
        success: function (res) {
          if (res.authSetting["scope.userInfo"]) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            if (limit) {
              limit = false
              wx.getUserInfo({
                withCredentials: true,
                success: function (res) {
                  aldstat_user_info = res;
                  aldstat_user_img = maxLength(res.userInfo.avatarUrl.split("/"));
                  var data = listData();
                  data.ufo = ListUserInfo(res);
                  wx_request(data);
                }
              });
            }
          } else {
            return;
          }
        }
      });
    }
    session_log("app", "hide");
  }

  function appOnError(msg) {
    aldstat_error_count++;
    custom_log("event", "ald_error_message", msg);
  }

  //page
  function pageOnLoad(options) {
    page_options = options;
  }

  function pageOnShow() {
    page_onShow_time = Date.now();
    if (isMpvue) {
      page_current = this.$mp.page.route;
    } else {
      page_current = this.route;
    }
    if (aldstat_user_info === "") { //当前有用户信息，不用在获取和上报用户信息
      wx.getSetting({
        success: function (res) {
          if (res.authSetting["scope.userInfo"]) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            if (limit) {
              limit = false
              wx.getUserInfo({
                withCredentials: true,
                success: function (res) {
                  aldstat_user_info = res;
                  aldstat_user_img = maxLength(res.userInfo.avatarUrl.split("/"));
                  var data = listData();
                  data.ufo = ListUserInfo(res);
                  wx_request(data);
                }
              });
            }
          } else {
            return;
          }
        }
      });
    }
    page_log("page", "show");
    page_use_is_30s_session = false;

  }

  function pageOnHide() {
    page_up_page = page_current;
    page_dr = Date.now() - page_onShow_time;

  }

  function pageOnUnload() {
    page_up_page = page_current;
    page_dr = Date.now() - page_onShow_time;
  }

  function pageOnPullDownRefresh() {
    custom_log("event", "ald_pulldownrefresh", 1);
  }

  function pageOnReachBottom() {
    custom_log("event", "ald_reachbottom", 1);
  }

  function pageOnShareAppMessage(shareOptions) {
    is_share_open_show = true;
    //分享时，用户填写的path的参数 {id=123} || "
    var pathQuery = filterString(shareOptions.path);
    //场景值的参数
    var optionsQuery = {};
    for (var key in aldstat_showoption.query) {
      if (key === "ald_share_src" || key === 'ald_share_op') {
        optionsQuery[key] = aldstat_showoption.query[key];
      }
    }
    //不带参数的路径
    var path = "";
    shareOptions.path.indexOf("?") == -1 ? path = shareOptions.path + "?" : path = shareOptions.path.substr(0, shareOptions.path.indexOf("?")) + "?";
    //将参数合并在一起
    if (pathQuery !== "") { //说明，用户分享的时候带有自己的参数
      for (var key in pathQuery) {
        optionsQuery[key] = pathQuery[key];
      }
    }
    if (optionsQuery.ald_share_src) { //分享过
      if (optionsQuery.ald_share_src.indexOf(aldstat_uuid) == -1) { //找到自己的UUID
        if (optionsQuery.ald_share_src.length < 200) {
          optionsQuery.ald_share_src = optionsQuery.ald_share_src + "," + aldstat_uuid;
        }
      }
    } else { //第一次分享
      optionsQuery.ald_share_src = aldstat_uuid;
    }
    if (config.useOpen) {  // 开启useOpen，分享携带openid
      if (optionsQuery.ald_share_op) { //分享过
        if (optionsQuery.ald_share_op.indexOf(aldstat_openid) == -1) { //找不到自己的openid
          if (optionsQuery.ald_share_op.length < 200) {
            optionsQuery.ald_share_op = optionsQuery.ald_share_op + "," + aldstat_openid;
          }
        }
      } else { //第一次分享
        optionsQuery.ald_share_op = aldstat_openid;
      }
    }
    //出来完成参数，拼接
    for (var i in optionsQuery) { //只会拼接用户的参数，剔除ald自带的参数，否则外链进入的时候分享会有问题
      if (i.indexOf("ald") == -1) {
        path += i + "=" + optionsQuery[i] + "&";
      }
    }
    shareOptions.path = path + (config.useOpen ? ('ald_share_op=' + optionsQuery.ald_share_op) + '&' : '') + "ald_share_src=" + optionsQuery.ald_share_src;
    custom_log("event", "ald_share_status", shareOptions);
    return shareOptions;
  }
  //Api
  //create uuid
  function createUUID() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
  }
  // get uuid
  function get_uuid() {
    var uuid = "";
    try {
      uuid = wx.getStorageSync("aldstat_uuid");
    } catch (err) {
      uuid = "uuid_getstoragesync";
    }
    //不存在，生成UUID，并且用户是首次进入
    if (!uuid) {
      uuid = createUUID();
      try {
        wx.setStorageSync("aldstat_uuid", uuid);
        aldstat_is_first_open = true;
      } catch (err) {
        wx.setStorageSync("aldstat_uuid", "uuid_getstoragesync");
      }
    } else {
      aldstat_is_first_open = false;
    }
    return uuid;
  }

  // request
  function wx_request(data) {
    request_cont++;
    data.at = aldstat_access_token;
    data.uu = aldstat_uuid;
    data.v = v; //版本号
    data.ak = config.app_key.replace(/(\t)|(\s)/g, "");
    data.wsr = aldstat_showoption;
    data.ifo = aldstat_is_first_open;
    data.rq_c = request_cont;
    data.ls = aldstat_launch_session;
    data.te = TYPE;
    data.et = Date.now(); //上报时间
    data.st = Date.now();
    function request() {
      return new Promise(function (resolve, reject) {
        var header = {
          AldStat: "MiniApp-Stat",
          se: aldstat_session_key || "", //用户传入的session
          op: aldstat_openid || "", //用户传入的openID
          img: aldstat_user_img, //用户img src加密的一坨字符串
        };
        APPID === "" ? "" : header.ai = APPID;
        wx.request({
          url: "https://" + url + ".aldwx.com/" + "d.html",
          data: data,
          header: header,
          method: "GET",
          success: function (res) {
            if (res.statusCode == 200) {
              resolve("");
            } else {
              resolve("status error");
            }
          },
          fail: function () {
            resolve("fail");
          }
        });
      });
    }
    if (config.useOpen) {
      if (aldstat_openid === "") {
        _catch.push(request);
      } else {
        wx.Queue.push(request);
        _catch.concat();
      }
    } else {
      wx.Queue.push(request);
    }

    // console.log(_catch.request);
  }

  function listData() {
    var data = {};
    for (var key in sendData) {
      data[key] = sendData[key];
    }
    return data;
  }

  function maxLength(val) {
    var stringMax = "";
    for (var i = 0; i < val.length; i++) {
      if (val[i].length > stringMax.length) {
        stringMax = val[i];
      }
    }
    return stringMax;
  }

  //生成session方法
  function createSession() {
    return "" + Date.now() + Math.floor(Math.random() * 10000000);
  }

  //剔除不需要的数据，userInfo,groupInfo中的
  function ListUserInfo(ufo) {
    var userInfo = {};
    for (var key in ufo) {
      if (key != "rawData" && key != "errMsg") {
        userInfo[key] = ufo[key];
      }
    }
    return userInfo;
  }

  //出来字符串拼接的参数，格式化成对象
  function filterString(url) {
    if (url.indexOf("?") == -1) return "";
    var result = {};
    var query = url.split("?")[1];
    var queryArr = query.split("&");
    queryArr.forEach(function (item) {
      var value = item.split("=")[1];
      var key = item.split("=")[0];
      result[key] = value;
    });
    return result;
  }
  //自定义事件 检查参数是否是嵌套json
  function eventNested(eventArg) {

    for (var key in eventArg) {
      if (typeof eventArg[key] === "object" && eventArg[key] !== null) {
        return true;
      }
    }
    return false;
  }



  // 上报封装
  function session_log(ev, life) {
    var data = listData();
    data.ev = ev;
    data.life = life;
    data.ec = aldstat_error_count;

    data.dr = Date.now() - aldstat_appShow_time;
    if (life == 'show') {
      data.uo = config.useOpen;
    }
    if (aldstat_qr) {
      data.qr = aldstat_qr;
      data.sr = aldstat_qr;
    }
    if (aldstat_share_src) {
      data.usr = aldstat_share_src;
    }
    wx_request(data);
  }

  function page_log(ev, life) {
    var data = listData();
    data.ev = ev;
    data.life = life;
    data.pp = page_current;
    data.pc = page_up_page;

    data.dr = Date.now() - aldstat_appShow_time; //兼容老版本算法
    if (is_share_open_show || is_wx_api_open_show) {
      data.so = 1;
    }
    is_wx_api_open_show = false;
    is_share_open_show = false;
    if (page_options && JSON.stringify(page_options) != "{}") {
      data.ag = page_options;
    }
    if (aldstat_qr) {
      data.qr = aldstat_qr;
      data.sr = aldstat_qr;
    }
    if (aldstat_share_src) {
      data.usr = aldstat_share_src;
    }
    if (page_use_is_30s_session) {
      data.ps = 1;
    }
    if (!aldstat_is_first_page) {
      aldstat_first_page = page_current;
      aldstat_is_first_page = true;
      data.ifp = aldstat_is_first_page;
      data.fp = page_current;
      data.pdr = 0;
    } else {
      data.pdr = page_dr;
    }
    wx_request(data);
  }

  function custom_log(ev, type, content) {
    var data = listData();
    data.ev = ev;
    data.tp = type;
    data.dr = Date.now() - aldstat_appShow_time;
    if (content) data.ct = content;
    wx_request(data);
  }
  //init
  function init_app_json() {
    wx.request({
      "url": "https://" + url + ".aldwx.com/config/app.json",
      "header": {
        "AldStat": "MiniApp-Stat",
      },
      "method": "GET",
      "success": function (res) {
        if (res.statusCode === 200) {
          if (v < res.data.version) {
            console.warn("您的SDK不是最新版本，部分功能不可用，请尽快前往 http://tj.aldwx.com/downSDK 升级");
          }
          if (res.data.warn) {
            console.warn(res.data.warn);
          }
          if (res.data.error) {
            console.error(res.data.error);
          }
        }
      }
    });
  }
  /**-- 老版本---**/
  function hookIt(obj, method, hookFunc) {
    if (obj[method]) {
      var oldMethod = obj[method];
      obj[method] = function (arg) {
        hookFunc.call(this, arg, method);
        oldMethod.call(this, arg);
      };
    } else {
      obj[method] = function (arg) {
        hookFunc.call(this, arg, method);
      };
    }
  }
  var oldApp = function (arg) {
    (function () {
      var _oldApp = App;
      var _oldPage = Page;
      var _oldComponent = Component;
      App = function (arg) {
        hookIt(arg, "onLaunch", appOnlaunch);
        hookIt(arg, "onShow", appOnShow);
        hookIt(arg, "onHide", appOnHide);
        hookIt(arg, "onError", appOnError);
        _oldApp(arg);
      };
      Page = function (arg) {
        var c = arg.onShareAppMessage;
        hookIt(arg, "onLoad", pageOnLoad);
        hookIt(arg, "onUnload", pageOnUnload);
        hookIt(arg, "onShow", pageOnShow);
        hookIt(arg, "onHide", pageOnHide);
        hookIt(arg, "onReachBottom", pageOnReachBottom);
        hookIt(arg, "onPullDownRefresh", pageOnPullDownRefresh);
        if (typeof c !== "undefined" && c !== null) {
          arg.onShareAppMessage = function (val) {
            if (typeof c !== "undefined") {
              var share = c.call(this, val);
              if (typeof share === "undefined") {
                share = {};
                share.path = page_current;
              } else if (typeof share.path === "undefined") {
                share.path = page_current;
              }
              return pageOnShareAppMessage(share);
            }
          };
        }
        _oldPage(arg);
      };

      Component = function (arg) {
        try {
          var c = arg.methods.onShareAppMessage;
          hookIt(arg.methods, "onLoad", pageOnLoad);
          hookIt(arg.methods, "onUnload", pageOnUnload);
          hookIt(arg.methods, "onShow", pageOnShow);
          hookIt(arg.methods, "onHide", pageOnHide);
          hookIt(arg.methods, "onReachBottom", pageOnReachBottom);
          hookIt(arg.methods, "onPullDownRefresh", pageOnPullDownRefresh);
          if (typeof c !== "undefined" && c !== null) {
            arg.methods.onShareAppMessage = function (val) {
              if (typeof c !== "undefined") {
                var share = c.call(this, val);
                if (typeof share === "undefined") {
                  share = {};
                  share.path = page_current;
                } else if (typeof share.path === "undefined") {
                  share.path = page_current;
                }
                return pageOnShareAppMessage(share);
              }
            };
          }
          _oldComponent(arg);
        } catch (err) {
          _oldComponent(arg);
        }
      };
    })();
  };

  /**插件版本的钩子**/
  // App钩子
  function CycleApp(arg) {
    var appListFn = {};
    for (var key in arg) {
      if (key !== "onLaunch" && key !== "onShow" && key !== "onHide" && key !== "onError") {
        appListFn[key] = arg[key];
      }
    }
    appListFn.onLaunch = function (options) {
      appOnlaunch.call(this, options);
      if (typeof arg.onLaunch === "function") {
        arg.onLaunch.call(this, options);
      }
    };
    // App onShow 周期
    appListFn.onShow = function (options) {
      appOnShow.call(this, options);
      if (arg.onShow && typeof arg.onShow === "function") {
        arg.onShow.call(this, options);
      }
    };
    appListFn.onHide = function () {
      appOnHide.call(this);
      if (arg.onHide && typeof arg.onHide === "function") {
        arg.onHide.call(this);
      }
    };
    appListFn.onError = function (msg) {
      appOnError.call(this, msg);
      if (arg.onError && typeof arg.onError === "function") {
        arg.onError.call(this, msg);
      }
    };
    return appListFn;
  }
  // Page钩子
  function CyclePage(arg) {
    var pageListFn = {};
    for (var key in arg) {
      if (key !== "onLoad" && key !== "onShow" && key !== "onHide" && key !== "onUnload" && key !== "onPullDownRefresh" && key !== "onReachBottom" && key !== "onShareAppMessage") {
        pageListFn[key] = arg[key];
      }
    }
    pageListFn.onLoad = function (options) {
      pageOnLoad.call(this, options);
      if (typeof arg.onLoad === "function") {
        arg.onLoad.call(this, options);
      }
    };
    pageListFn.onShow = function (t) {
      pageOnShow.call(this);
      if (typeof arg.onShow === "function") {
        arg.onShow.call(this, t);
      }
    };
    pageListFn.onHide = function (t) {
      pageOnHide.call(this);
      if (typeof arg.onHide === "function") {
        arg.onHide.call(this, t);
      }
    };
    pageListFn.onUnload = function (t) {
      pageOnUnload.call(this);
      if (typeof arg.onUnload === "function") {
        arg.onUnload.call(this, t);
      }
    };

    pageListFn.onReachBottom = function (t) {
      pageOnReachBottom();
      if (arg.onReachBottom && typeof arg.onReachBottom === "function") {
        arg.onReachBottom.call(this, t);
      }
    };
    pageListFn.onPullDownRefresh = function (t) {
      pageOnPullDownRefresh();
      if (arg.onPullDownRefresh && typeof arg.onPullDownRefresh === "function") {
        arg.onPullDownRefresh.call(this, t);
      }
    };
    if (arg.onShareAppMessage && typeof arg.onShareAppMessage === "function") {
      pageListFn.onShareAppMessage = function (res) {
        var share_msg = arg.onShareAppMessage.call(this, res);
        if (typeof share_msg == "undefined") {
          share_msg = {};
          share_msg.path = this.route;
        } else {
          if (typeof share_msg.path == "undefined") {
            share_msg.path = this.route;
          }
        }
        return pageOnShareAppMessage.call(this, share_msg);
      };
    }
    return pageListFn;
  }

  function aldApp(arg) {
    return App(CycleApp(arg));
  }

  function aldPage(arg) {
    return Page(CyclePage(arg));
  }

  function MpvueApp(arg) {
    isMpvue = true;
    return CycleApp(arg);
  }

  function MpvuePage(arg) {
    return CyclePage(arg);
  }
  if (config.plugin) {
    return {
      App: aldApp,
      Page: aldPage,
      MpvueApp: MpvueApp,
      MpvuePage: MpvuePage
    };
  } else {
    return oldApp();
  }
}));
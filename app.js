//app.js
var Bmob=require("utils/bmob.js");
var common=require("utils/common.js");
Bmob.initialize("61a5aee1446ceb5812043a2a6039f72d", "11e715c3e862579c446c208765b9420f");
var uid;
App({
      onLaunch: function () {
            var that = this;
                //  获取商城名称
      }
})
App({
  
  onLaunch: function () {
    var that = this;
    //  获取商城名称
    //调用API从本地缓存中获取数据
    try {
      var value = wx.getStorageSync('user_openid')
      if (value) {
      }else{
       console.log("执行login")
       wx.login({
         success: function (res) {
           if (res.code) {
             console.log("执行login", res)
           }
         }});
       wx.login({
            success: function(res) {
              console.log('res', res)
              if (res.code) {
                  Bmob.User.requestOpenId(res.code, {
                    success: function(userData) { 
                        wx.getUserInfo({
                            success: function(result) {
                              var userInfo = result.userInfo
                              var nickName = userInfo.nickName
                              var avatarUrl = userInfo.avatarUrl
                              Bmob.User.logIn(nickName, userData.openid, {
                                success: function(user) {
                                  try {
                                      wx.setStorageSync('user_openid', user.get("userData").openid)
                                      wx.setStorageSync('user_id', user.id);
                                      wx.setStorageSync('my_nick', user.get("nickname"))
                                      wx.setStorageSync('my_username', user.get("username"))
                                      wx.setStorageSync('my_avatar', user.get("userPic"))
                                  } catch (e) {    
                                  }
                                  console.log("登录成功");
                                },
                                error: function(user, error) {
                                  if(error.code=="101"){
                                      var user = new Bmob.User();//开始注册用户
                                        user.set("username", nickName);
                                        user.set("password", userData.openid);//因为密码必须提供，但是微信直接登录小程序是没有密码的，所以用openId作为唯一密码    
                                        user.set("nickname", nickName);
                                        user.set("userPic", avatarUrl);
                                        user.set("userData", userData);
                                        user.signUp(null, {
                                            success: function(results) {
                                              console.log("注册成功!");
                                              try {//将返回的3rd_session储存到缓存
                                                wx.setStorageSync('user_openid', results.get("userData").openid)
                                                wx.setStorageSync('user_id', results.id);
                                                wx.setStorageSync('my_username', results.get("username"));
                                                wx.setStorageSync('my_nick', results.get("nickname"));
                                                wx.setStorageSync('my_avatar', results.get("userPic"))
                                                
                                              } catch (e) {    
                                              }
                                            },
                                            error: function(userData, error) {
                                              console.log(error)
                                            }
                                        });
                                  }
                                }
                              });

                              
                            }
                        })                       
                    },
                    error: function(error) {
                        // Show the error message somewhere
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });

              } else {
                console.log('获取用户登录态失败！' + res.errMsg)
              }
            },
            complete:function(e){
              console.log('获取用户登录态失败！' + e)
            }
          });
      }
    } catch (e) {
      console.log("登陆失败")
    }
    wx.checkSession({
      success: function(){
      },
      fail: function(){
        //登录态过期
        wx.login()
      }
    }),

    wx.request({
      url: 'https://api.it120.cc/' + that.globalData.subDomain + '/config/get-value',
      data: {
        key: 'mallName'
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.setStorageSync('mallName', res.data.data.value);
        }
      }
    })
    this.login();
  },

  login: function () {
    var that = this;
    var token = that.globalData.token;
    if (token) {
      wx.request({
        url: 'https://api.it120.cc/' + that.globalData.subDomain + '/user/check-token',
        data: {
          token: token
        },
        success: function (res) {
          if (res.data.code != 0) {
            that.globalData.token = null;
            that.login();
          }
        }
      })
      return;
    }
    wx.login({
      success: function (res) {
        wx.request({
          url: 'https://api.it120.cc/' + that.globalData.subDomain + '/user/wxapp/login',
          data: {
            code: res.code
          },
          success: function (res) {
            if (res.data.code == 10000) {
              // 去注册
              that.registerUser();
              return;
            }
            if (res.data.code != 0) {
              // 登录错误
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '无法登录，请重试',
                showCancel: false
              })
              return;
            }
            //console.log(res.data.data)
            that.globalData.token = res.data.data.token;
            that.globalData.uid = res.data.data.uid;
            uid=res.data.data.uid;
          }
        })
      }
    })
  },
  
  onShow:function(){
    
  },
  globalData:{
    userInfo: null,
    subDomain: "1f7160da6df1d04c9993ffe3a8d32ebd",
    shareProfile: '欢迎查看',
    uid:uid
  },
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh()
  },
  sendTempleMsg: function (orderId, trigger, template_id, form_id, page, postJsonString) {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + that.globalData.subDomain + '/template-msg/put',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: that.globalData.token,
        type: 0,
        module: 'order',
        business_id: orderId,
        trigger: trigger,
        template_id: template_id,
        form_id: form_id,
        url: page,
        postJsonString: postJsonString
      },
      success: (res) => {
        //console.log('*********************');
        //console.log(res.data);
        //console.log('*********************');
      }
    })
  },
  registerUser: function () {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        wx.getUserInfo({
          success: function (res) {
            var iv = res.iv;
            var encryptedData = res.encryptedData;
            // 下面开始调用注册接口
            wx.request({
              url: 'https://api.it120.cc/' + that.globalData.subDomain + '/user/wxapp/register/complex',
              data: { code: code, encryptedData: encryptedData, iv: iv }, // 设置请求的 参数
              success: (res) => {
                wx.hideLoading();
                that.login();
              }
            })
          }
        })
      }
    })
  },
  onError: function(msg) {
    
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口  
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  }
})
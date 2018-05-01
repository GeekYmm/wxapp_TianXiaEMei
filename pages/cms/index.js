//获取应用实例
var app = getApp()
var that;
var optionId;
var common = require('../template/getCode.js')
var Bmob = require("../../utils/bmob.js");
var WxParse = require('../../wxParse/wxParse.js');
var commentlist;
var cmsid;
var isComment;
var comNum;
Page({
  data: {
    limit: 5,
    showImage: false,
    loading: false,
    isdisabled: false,
    commentLoading: false,
    isdisabled1: false,
    recommentLoading: false,
    commentList: [],
    agree: 0,
    userInfo: {},
  },

  onLoad: function (options) {
    that = this;
    optionId = options.moodId;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    }),

      wx.request({
        url: 'https://api.it120.cc/' + app.globalData.subDomain + '/cms/news/detail',
        data: {
          id: options.id
        },
        success: function (res) {
          cmsid = options.id;
          if (res.data.code == 0) {
            that.setData({
              notice: res.data.data
            });
            WxParse.wxParse('article', 'html', res.data.data.content, that, 5);
          }
          if (res.data.data.tags == "n_comment"){//判断是否可评论
            that.setData({
              isComment:false
            });
          } else if (res.data.data.tags == "comment"){
            that.setData({
              isComment:true
            });
          }
          
        }
      }),
      console.log('文章id:', options.id);
    wx.request({

      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/comment/list',
      data: {
        refId: options.id,
        type: 3
      },

      success: function (res) {
        that.setData({
          commentList: res.data.data,
        });
        console.log(comNum);
      }
    })
    
  },
  onReady: function () {
    wx.hideToast()

  },
  onReady: function () {
    wx.hideToast()

  },
  onShow: function () {
    
  },

  changeFocus: function () {
    that.setData({
      autoFo: true
    })
  },
  hiddenResponse: function () {
    this.setData({
      isToResponse: false
    })
  },

  publishComment1: function (e) {
    var str_comment = e.detail.value.commContent;
    console.log('评论文章id', cmsid);
    if (str_comment == "") {
      common.dataLoading("评论内容不能为空", "loading");
    }
    else {
      that = this;

      wx.request({
        url: 'https://api.it120.cc/' + app.globalData.subDomain + '/comment/add',
        data: {
          refId: cmsid,
          type: 3,
          uid: app.globalData.uid,
          content: str_comment,
        },
        success: function (res) {
          console.log(app.globalData.uid);
          wx.request({
            url: 'https://api.it120.cc/' + app.globalData.subDomain + '/comment/list',
            data: {
              refId: cmsid,
              type:3,
            },
            success: function (res) {
              that.setData({
                publishContent: '',
                commentList: res.data.data
              });
              wx.showToast({
                title: '评价成功！',
              });

            }
          })
        }
      })
    }
  },

  bindKeyInput: function (e) {

  },
  onHide: function () {
    // Do something when hide.
  },
  onUnload: function (event) {

  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  onShareAppMessage: function () {
  }
})
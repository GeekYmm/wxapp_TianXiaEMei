//index.js
//获取应用实例
var common = require('../../utils/common.js')
var app = getApp()
var Bmob = require("../../utils/bmob.js");
var that;
var dogs_type;
Page({
  showDogsType: function (event) {
     console.log('点击了', event.currentTarget.dataset.tag);
    dogs_type = event.currentTarget.dataset.tag;
    this.onPullDownRefresh();

   
  },
  data: {
    moodList: [],
    limit: 0,
    page: 10,//当前请求的页数
    currentPage: 0,//当前请求的页数
    isload: false,
    isEmpty: true,
    pageSize: 5,//每次加载多少条
    // limit: 2,//跟上面要一致
    loading: false,
    windowHeight1: 0,
    windowWidth1: 0,
    count: 0,
    scrollTop: {
      scroll_top1: 0,
      goTop_show: false
    }
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    console.log('输入了', e.detail.value);

    this.setData({
      inputVal: e.detail.value
    });
    getReturn(this, e.detail.value);
  },
  onLoad: function (t) {

    if (!t) {
      that = this;
      getReturn(that);
    }
  },
  onSetData: function (data) {
    console.log(data.length);
    let page = this.data.currentPage = this.data.currentPage + 1;

    //设置数据
    data = data || [];

    this.setData({
      moodList: page === 1 || page === undefined ? data : this.data.moodList.concat(data),
      isEmpty: data.length === 0 ? false : true,
      isload: true
    });
    console.log(this.data.moodList, page);

  },
  onShow: function (e) {
    var molist = new Array();
    // var myInterval = setInterval(getReturn, 500);

    if (e) {
      that.setData({
        currentPage: 0,
        page: 3,
      })

    }

    this.onLoad();
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight1: res.windowHeight,
          windowWidth1: res.windowWidth
        })
      }
    })
  },

  onShareAppMessage: function () {
    return {
      title: '',
      desc: '',
      path: '/pages/index1/index1'
    }
  },
  // onReachBottom: function (e) {
  //   var limit = that.data.limit
  //   console.log("上拉加载更多...." + that.data.limit)
  //   that.setData({
  //     limit: limit + that.data.pageSize,

  //   });
  //   this.onShow()
  // },
  onReachBottom: function () {
    this.onShow();
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    var limit = that.data.limit
    console.log("下拉刷新....." + that.data.limit)
    that.setData({
      limit: that.data.pageSize,

    })
    that.onShow(1)
  },
  scrollTopFun: function (e) {
    if (e.detail.scrollTop > 300) {
      this.setData({
        'scrollTop.goTop_show': true
      });
    } else {
      this.setData({
        'scrollTop.goTop_show': false
      });
    }
  },

})


function getReturn(that, value) {
  


  that.setData({
    loading: false
  });
   var molist = new Array();
        // clearInterval(myInterval)
        var Diary = Bmob.Object.extend("Diary");
        var query = new Bmob.Query(Diary);



        query.limit(that.data.page);
        query.skip(that.data.page * that.data.currentPage);


        //条件查询
        query.equalTo("is_hide", "1");

        if (value) {
          query.equalTo("title", { "$regex": "" + value + ".*" });
        }

        query.descending("createdAt");
        query.include("publisher");
        if (dogs_type!=-1){
          query.equalTo("dogs_type", dogs_type);
        }
        // 查询所有数据
       
        query.find({
          success: function (results) {
            for (var i = 0; i < results.length; i++) {
              var publisherId = results[i].get("publisher").id;
              var title = results[i].get("title");
              var content = results[i].get("content");
              var id = results[i].id;
              var createdAt = results[i].createdAt;
              var _url0;
              var _url1;
              var _url2;
              var _url3;
              var _url4;
              var _url5;
              var _url6;
              var _url7;
              var _url8;
              var likeNum = results[i].get("likeNum");
              var commentNum = results[i].get("commentNum");
              var x=0;
             var pic = results[i].get("pic0");
              if (pic) {
                _url0 = results[i].get("pic0")._url;
                x=1;
              }
              else {
                _url0 = null;
              }
              var pic1 = results[i].get("pic1");
              if (pic1) {
                _url1 = results[i].get("pic1")._url;
                x = 2;
              }
              else {
                _url1 = null;
              }
              var pic2 = results[i].get("pic2");
              if (pic2) {
                _url2 = results[i].get("pic2")._url;
                x = 3;
              }
              else {
                _url2 = null;
              }
              var pic3 = results[i].get("pic3");
              if (pic3) {
                _url3 = results[i].get("pic3")._url;
                x = 4;
              }
              else {
                _url3 = null;
              } var pic4 = results[i].get("pic4");
              if (pic4) {
                _url4 = results[i].get("pic4")._url;
                x = 5;
              }
              else {
                _url4 = null;
              }
              var pic5 = results[i].get("pic5");
              if (pic5) {
                _url5 = results[i].get("pic5")._url;
                x = 6;
              }
              else {
                _url5 = null;
              }
              var pic6 = results[i].get("pic6");
              if (pic6) {
                _url6 = results[i].get("pic6")._url;
                x =7;
              }
              else {
                _url6 = null;
              }
              var pic7 = results[i].get("pic7");
              if (pic7) {
                _url7 = results[i].get("pic7")._url;
                x = 8;
              }
              else {
                _url7 = null;
              }
              var pic8 = results[i].get("pic8");
              if (pic8) {
                _url8 = results[i].get("pic8")._url;
                x=9;
              }
              else {
                _url8 = null;
              }
             console.log(x);

              var name = results[i].get("publisher").get("nickname");
              var userPic = results[i].get("publisher").get("userPic");
              var liker = results[i].get("liker");
              var isLike = 0;
              // for (var j = 0; j < liker.length; j++) {
              //   if (liker[j] == ress.data) {
              //     isLike = 1;
              //     break;
              //   }
              // 
                var jsonA = {
                  "title": title || '',
                  "content": content || '',
                  "id": id || '',
                  "avatar": userPic || '',
                  "created_at": createdAt || '',
                  "attachment": _url0 || '',
                  "attachment1": _url1 || '',
                  "attachment2": _url2 || '',
                  "attachment3": _url3 || '',
                  "attachment4": _url4 || '',
                  "attachment5": _url5 || '',
                  "attachment6": _url6 || '',
                  "attachment7": _url7 || '',
                  "attachment8": _url8 || '',
                  "likes": likeNum,
                  "comments": commentNum,
                  "is_liked": isLike || '',
                  "username": name || '',
                  "x":x
              }
                
              molist.push(jsonA)
              // that.setData({
              //   moodList: molist,
              //   // loading: true
              // })
            }
           
            that.onSetData(molist, that.data.currentPage);
          },
          error: function (error) {
            common.dataLoading(error, "loading");
            // that.setData({
            //   loading: true
            // })
            console.log(error)
          }
          
        });
        

}

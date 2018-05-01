//获取应用实例
var app = getApp()
var Bmob=require("../../utils/bmob.js");
var common = require('../template/getCode.js')
var that;
var imageList = [];
var imgArr=[];
var dogs_type=-1;
Page({
  data: {
    array: ['拉布拉多犬', '斗牛犬', '卡斯罗', '柯基', '柴犬', '其它'],
    objectArray: [
      {
        id: 0,
        name: '拉布拉多犬'
      },
      {
        id: 1,
        name: '斗牛犬'
      },
      {
        id: 2,
        name: '卡斯罗'
      },
      {
        id: 3,
        name: '柯基'
      },
      {
        id: 4,
        name: '柴犬'
      },
      {
        id: 5,
        name: '其它'
      }
    ],

  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    dogs_type = e.detail.value;
    this.setData({
      index: e.detail.value
    })
  },
  onLoad: function(options) {
      that=this;
      that.setData({//初始化数据
        src:"",
        isSrc: false,
        src1: "",
        isSrc1: false,
        src2: "",
        isSrc2: false,
        src3: "",
        isSrc3: false,
        src4: "",
        isSrc4: false,
        src5: "",
        isSrc5: false,
        src6: "",
        isSrc6: false,
        src7: "",
        isSrc7: false,
        src8: "",
        isSrc8: false,
        ishide:"1",
        autoFocus:true,
        isLoading:false,
        loading:true,
        isdisabled:false
      })
  },
  onReady:function(){
     wx.hideToast() 
  },
  onShow:function(){
    var myInterval=setInterval(getReturn,500);
    function getReturn(){
      wx.getStorage({
        key: 'user_openid',
        success: function(ress) {
          if(ress.data){
            clearInterval(myInterval)
              that.setData({
                loading:true
            })
          }
        } 
      })
    }
  },

  upImg: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        imgArr = res.tempFilePaths;
        console.log(imgArr);
          that.setData({
            imageList: res.tempFilePaths
          })
      }
    })
  },

  clearPic: function () {//删除图片
    that.setData({
      imageList: ""
    })
    common.dataLoading("请重新选择图片", "loading")
  },

  sendNewMood: function (e) {//保存心情
    //判断心情是否为空

    var content = e.detail.value.content;
    var title = e.detail.value.title;
    console.log("“qqqqqqq" + dogs_type)

    console.log(content)
    if (title == "") {
      common.dataLoading("请填写您的标题", "loading");
      return;
    }
    if (content == "") {
      common.dataLoading("请填写您的文章内容", "loading");
      return;
    }
    if (dogs_type == -1) {
      common.dataLoading("请选择您的狗狗类型", "loading");
      return;
    }
    else {
      that.setData({
        isLoading: true,
        isdisabled: true
      })
      wx.getStorage({
        key: 'user_id',
        success: function (ress) {
          var Diary = Bmob.Object.extend("Diary");
          var diary = new Diary();
          var me = new Bmob.User();
          me.id = ress.data;
          diary.set("title", title);
          diary.set("content", content);
          diary.set("dogs_type",dogs_type);
          diary.set("is_hide", that.data.ishide);
          diary.set("publisher", me);
          diary.set("likeNum", 0);
          diary.set("commentNum", 0);
          diary.set("liker", []);
          var urlArr = new Array();
          console.log(imgArr);
          var imgLength =imgArr.length;
          if (imgLength > 0) {
            var newDate = new Date();
            var newDateStr = newDate.toLocaleDateString();
            var j = 0;
            //如果想顺序变更，可以for (var i = imgLength; i > 0; i--)
            for (var i = 0; i < imgLength; i++) {
              var tempFilePath = [imgArr[i]];
              var extension = /\.([^.]*)$/.exec(tempFilePath[0]);
              if (extension) {
                extension = extension[1].toLowerCase();
              }
              var name = newDateStr + "." + extension;//上传的图片的别名

              var file = new Bmob.File(name, tempFilePath);
              file.save().then(function (res) {
                wx.hideNavigationBarLoading()
                var url = res.url();
                console.log("第" +i+ "张" + url);

                urlArr.push({ "url": url });
                j++;
                console.log(j, imgLength);
                if (imgLength == j) {
                console.log(imgLength, urlArr);
                //如果担心网络延时问题，可以去掉这几行注释，就是全部上传完成后显示。
                }
              }, function (error) {
                console.log(error)
              });
              switch (i) {
                case 0:
                  diary.set("pic0", file);
                  break;
                case 1:
                  diary.set("pic1", file);
                  break;
                case 2:
                  diary.set("pic2", file);
                  break;
                case 3:
                  diary.set("pic3", file);
                  break;
                case 4:
                  diary.set("pic4", file);
                  break;
                case 5:
                  diary.set("pic5", file);
                  break;
                case 6:
                  diary.set("pic6", file);
                  break;
                case 7:
                  diary.set("pic7", file);
                  break;
                default:
                  diary.set("pic8", file);
              }
            }
          }
          diary.save(null, {
            success: function (result) {
              that.setData({
                isLoading: false,
                isdisabled: false
              })
              // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
              common.dataLoading("发布成功", "success", function () {
                wx.navigateBack({
                  delta: 1
                })
              });
            },
            error: function (result, error) {
              // 添加失败
              console.log(error)
              common.dataLoading("发布失败", "loading");
              that.setData({
                isLoading: false,
                isdisabled: false
              })
            }
          });
        }
      })
    }

  },
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh()
  }
})

# wxapp_TianXiaEMei
## **使用方法**

下载代码在微信开发者工具里打开。

--------

## **后台配置**

在[比目后端云](https://www.bmob.cn/)注册账号，添加对应的数据表。

 #### 第一步：创建项目，记得填入你自己的AppId(必须填入AppId，不然无法调用wx.login())。 

 #### 第二步：下载该代码。 

 #### 第三步：在微信小程序管理后台中配置服务器域名为https://api.bmob.cn。 

 #### 第四步：在Bmob后台创建应用，将你的AppID(小程序ID)和AppSecret(小程序密钥)填写到Bmob的微信小程序配置密钥中。 

 #### 第五步：将你的Application ID和REST API Key替换app.js中的Bmob.initialize("e3cecf75da3d8316729ee905e81f5ac1", "adf78f7709798f97d6bb9aef6a7624ad")。 
 #### 第六步：创建表和字段： 
    (1)在_User表中新建字段userPic(String),nickname(String) 

    (2)新建Diary表，新建字段title(String),publisher(Pointer)<关联_User表>,pic(File),likeNum(Number),is_hide(String),content(String),commentNum(Number),liker(Array) 

    (3)新建Comments表，新建字段publisher(Pointer)<关联_User表>,olderUserName(String),olderComment(Pointer)<关联Comments表>,mood(Pointer)<关联Diary表>,content(String) 
    
    (4)、v0.2.0 增加评论表 avatar，behavior（int），fid 文章发布者，is_read(int)，uid(Pointer)用户表 评论用户id，username，wid //文章id

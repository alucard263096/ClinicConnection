import { ApiConfig } from "../apis/apiconfig.js";
import { ApiUtil } from "../apis/apiutil.js";
import { MemberApi } from "../apis/member.api.js";
import { WechatApi } from "../apis/wechat.api";

export class AppBase{
  static MemberInfo=null;
  static QQMAP = null;
  static DOCTORID=0;
  app=null;
  options=null;
  data = {
    uploadpath: ApiConfig.GetUploadPath(),
    rtmppath: ApiConfig.GetRTMPAPI(),
    pushpath: ApiConfig.GetPUSHAPI(),
    copyright: { name:"E联星空",website:"hss.com"}};
  Page=null;
  util=ApiUtil;
  constructor(){
    this.app=getApp();
    this.me=this;
  }
  generateBodyJson(){
    var base=this;
    return {
      Base:base,
      /**
       * 页面的初始数据
       */
      data: base.data,
      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: base.onLoad,

      /**
       * 生命周期函数--监听页面初次渲染完成
       */
      onReady: base.onReady,

      /**
       * 生命周期函数--监听页面显示
       */
      onShow: base.onShow,

      /**
       * 生命周期函数--监听页面隐藏
       */
      onHide: base.onHide,

      /**
       * 生命周期函数--监听页面卸载
       */
      onUnload: base.onUnload,

      /**
       * 页面相关事件处理函数--监听用户下拉动作
       */
      onPullDownRefresh: base.onPullDownRefresh,

      /**
       * 页面上拉触底事件的处理函数
       */
      onReachBottom: base.onReachBottom,

      /**
       * 用户点击右上角分享
       */
      onShareAppMessage: base.onShareAppMessage,

      gotoDoctor: base.gotoDoctor,
      viewPhoto: base.viewPhoto,
      phoneCall: base.phoneCall,
      openMap: base.openMap,
      backPage: base.backPage,
      backHome:base.backHome
    }
  }
  log(){
    console.log("yeah!");
  }
  onLoad(options){
    this.Base.options=options;
    console.log(options);
    console.log("onload");
    this.Base.setBasicInfo();
  }
  setBasicInfo(){
    var that=this;
    var options = this.options;
    options.unicode = "mamidx";
    if (ApiConfig.UNICODE==""&&options.unicode == undefined) {
      //ApiConfig.SetUnicode("vista");
      //ApiConfig.SetToken("oo7cm0Rf0NNG4zqieBcS4LxJv_9E");
      if(this.PageName!="content"){
        wx.reLaunch({
          url: '../content/content?keycode=close',
        });
      }
      return;
    } else {
      if (options.unicode != undefined){
        ApiConfig.SetUnicode(options.unicode);
      }
    }
    if (this.isLogined()){
      return;
    }
    wx.login({

      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var wechatapi = new WechatApi();
        wechatapi.decryption2({ code: res.code, grant_type: "authorization_code" }, function (data) {
          console.log(data);
          data = JSON.parse(data);
          console.log(data);
          console.log("openid");
          ApiConfig.SetToken(data.openid);
          var memberApi=new MemberApi();
          memberApi.info({},function(data){
            if(data!=false){
              AppBase.MemberInfo=data;
              //that.onShow();
            }else{
              console.log("no logined");
            }
          },false);
        }, false);
      }
    })
  }
  onReady() {
    console.log("onReady");
  }
  onShow() {
  }
  onHide(){
    console.log("onHide");
  }
  onUnload() {
    console.log("onUnload");
  } 
  onPullDownRefresh() {
    console.log("onPullDownRefresh");
  }
  onReachBottom() {
    console.log("onReachBottom");
  }
  onShareAppMessage() {
    console.log("onShareAppMessage");
    return {
      path: '/pages/home/home?unicode='+ApiConfig.UNICODE,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  
  }
  setMyData(obj){
    console.log(obj);
    this.Page.setData(obj);
  }
  getMyData() {
    return this.Page.data;
  }
  gotoDoctor(e){
    var id=e.currentTarget.id;
    wx.redirectTo({
      url: '../doctor/doctor?id='+id,
    })
  }
  viewPhoto(e){
    var img=e.currentTarget.id;
    wx.previewImage({
      urls: [img],
    })
  }
  viewGallary(modul,photos){
    var nphotos=[];
    for(var i=0;i<photos.length;i++){
      nphotos.push(ApiConfig.GetUploadPath()+modul+"/"+photos[i]);
    }
    console.log(nphotos);
    wx.previewImage({
      urls: nphotos,
    })
  }
  phoneCall(e) {
    var tel = e.currentTarget.id;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  }
  openMap(e) {
    if(AppBase.QQMAP==null){
      var QQMapWX = require('../libs/qqmap/qqmap-wx-jssdk.js');
      AppBase.QQMAP = new QQMapWX({
        key: 'IDVBZ-TSAKD-TXG43-H442I-74KVK-6LFF5'
      });
    }
    var address = e.currentTarget.id;
    AppBase.QQMAP.geocoder({
      address: address,
      success: function (res) {
        if(res.status==0){
          var lat = res.result.location.lat;
          var lng = res.result.location.lng;

          wx.openLocation({
            type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
            address: address,
            latitude: lat,
            longitude: lng,
            success: function (res) {

            }
          })
        }
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  }
  uploadImage(modul,callback){
    wx.chooseImage({
      count:8,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths);
        //that.setData({
        //  photos: that.data.photos.concat(res.tempFilePaths)
        //});
        var tempFilePaths = res.tempFilePaths;
        for (var i = 0; i < tempFilePaths.length;i++){
          
        wx.uploadFile({
          url: ApiConfig.GetFileUploadAPI(), //仅为示例，非真实的接口地址
          filePath: tempFilePaths[i],
          name: 'file',
          formData: {
            'module': modul,
            "field": "file"
          },
          success: function (res) {
            console.log(res);
            var data = res.data
            if (data.substr(0, 7) == "success") {
              data = data.split("|");
              var photo = data[2];
              callback(photo);
            } else {
              wx.showToast({
                title: '上传失败，请重试',
                icon: 'warn',
                duration: 2000
              })
            }
            //do something
          }
          });
        }
      }
    })
  }
  info(message){
    wx.showModal({
      title: '提示',
      content: message,
      showCancel: false
    })
  }
  warning(message) {
    wx.showModal({
      title: '警告',
      content: message,
      showCancel: false
    })
  }
  error(message) {
    wx.showModal({
      title: '错误',
      content: message,
      showCancel:false
    })
  }
  isLogined(){
     return AppBase.MemberInfo!=null;
  }
  askLogin(){
    wx.navigateTo({
      url: '/pages/signup/signup',
    })
  }
  backPage(){
    wx.navigateBack({
      
    });
  }
  backHome(){
    wx.switchTab({
      url: '/pages/home/home',
    })
  }
} 
import { ApiConfig } from "../apis/apiconfig.js";
import { ApiUtil } from "../apis/apiutil.js";

export class AppBase{

  static QQMAP = null;
  app=null;
  options=null;
  data = { uploadpath: ApiConfig.GetUploadPath(),
    copyright:{name:"医诊互联",website:"hss.com"}};
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
      openMap: base.openMap
    }
  }
  log(){
    console.log("yeah!");
  }
  onLoad(options){
    this.options=options;
    console.log(options);
    console.log("onload");
  }
  onReady() {
    console.log("onReady");
  }
  onShow() {
    console.log("onShow");
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
  }
  setMyData(obj){
    console.log(this.Page);
    this.Page.setData(obj);
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
} 
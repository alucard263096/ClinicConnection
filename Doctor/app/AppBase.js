import { ApiConfig } from "../apis/apiconfig.js";
import { ApiUtil } from "../apis/apiutil.js";
import { DoctorApi } from "../apis/doctor.api";

export class AppBase {
  app = null;
  options = null;
  windowWidth=320;
  data = {
    
    uploadpath: ApiConfig.GetUploadPath(),
    apipath: ApiConfig.GetApiUrl(),
    rtmppath: ApiConfig.GetRTMPAPI(),
    pushpath: ApiConfig.GetPUSHAPI(),
    copyright: { name: "医诊互联", website: "hss.com" }
  };
  Page = null;
  util = ApiUtil;
  constructor() {
    this.app = getApp();
    this.me = this;
    //ApiConfig.SetToken("10e991a4ca7a93c60794628c11edaea3");
  }
  generateBodyJson() {
    var base = this;
    return {
      Base: base,
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
      backHome: base.backHome,
      logout: base.logout
    }
  }
  log() {
    console.log("yeah!");
  }
  onLoad(options){

    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      this.windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }



    if(options.issignin!=1){

      var identity=wx.getStorageSync("identity");
      console.log("identity");
      console.log(identity);
      identity = identity.split("_");
      var now = (new Date()).getTime();
      if (identity.length == 2) {
        var timeticker = Number(identity[0]);
        var token = identity[1];
        if ((now - timeticker) < 6 * 3600 * 1000)//小于六小时
        {
          wx.setStorage({
            key: 'identity',
            data: now.toString() + '_' + token,
          });
          ApiConfig.SetToken(token);
        }else{
          wx.navigateTo({
            url: '/pages/signin/signin',
          });
          return;
        }
      }else{

        wx.navigateTo({
          url: '/pages/signin/signin',
        })
        return;
      }
    }


    this.Base.options=options;
    console.log(options);
    console.log("onload");
    this.Base.setBasicInfo();
    if (options.issignin!=1){

      var doctorApi = new DoctorApi();
      doctorApi.detail({}, function (data) {
        if (data == false) {
          wx.navigateTo({
            url: '/pages/signin/signin',
          })
          return;
        }
      });
    }
  }
  setBasicInfo() {
    var that = this;


  }
  onReady() {
    console.log("onReady");
  }
  onShow() {
  }
  onHide() {
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
  setMyData(obj) {
    console.log(obj);
    this.Page.setData(obj);
  }
  getMyData() {
    return this.Page.data;
  }
  viewPhoto(e) {
    var img = e.currentTarget.id;
    console.log(img);
    wx.previewImage({
      urls: [img],
    })
  }
  viewGallary(modul, photos) {
    var nphotos = [];
    for (var i = 0; i < photos.length; i++) {
      nphotos.push(ApiConfig.GetUploadPath() + modul + "/" + photos[i]);
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
    if (AppBase.QQMAP == null) {
      var QQMapWX = require('../libs/qqmap/qqmap-wx-jssdk.js');
      AppBase.QQMAP = new QQMapWX({
        key: 'IDVBZ-TSAKD-TXG43-H442I-74KVK-6LFF5'
      });
    }
    var address = e.currentTarget.id;
    AppBase.QQMAP.geocoder({
      address: address,
      success: function (res) {
        if (res.status == 0) {
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
  uploadFile(modul, filename, callback) {

    var tempFilePaths = filename
    wx.uploadFile({
      url: ApiConfig.GetFileUploadAPI(), //仅为示例，非真实的接口地址
      filePath: tempFilePaths,
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
  uploadImage(modul, callback) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths);
        //that.setData({
        //  photos: that.data.photos.concat(res.tempFilePaths)
        //});
        var tempFilePaths = res.tempFilePaths;
        for (var i = 0; i < tempFilePaths.length; i++) {

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
  info(message) {
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
      showCancel: false
    })
  }

  backPage() {
    wx.navigateBack({

    });
  }
  backHome() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  }
  logout() {
    wx.clearStorage();
    wx.redirectTo({
      url: '/pages/signin/signin',
    })
  }
} 
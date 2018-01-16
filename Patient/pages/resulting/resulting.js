// pages/resulting/resulting.js
import { AppBase } from "../../app/AppBase";
import { DoctorApi } from "../../apis/doctor.api.js";
import { MeetingApi } from "../../apis/meeting.api.js";
import { MeetingMgr } from "../../app/MeetingMgr";

class Resulting extends AppBase {
  meetingMgr = null;
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);

    var meetingMgr = new MeetingMgr();
    this.Base.meetingMgr = meetingMgr;
  }
  onShow() {
    var that = this;
    var meetingApi=new MeetingApi();
    meetingApi.detail({id:this.Base.options.id},function(data){
      that.Base.setMyData({ info: data });
      console.log(data.status);
      if (data.status == 'P' || data.status == 'W') {
        that.Base.meetingMgr.createMeeting(data.id, that, that.Base.receiveData);
      }else{
        var meetingApi = new MeetingApi();
        meetingApi.chating({ meeting_id: that.Base.options.id }, function (data) {
          var nowchatdata = that.Base.getMyData().chats;

          if (data.length > 0
            && (nowchatdata == undefined || data.length > nowchatdata.length)) {
            var id = data[data.length - 1].id;
            that.Base.setMyData({ chats: data, latestid: "latest_" + id });
          } else {
            that.Base.setMyData({ chats: data });
          }
        }, false);
      }
    });
  }
  onUnload(){
    this.Base.meetingMgr.clearAllMeeting();
  }
  viewPhotos(){
    var data=this.Base.getMyData();
    var photos=data.info.photos;
    var nphotos = [];
    for (var i = 0; i < photos.length; i++) {
      nphotos.push(photos[i].photo);
    }
    this.Base.viewGallary("order", nphotos);
  }
  startMeeting() {
    var that = this;
    var meetingApi = new MeetingApi();
    meetingApi.start({ meeting_id: this.Base.options.id }, function (data) {
      var info=that.Base.getMyData().info;
      info.status='P';
      that.Base.setMyData({info:info});
      that.Base.meetingMgr.createMeeting(data.id,that, that.Base.receiveData);
    });
  }
  receiveData(id,that,data){
    var nowchatdata=that.Base.getMyData().chats;
    if(data.length>0){
      var info=that.Base.getMyData().info;
      info.status='P';
      that.Base.setMyData({info:info});
    }
    if (data.length > 0 
      && (nowchatdata == undefined || data.length > nowchatdata.length )){
      var id = data[data.length - 1].id;
      that.Base.setMyData({ chats: data, latestid: "latest_" + id });
    }else{
      that.Base.setMyData({ chats: data});
    }
    
  }
  inputMessage(e){
    var message=e.detail.value;
    this.Base.setMyData({message:message});
  }
  sendMessage(){
    var meetingApi = new MeetingApi();
    var data=this.Base.getMyData();
    var message=data.message;
    meetingApi.send({ meeting_id: this.Base.options.id, "type": "T", side: "P", message: message }, function (data) {
     
    });
    this.Base.setMyData({message:""});
  }
  sendPicture() {
    var that=this;
    this.Base.uploadImage("meetinglog",function(data){
      var meetingApi = new MeetingApi();
      meetingApi.send({ meeting_id: that.Base.options.id, "type": "P", side: "P", message: data }, function (data) {

      });
    });
  }
  sendVoice() {
    console.log(this.data.info.status);
    if (this.data.info.mtype == "W") {
      this.Base.warning("你的预约服务为图文会诊，不允许发送语音");
      return;
    }
    var that=this;
    wx.getSetting({
      success(res) {
        if (!res['scope.record']) {
          // 设置询问
          wx.authorize({
            scope: 'scope.record',
            success(res) {
              that.Base.startRecord();
            },
            fail() { },
            complete() { }
          })
        } else {
          that.Base.startRecord();
        }
      }
    })
  }
  confirmsend = false;
  startRecord(){
    this.confirmsend=false;
    var that=this;
    wx.startRecord({
      success: function (res) {
        console.log("record success");
        var tempFilePath = res.tempFilePath;
        if(that.confirmsend){
          that.uploadFile("meetinglog", tempFilePath, function (data) {
            var meetingApi = new MeetingApi();
            meetingApi.send({ meeting_id: that.options.id, "type": "V", side: "P", message: data }, function (data) {

              console.log("upload success");
            });
          });
          console.log("sedn success");
        }else{

          console.log("sedn fail");
        }
      },
      fail: function (res) {
        //录音失败
      }
    });
    wx.showModal({
      title: '录音中，请控制在一分钟内',
      confirmText:"发出",
      success:function(res){
        if (res.confirm) {
          that.confirmsend=true;
          console.log('用户点击确定')
        } else if (res.cancel) {
          that.Base.confirmsend = false;
          console.log('用户点击取消')
        }
        wx.stopRecord();
      }
    })
  }
  playRecord(e){
    var url=e.currentTarget.dataset.src;
    console.log(url);
    wx.downloadFile({
      url: url,
      success: function (res) {
        console.log(res.tempFilePath)
        wx.playVoice({
          filePath: res.tempFilePath,
          complete: function (res) {
            console.log('playVoice res')
            console.log(res)
          }
        })
      }
    })
  }
  sendVideo() {
    if (this.data.info.mtype == "W") {
      this.Base.warning("你的预约服务为图文会诊，不允许发起视频会诊");
      return;
    }
    if (this.data.info.mtype == "V") {
      this.Base.warning("你的预约服务为语音会诊，不允许发起视频会诊");
      return;
    }
    var that=this;
    var meetingApi = new MeetingApi();
    meetingApi.send({ meeting_id: that.Base.options.id, "type": "S", side: "D", message: "meetingid_" + that.Base.options.id + "_" + (new Date().getTime().toString()) }, function (data) {

    });
  }
  gotoLiveMeeting(e){
    var id=e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/livemeeting/livemeeting?id='+id,
    })
  }
  completeMeeting(){
    wx.navigateTo({
      url: '/pages/report/report?id='+this.Base.options.id,
    })
  }
}
var resulting = new Resulting();
var body = resulting.generateBodyJson();
body.onLoad = resulting.onLoad;
body.onShow = resulting.onShow;
body.onUnload = resulting.onUnload; 
body.viewPhotos = resulting.viewPhotos; 
body.startMeeting = resulting.startMeeting; 
body.sendMessage = resulting.sendMessage; 
body.inputMessage = resulting.inputMessage;
body.sendPicture = resulting.sendPicture;
body.sendVoice = resulting.sendVoice;
body.sendVideo = resulting.sendVideo; 
body.longtaptest = resulting.longtaptest;
body.playRecord = resulting.playRecord; 
body.gotoLiveMeeting = resulting.gotoLiveMeeting;
body.completeMeeting = resulting.completeMeeting;

Page(body)
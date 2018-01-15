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
    options.id=1;
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
      if (data.status == 'P') {
        that.Base.meetingMgr.createMeeting(data.id, that, that.Base.receiveData)
      }
    });
  }
  viewPhoto(){
    var data=this.Base.getMyData();
    var photos=data.info.photos;
    console.log(photos);
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
    that.Base.setMyData({chats:data});
  }
  inputMessage(e){
    var message=e.detail.value;
    this.Base.setMyData({message:message});
  }
  sendMessage(){
    var meetingApi = new MeetingApi();
    var data=this.Base.getMyData();
    var message=data.message;
    meetingApi.send({ meeting_id: this.Base.options.id, "type": "T", side: "D", message: message }, function (data) {
     
    });
    this.Base.setMyData({message:""});
  }
}
var resulting = new Resulting();
var body = resulting.generateBodyJson();
body.onLoad = resulting.onLoad;
body.onShow = resulting.onShow; 
body.viewPhoto = resulting.viewPhoto; 
body.startMeeting = resulting.startMeeting; 
body.sendMessage = resulting.sendMessage;
body.inputMessage = resulting.inputMessage;

Page(body)
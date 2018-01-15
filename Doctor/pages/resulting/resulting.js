// pages/resulting/resulting.js
import { AppBase } from "../../app/AppBase";
import { DoctorApi } from "../../apis/doctor.api.js";
import { MeetingApi } from "../../apis/meeting.api.js";

class Resulting extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    options.id=1;
    this.Base.Page = this;
    super.onLoad(options);
  }
  onShow() {
    var that = this;
    var meetingApi=new MeetingApi();
    meetingApi.detail({id:this.Base.options.id},function(data){
      that.Base.setMyData({info:data});
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
  startMeeting(){
    var meetingApi = new MeetingApi();
    meetingApi.startmeeting({ meeting_id: this.Base.options.id }, function (data) {
      
    });
  }
}
var resulting = new Resulting();
var body = resulting.generateBodyJson();
body.onLoad = resulting.onLoad;
body.onShow = resulting.onShow; 
body.viewPhoto = resulting.viewPhoto;
body.startMeeting = resulting.startMeeting;

Page(body)
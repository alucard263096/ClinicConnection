// pages/report/report.js
import { AppBase } from "../../app/AppBase";
import { MeetingApi } from "../../apis/meeting.api.js";


class Report extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);
    var that=this;
    var meetingApi = new MeetingApi();
    meetingApi.detail({ id: this.Base.options.id }, function (data) {
      that.Base.setMyData(data);
    });
  }
  onShow() {
    var that = this;
  }
  viewPhoto() {
    var data = this.Base.getMyData();
    var photos = data.photos;
    console.log(photos);
    var nphotos = [];
    for (var i = 0; i < photos.length; i++) {
      nphotos.push(photos[i].photo);
    }
    this.Base.viewGallary("order", nphotos);
  }
  endMeeting() {
    var that = this;
    var meetingApi = new MeetingApi();
    var data = this.Base.getMyData();
    var assess_service = data.assess_service;
    var assess_technic = data.assess_technic;
    var assess_solute = data.assess_solute;
    console.log("KL");
    console.log(assess_service);
    if (assess_service==null){
      that.Base.warning("请选择服务态度的评价");
      return;
    }
    if (assess_technic == null) {
      that.Base.warning("请选择专业技能的评价");
      return;
    }
    if (assess_solute == null) {
      that.Base.warning("请选择解决问题的评价");
      return;
    }
    meetingApi.end({ meeting_id: this.Base.options.id, assess_service: assess_service, assess_technic: assess_technic, assess_solute: assess_solute }, function (data) {
      if (data.code == "0") {
        that.Base.setMyData({ status: 'E' });
        that.Base.info("提交成功");
      } else {
        that.Base.error("保存发生错误");
      }
    });
  }
  updateServiceAssess(e){
    if(this.Base.getMyData().status!='C'){
      return;
    }
    this.Base.setMyData({ assess_service:e.currentTarget.id});
  }
  updateTechnicAssess(e) {
    if (this.Base.getMyData().status != 'C') {
      return;
    }
    this.Base.setMyData({ assess_technic: e.currentTarget.id });
  }
  updateSoluteAssess(e) {
    if (this.Base.getMyData().status != 'C') {
      return;
    }
    this.Base.setMyData({ assess_solute: e.currentTarget.id });
  }
}
var report = new Report();
var body = report.generateBodyJson();
body.onLoad = report.onLoad;
body.onShow = report.onShow;
body.viewPhoto = report.viewPhoto; 
body.updateServiceAssess = report.updateServiceAssess;
body.updateTechnicAssess = report.updateTechnicAssess;
body.updateSoluteAssess = report.updateSoluteAssess;
body.endMeeting = report.endMeeting; 

Page(body)
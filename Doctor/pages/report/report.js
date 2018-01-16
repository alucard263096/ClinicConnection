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
  tempSave(){
    var that = this;
    var meetingApi = new MeetingApi();
    var data = this.Base.getMyData();
    var reason = data.reason;
    var procedure = data.procedure;
    var result = data.result;
    meetingApi.tempsave({ meeting_id: this.Base.options.id, reason: reason, procedure: procedure, result: result }, function (data) {
      if (data.code == "0") {
        that.Base.info("保存成功");
      } else {
        that.Base.error("保存发生错误");
      }
    });
  }
  completeMeeting() {
    var that = this;
    var meetingApi = new MeetingApi();
    var data = this.Base.getMyData();
    var reason = data.reason;
    var procedure = data.procedure;
    var result = data.result;
    if(reason.trim()==""){
      that.Base.warning("诊断原因不能为空");
      return;
    }
    if (procedure.trim() == "") {
      that.Base.warning("诊断过程不能为空");
      return;
    }
    if (result.trim() == "") {
      that.Base.warning("诊断结果不能为空");
      return;
    }
    meetingApi.complete({ meeting_id: this.Base.options.id, reason: reason, procedure: procedure, result: result }, function (data) {
      if (data.code == "0") {
        that.Base.setMyData({ status: 'C' });
        that.Base.info("提交成功");
      } else {
        that.Base.error("保存发生错误");
      }
    });
  }
  inputReason(e){
    this.Base.setMyData({ reason: e.detail.value });
  }
  inputProcedure(e) {
    this.Base.setMyData({ procedure: e.detail.value });
  }
  inputResult(e) {
    this.Base.setMyData({ result: e.detail.value });
  }
}
var report = new Report();
var body = report.generateBodyJson();
body.onLoad = report.onLoad;
body.onShow = report.onShow;
body.viewPhoto = report.viewPhoto;
body.tempSave = report.tempSave;
body.completeMeeting = report.completeMeeting;
body.inputReason = report.inputReason;
body.inputProcedure = report.inputProcedure;
body.inputResult = report.inputResult; 

Page(body)
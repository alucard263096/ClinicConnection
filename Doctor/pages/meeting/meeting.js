// pages/meeting/meeting.js
import { AppBase } from "../../app/AppBase";
import { DoctorApi } from "../../apis/doctor.api.js";
import { MeetingMgr } from "../../app/MeetingMgr";

class Meeting extends AppBase {
  meetingMgr=null;
  constructor() {
    super();
  }
  onLoad(options) {


    this.Base.Page = this;
    super.onLoad(options);
    this.Base.setMyData({
      tabs: [{ name: "进行中", count: 0 }, { name: "未开始", count: 0 }, { name: "已过期", count: 0 }],
      activeIndex: 0,
      sliderOffset: 0,
      sliderLeft: 0
    });

    var meetingMgr = new MeetingMgr();
    this.Base.meetingMgr = meetingMgr;
  }
  onShow() {
    var that = this;
    var doctorApi = new DoctorApi();

    var now = new Date();
    var tomorrow = new Date(now.getTime() + 24 * 3600 * 1000);
    var yesterday = new Date(now.getTime() - 24 * 3600 * 1000);
    var hour=now.getHours();
    var pfdate = "";
    var ptdate = "";
    var wfdate = "";
    var ctdate = "";
    if (hour >= 8 && hour < 10) {
      ctdate = this.Base.getDateString(now, 8);
      pfdate = this.Base.getDateString(now, 8);
      ptdate = this.Base.getDateString(now, 8);
      wfdate = this.Base.getDateString(now, 10);
    }
    if (hour >= 10 && hour < 12) {
      ctdate = this.Base.getDateString(now, 10);
      pfdate = this.Base.getDateString(now, 10);
      ptdate = this.Base.getDateString(now, 10);
      wfdate = this.Base.getDateString(now, 12);
    }
    if (hour >= 12 && hour < 14) {
      ctdate = this.Base.getDateString(now, 12);
      pfdate = this.Base.getDateString(now, 12);
      ptdate = this.Base.getDateString(now, 12);
      wfdate = this.Base.getDateString(now, 14);
    }
    if (hour >= 14 && hour < 16) {
      ctdate = this.Base.getDateString(now, 14);
      pfdate = this.Base.getDateString(now, 14);
      ptdate = this.Base.getDateString(now, 14);
      wfdate = this.Base.getDateString(now, 16);
    }
    if (hour >= 16 && hour < 18) {
      ctdate = this.Base.getDateString(now, 16);
      pfdate = this.Base.getDateString(now, 16);
      ptdate = this.Base.getDateString(now, 16);
      wfdate = this.Base.getDateString(now, 18);
    }
    if (hour >= 18 && hour < 20) {
      ctdate = this.Base.getDateString(now, 18);
      pfdate = this.Base.getDateString(now, 18);
      ptdate = this.Base.getDateString(now, 18);
      wfdate = this.Base.getDateString(now, 20);
    }
    if (hour >= 20 && hour < 22) {
      ctdate = this.Base.getDateString(now, 20);
      pfdate = this.Base.getDateString(now, 20);
      ptdate = this.Base.getDateString(now, 20);
      wfdate = this.Base.getDateString(now, 22);
    }
    if (hour >= 22) {
      ctdate = this.Base.getDateString(now, 22);
      pfdate = this.Base.getDateString(now, 22);
      ptdate = this.Base.getDateString(now, 22);
      wfdate = this.Base.getDateString(tomorrow, 8);
    }
    if (hour < 8) {
      ctdate = this.Base.getDateString(yesterday, 22);
      pfdate = this.Base.getDateString(yesterday, 22);
      ptdate = this.Base.getDateString(yesterday, 22);
      wfdate = this.Base.getDateString(now, 8);
    }

    doctorApi.meetinglist({ "status": "W,P", mdate_from: pfdate, mdate_to: ptdate }, function (data) {
      that.Base.setMyData({ plist: data });
      for(let item of data){
        if(item.status=="P"){
          //that.Base.meetingMgr.createMeeting(item.id);
        }
      }
    });
    doctorApi.meetinglist({ "status": "W,P", mdate_from: wfdate }, function (data) {
      that.Base.setMyData({ wlist: data });
      for (let item of data) {
        if (item.status == "P") {
          //that.Base.meetingMgr.createMeeting(item.id);
        }
      }
    });
    doctorApi.meetinglist({ "status": "W,P", mdate_to: ctdate  }, function (data) {
      that.Base.setMyData({ clist: data });
      for (let item of data) {
        if (item.status == "P") {
          //that.Base.meetingMgr.createMeeting(item.id);
        }
      }
    });
    
  }
  tabClick(e) {
    this.Base.setMyData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
  getDateString(now,time){
    return now.getFullYear().toString() + "-" + (now.getMonth() + 1).toString() + "-" + now.getDate().toString() + " " + time.toString()+":00";
  }
  onPullDownRefresh(){
    super.onPullDownRefresh();
    this.onShow();
  }
}

var meeting = new Meeting();
var body = meeting.generateBodyJson();
body.onLoad = meeting.onLoad;
body.onShow = meeting.onShow;
body.tabClick = meeting.tabClick;
body.onPullDownRefresh = meeting.onPullDownRefresh;
Page(body)
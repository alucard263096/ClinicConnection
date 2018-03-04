// pages/meeting/meeting.js
import { AppBase } from "../../app/AppBase";
import {MeetingApi} from "../../apis/meeting.api.js";

class Meeting extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({
      tabs: ["进行中", "已完成"],
      activeIndex: 0,
      sliderOffset: 0,
      sliderLeft: 0,
      t1:0,
      t2:0
    });
  }
  onShow() {
    if (this.Base.isLogined() == false) {
      this.Base.askLogin();
    }
    var that = this;
    var meetingApi=new MeetingApi();
    meetingApi.list({"status":"W,P",doctor_id:AppBase.DOCTORID},function(data){
      that.Base.setMyData({plist:data});
      var t1=0;
      for(var i=0;i<data.length;i++){
        if(data[i].status=="P"){
          t1++;
        }
      }
      that.Base.setMyData({ t1: t1 });
    });
    meetingApi.list({ "status": "C,E", doctor_id: AppBase.DOCTORID }, function (data) {
      that.Base.setMyData({ slist: data });
      var t2 = 0;
      for (var i = 0; i < data.length; i++) {
        if (data[i].status == "C") {
          t2++;
        }
      }
      that.Base.setMyData({ t2: t2 });
    });
  }
  tabClick(e) {
    this.Base.setMyData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
}
var meeting = new Meeting();
var body = meeting.generateBodyJson();
body.onLoad = meeting.onLoad;
body.onShow = meeting.onShow;
body.tabClick = meeting.tabClick;

Page(body)
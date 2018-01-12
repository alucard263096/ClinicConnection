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
      sliderLeft: 0
    });
  }
  onShow() {
    var that = this;
    var meetingApi=new MeetingApi();
    meetingApi.list({"status":"W,P"},function(data){
      that.Base.setMyData({plist:data});
    });
    meetingApi.list({ "status": "C,E" }, function (data) {
      that.Base.setMyData({ slist: data });
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
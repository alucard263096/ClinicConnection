// pages/static/static.js
import { AppBase } from "../../app/AppBase";
import { DoctorApi } from "../../apis/doctor.api.js";
import { MeetingMgr } from "../../app/MeetingMgr";

var wxCharts = require('../../utils/wxcharts.js');

class PageObject extends AppBase {
  
  constructor() {
    super();
  }
  onLoad(options) {


    this.Base.Page = this;
    super.onLoad(options);
    this.Base.setMyData({
      tabs: [{ name: "概况", count: 0 }, { name: "预约", count: 0 }, { name: "会诊", count: 0 }, { name: "收入", count: 0 }],
      activeIndex: 0,
      sliderOffset: 0,
      sliderLeft: 0
    });

    var meetingMgr = new MeetingMgr();
    this.Base.meetingMgr = meetingMgr;
  }
  onShow() {
    var that = this;
    
  }
  tabClick(e) {
    this.Base.setMyData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
}

var meeting = new PageObject();
var body = meeting.generateBodyJson();
body.onLoad = meeting.onLoad;
body.onShow = meeting.onShow;
body.tabClick = meeting.tabClick;
Page(body)
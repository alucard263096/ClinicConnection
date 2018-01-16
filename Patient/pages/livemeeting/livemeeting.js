// pages/livemeeting/livemeeting.js
import { AppBase } from "../../app/AppBase";

class LiveMeeting extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);
    this.Base.setMyData({ id:options.id});
  }
  onShow() {
    var that = this;
  }
  pushstatechange(e) {
    console.log('live-player code:', e.detail.code)
  }
  rtmpstatechange(e) {
    console.log('live-pusher code:', e.detail.code)
  }
  error(e) {
    console.error('live-player error:', e.detail.errMsg)
  }
}
var meeting = new LiveMeeting();
var body = meeting.generateBodyJson();
body.onLoad = meeting.onLoad;
body.onShow = meeting.onShow;
body.pushstatechange = meeting.pushstatechange;
body.rtmpstatechange = meeting.rtmpstatechange;
body.error = meeting.error;
Page(body)
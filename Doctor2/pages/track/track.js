// pages/track/track.js
import { AppBase } from "../../app/AppBase";
import { ApiConfig } from "../../apis/apiconfig";
import { DoctorApi } from "../../apis/doctor.api";

class Track extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);

    var doctorApi = new DoctorApi();
    var that = this;
    doctorApi.tracklist({}, function (data) {
      that.setData({ list:data });
    });

  }
}

var track = new Track();
var body = track.generateBodyJson();
body.onLoad = track.onLoad;
Page(body)
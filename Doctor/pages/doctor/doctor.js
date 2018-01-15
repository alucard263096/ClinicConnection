// pages/doctor/doctor.js
import { AppBase } from "../../app/AppBase";
import { ApiConfig } from "../../apis/apiconfig";
import { DoctorApi } from "../../apis/doctor.api";

class Doctor extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);
  }

  onShow() {
    var that=this;
    var doctorApi = new DoctorApi();
    doctorApi.detail({},function(data){
      that.Base.setMyData({ doctor: data});
    });
  }
}

var doctor = new Doctor();
var body = doctor.generateBodyJson();
body.onLoad = doctor.onLoad;
body.onShow = doctor.onShow;

Page(body)
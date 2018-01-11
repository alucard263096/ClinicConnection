import { AppBase } from "../../app/AppBase";
import { ApiConfig } from "../../apis/apiconfig";
import { DoctorApi } from "../../apis/doctor.api";

class Doctor extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    console.log(options);
    this.Base.Page = this;
    super.onLoad(options);
    var id=options.id;

    var doctorApi = new DoctorApi();
    var that = this;
    doctorApi.detail({ id: id}, function (data) {
      that.setData({ doctor: data});
    });
  }
  gotoOrder(e) {
    wx.navigateTo({
      url: '../schedule/schedule?doctor_id='+this.options.id,
    })
  }
}

var doctor = new Doctor();
var body = doctor.generateBodyJson();
body.onLoad = doctor.onLoad; 
body.setSelectedDepartment = doctor.setSelectedDepartment;
body.gotoOrder = doctor.gotoOrder;
Page(body)
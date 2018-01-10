import { AppBase } from "../../app/AppBase";
import { ApiConfig } from "../../apis/apiconfig";
import { DoctorApi } from "../../apis/doctor.api";

class Doctor extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    options.id=1;
    super.onLoad(options);
    var id=options.id;
    ApiConfig.SetUnicode("vista");

    var doctorApi = new DoctorApi();
    var that = this;
    doctorApi.detail({ id: id}, function (data) {
      that.setData({ doctor: data});
    });
  }
  gotoOrder(e) {
    var t=e.currentTarget.id;
    console.log(this.options);
    wx.navigateTo({
      url: '../order/order?doctor_id='+this.options.id+"&t="+t,
    })
  }
}

var doctor = new Doctor();
var body = doctor.generateBodyJson();
body.onLoad = doctor.onLoad; 
body.setSelectedDepartment = doctor.setSelectedDepartment;
body.gotoOrder = doctor.gotoOrder;
Page(body)
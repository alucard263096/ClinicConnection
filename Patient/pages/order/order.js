import { AppBase } from "../../app/AppBase";
import { ApiConfig } from "../../apis/apiconfig";
import { DoctorApi } from "../../apis/doctor.api";

class Order extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    options.doctor_id = 1;
    options.t = "w";
    super.onLoad(options);
    var doctor_id = options.doctor_id;
    var t = options.t;
    ApiConfig.SetUnicode("vista");

    var doctorApi = new DoctorApi();
    var that = this;

    var timetable = ["8:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
    that.setData({ timetable: timetable });
    doctorApi.detail({ id: doctor_id }, function (data) {
      that.setData({ doctor: data });
    });
    doctorApi.schedule({ id: doctor_id }, function (data) {
      that.setData({ doctor: data });
    });
  }
  gotoOrder(e) {
    var t = e.currentTarget.id;
    console.log(this.options);
    wx.navigateTo({
      url: '../order/order?doctor_id=' + this.options.id + "&type=" + t,
    })
  }
}

var order = new Order();
var body = order.generateBodyJson();
body.onLoad = order.onLoad;
Page(body)
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
    options.unicode = "mamidx";
    options.id=9;
    super.onLoad(options);
    AppBase.DOCTORID = options.id;
    
    var id=options.id;

    var doctorApi = new DoctorApi();
    var that = this;
    doctorApi.detail({ id: id}, function (data) {
      that.setData({ doctor: data});
    });

    doctorApi.track({ doctor_id: id }, function (data) {
      
    },false);

  }
  gotoOrder(e) {
    //console.log(this.Base.options.id);
    //return;
    wx.navigateTo({
      url: '../schedule/schedule?doctor_id='+this.Base.options.id,
    })
  }
}

var doctor = new Doctor();
var body = doctor.generateBodyJson();
body.onLoad = doctor.onLoad; 
body.setSelectedDepartment = doctor.setSelectedDepartment;
body.gotoOrder = doctor.gotoOrder;
Page(body)
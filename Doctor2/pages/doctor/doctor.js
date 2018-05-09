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
    //options.unicode = "vista";
    //options.id=1;

    if(options.id!=undefined){
      wx.setStorageSync("id", options.id);
    }
    if (options.unicode != undefined) {
      wx.setStorageSync("unicode", options.unicode);
    }

    if (options.id == undefined) {
      options.id = wx.getStorageSync("id");
    }
    if (options.unicode == undefined) {
      options.unicode = wx.getStorageSync("unicode");
    }
    if(options.id==""){
      options.id=undefined;
    }
    if (options.unicode == "") {
      options.unicode = undefined;
    }
    if (options.id == "") {
      options.id = undefined;
    }
    if (options.unicode == "") {
      options.unicode = undefined;
    }
    super.onLoad(options);
    AppBase.DOCTORID = options.id;
    
    var id=options.id;

    var doctorApi = new DoctorApi();
    var that = this;
    doctorApi.detail({ id: id}, function (data) {
      that.setData({ doctor: data});
    });


  }
  gotoOrder(e) {
    //console.log(this.Base.options.id);
    //return;
    wx.navigateTo({
      url: '../schedule/schedule?doctor_id='+this.Base.options.id,
    })
  }
  onShow(){
    var doctorApi = new DoctorApi();
    var that = this;
    setTimeout(function(){
      doctorApi.track({ doctor_id: that.Base.options.id }, function (data) {
      }, false);
    },3000);
  }
}

var doctor = new Doctor();
var body = doctor.generateBodyJson();
body.onLoad = doctor.onLoad;
body.onShow = doctor.onShow; 
body.setSelectedDepartment = doctor.setSelectedDepartment;
body.gotoOrder = doctor.gotoOrder;
Page(body)
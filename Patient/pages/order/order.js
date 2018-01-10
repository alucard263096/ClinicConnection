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

    var now = new Date();
    var nowTime = now.getTime();
    var day = now.getDay();
    var oneDayLong = 24 * 60 * 60 * 1000; 
    var startmonday = nowTime - (day - 1) * oneDayLong;
    var weekcount=0;
    this.Base.setMyData({ startmonday: startmonday, weekcount: weekcount, description:""});

    
    doctorApi.detail({ id: doctor_id }, function (data) {
      that.setData({ doctor: data });
    });
    //doctorApi.schedule({ id: doctor_id }, function (data) {
      //that.setData({ doctor: data });
    //});
  }
  onShow(){
    this.Base.updateWeekStr();
  }
  updateWeekStr(){
    var that=this;
    var data=this.getMyData();
    console.log(data);
    var monday = data.startmonday + data.weekcount*7*24*60*60*1000;

    var sunday = monday + 24 * 60 * 60 * 1000*6;
    var m = new Date(monday);
    var s = new Date(sunday);
    var nowweekstr = m.getFullYear().toString() + "年" + (m.getMonth() + 1 > 10 ? (m.getMonth() + 1).toString() : "0" + (m.getMonth() + 1).toString()) + "月" + (m.getDate() > 10 ? m.getDate().toString() : "0" + m.getDate().toString())+"日";
    nowweekstr += " ~ " + (s.getMonth() + 1 > 10 ? (s.getMonth() + 1).toString() : "0" + (s.getMonth() + 1).toString()) + "月" + (s.getDate() > 10 ? s.getDate().toString() : "0" + s.getDate().toString())+"日";
    this.setMyData({ nowweekstr: nowweekstr });

    var doctorApi = new DoctorApi();
    console.log(this);
    doctorApi.schedule({ doctor_id: this.options.doctor_id, sdate: monday/1000 }, function (data) {
      that.setMyData({ timetable: data });
    });


  }
  prevWeek(){
    var data = this.Base.getMyData();
    if(data.weekcount==0){
      return;
    }
    this.Base.setMyData({ weekcount: data.weekcount - 1 });
    this.Base.updateWeekStr();
  }
  nextWeek(){
    var data = this.Base.getMyData();
    console.log(data);
    this.Base.setMyData({ weekcount: data.weekcount + 1 });
    this.Base.updateWeekStr();
  }
  selectDate(e){
    var target=e.currentTarget.dataset;
    if(target.count<0){
      return;
    }
    var dateinfo = target;
    this.Base.setMyData({ dateinfo: dateinfo});
  }
  changedescription(e) {
    this.Base.setMyData({ description: e.detail.value });
  }

}

var order = new Order();
var body = order.generateBodyJson();
body.onLoad = order.onLoad;
body.onShow = order.onShow;
body.prevWeek = order.prevWeek;
body.nextWeek = order.nextWeek; 
body.selectDate = order.selectDate;
body.changeDescription = order.changeDescription;
Page(body)
import { AppBase } from "../../app/AppBase";
import { ApiConfig } from "../../apis/apiconfig";
import { DoctorApi } from "../../apis/doctor.api";

class Schedule extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);
    var doctorApi = new DoctorApi();
    var that = this;

    var now = new Date();
    var nowTime = now.getTime();
    var day = now.getDay();
    var oneDayLong = 24 * 60 * 60 * 1000; 
    var startmonday = nowTime - (day - 1) * oneDayLong;
    var weekcount=0;
    this.Base.setMyData({
      startmonday: startmonday, weekcount: weekcount});
  }
  onShow(){
    this.Base.updateWeekStr();
  }
  updateWeekStr(){
    console.log("a");
    var that=this;
    var data=this.getMyData();
    console.log(data);
    var monday = data.startmonday + data.weekcount*7*24*60*60*1000;

    console.log("b");
    var sunday = monday + 24 * 60 * 60 * 1000*6;
    var m = new Date(monday);
    var s = new Date(sunday);
    var nowweekstr = m.getFullYear().toString() + "年" + (m.getMonth() + 1 > 10 ? (m.getMonth() + 1).toString() : "0" + (m.getMonth() + 1).toString()) + "月" + (m.getDate() > 10 ? m.getDate().toString() : "0" + m.getDate().toString())+"日";
    nowweekstr += " ~ " + (s.getMonth() + 1 > 10 ? (s.getMonth() + 1).toString() : "0" + (s.getMonth() + 1).toString()) + "月" + (s.getDate() > 10 ? s.getDate().toString() : "0" + s.getDate().toString()) + "日";
    console.log(this.Base);
    console.log("b2");
    this.setMyData({ nowweekstr: nowweekstr });
    console.log("c");

    var doctorApi = new DoctorApi();
    doctorApi.myschedule({  sdate: monday/1000 }, function (data) {
      that.setMyData({ timetable: data });
    });
    console.log("d");
  }
  prevWeek(){
    var data = this.Base.getMyData();
    this.Base.setMyData({ weekcount: data.weekcount - 1 });
    this.Base.updateWeekStr();
  }
  nextWeek(){
    var data = this.Base.getMyData();
    console.log(data);
    this.setData({ weekcount: data.weekcount + 1 });
    this.Base.updateWeekStr();
  }
  selectDate(e){
    var target=e.currentTarget.dataset;
    var timetable=this.Base.getMyData().timetable;
    if (target.count > 0 || target.isouttime=="Y"){
      return;
    }
    var dateinfo = target;
    console.log(timetable);
    console.log(dateinfo);
    for (var i = 0; i < timetable.length;i++){
      if (timetable[i].val == dateinfo.val){
        for(var j=0;j<timetable[i].schedule.length;j++){
          if (timetable[i].schedule[j].date == dateinfo.date){
            if (timetable[i].schedule[j].count<0){
              timetable[i].schedule[j].count=0;
            }else{
              timetable[i].schedule[j].count=-1;
            }
          }
        }
      }
    }
    this.Base.setMyData({ timetable: timetable});
  }
  copyLastweek(){
    var that=this;
    var data = this.Base.getMyData();
    var monday = data.startmonday + (data.weekcount-1) * 7 * 24 * 60 * 60 * 1000;
    var doctorApi = new DoctorApi();
    doctorApi.myschedule({ sdate: monday / 1000 }, function (data) {
      var timetable = that.Base.getMyData().timetable;
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].schedule.length; j++) {
          if (data[i].schedule[j].count >= 0
            && timetable[i].schedule[j].isouttime == "N"
            && timetable[i].schedule[j].count == -1
          ) {
            timetable[i].schedule[j].count = 0;
          }
        }
      }
      that.Base.setMyData({ timetable: timetable});
      
    });
  }
  submitSchedule() {
    var that = this;
    var data = this.Base.getMyData();
    console.log(data);
    var monday = data.startmonday + data.weekcount * 7 * 24 * 60 * 60 * 1000;

    var doctorApi = new DoctorApi();
    var timetable = that.Base.getMyData().timetable;
    console.log(JSON.stringify(timetable));
    console.log(JSON.stringify(monday / 1000));
    doctorApi.updateschedule({ monday: monday/1000, timetable: JSON.stringify(timetable) }, function (data) {
      //that.Base.error(JSON.stringify(data));
      if(data.code==0){
        that.Base.info("更新成功");
        that.Base.updateWeekStr();
      }else{
        that.Base.error(data.result);
      }
    });
  }
}

var schedule = new Schedule();
var body = schedule.generateBodyJson();
body.onLoad = schedule.onLoad;
body.onShow = schedule.onShow;
body.prevWeek = schedule.prevWeek;
body.nextWeek = schedule.nextWeek; 
body.selectDate = schedule.selectDate;
body.copyLastweek = schedule.copyLastweek;
body.submitSchedule = schedule.submitSchedule; 

Page(body)
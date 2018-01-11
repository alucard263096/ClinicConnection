import { AppBase } from "../../app/AppBase";
import { ApiConfig } from "../../apis/apiconfig";
import { DoctorApi } from "../../apis/doctor.api";
import { OrderApi } from "../../apis/order.api";

class Order extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    options.doctor_id = 1;
    super.onLoad(options);
    var doctor_id = options.doctor_id;

    var doctorApi = new DoctorApi();
    var that = this;

    var now = new Date();
    var nowTime = now.getTime();
    var day = now.getDay();
    var oneDayLong = 24 * 60 * 60 * 1000; 
    var startmonday = nowTime - (day - 1) * oneDayLong;
    var weekcount=0;
    this.Base.setMyData({
      startmonday: startmonday, weekcount: weekcount, description: "", contact:"",
      photos: []});

    
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
    doctorApi.schedule({ doctor_id: this.options.doctor_id, sdate: monday/1000 }, function (data) {
      that.setMyData({ timetable: data });
    });
    console.log("d");


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
    this.setData({ weekcount: data.weekcount + 1 });
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
  changeDescription(e) {
    this.setData({ description: e.detail.value });
  }
  chooseImage(){
    var that=this;
    this.Base.uploadImage("order",function(photo){
        var photos=that.Base.getMyData().photos;
        photos.push(photo);
        that.Base.setMyData({photos:photos});
    });
  }
  deleteImage(e) {
    var photos = this.Base.getMyData().photos;
    var newphotos = [];
    for (var i = 0; i < photos.length; i++) {
      if (e.currentTarget.id != "photo_" + photos[i]) {
        newphotos.push(photos[i]);
      }
    }
    this.Base.setMyData({ photos: newphotos });
  }
  previewPhotos(){
    console.log("aa");
    var photos = this.Base.getMyData().photos;
    console.log(photos);
    this.Base.viewGallary("order",photos);
  }
  inputContact(e){
    var value = e.detail.value;
    this.Base.setMyData({ contact: value });
  }
  submitOrder(e){
    

    var t=e.currentTarget.id;
    var data=this.Base.getMyData();
    console.log(data);
    if(data.dateinfo==undefined){
      this.Base.info("请选择预约时间");
      return;
    }
    var datetime = data.dateinfo.date + " " + data.dateinfo.time;
    var datetime_val = data.dateinfo.val;
    //var datetime = data.dateinfo.
    var description = data.description;
    var contact = data.contact;
    if (description.trim()==""){
      this.Base.info("请输入你需要咨询的问题描述");
    }
    var photos=data.photos;
    var that=this;
    if(this.Base.isLogined()){
      var orderApi=new OrderApi();
      var json={
        doctor_id:data.doctor.id,
        booking_date:datetime,
        booking_val:datetime_val,
        description:description,
        contact:contact,
        booking_type: t,
        photos:photos.join(",")
      };
      orderApi.submit(json,function(data){
        if(data.code=="0"){
          wx.navigateTo({
            url: '../ordertail/ordertail?id='+data.return
          })
        }else{
          that.Base.error("系统错误，请稍后重试");
        }
      });  
    }else{
      this.Base.askLogin();
    }
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
body.chooseImage = order.chooseImage; 
body.deleteImage = order.deleteImage;
body.previewPhotos = order.previewPhotos; 
body.inputContact = order.inputContact;
body.submitOrder = order.submitOrder;
Page(body)
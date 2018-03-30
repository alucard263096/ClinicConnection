// pages/static/static.js
import { AppBase } from "../../app/AppBase";
import { DoctorApi } from "../../apis/doctor.api.js";
import { DoctorstaticApi } from "../../apis/doctorstatic.api.js";
import { MeetingMgr } from "../../app/MeetingMgr";

var wxCharts = require('../../utils/wxcharts.js');

class PageObject extends AppBase {
  orderdetailLineChart=null;
  constructor() {
    super();
  }
  onLoad(options) {

    this.Base.Page = this;
    super.onLoad(options);

    this.Base.setMyData({
      tabs: [{ name: "概况", count: 0 }, { name: "预约", count: 0 }, { name: "会诊", count: 0 }, { name: "销售", count: 0 }],
      activeIndex:1,
      sliderOffset: 1,
      sliderLeft: 1,
      orderdetail_startdate: this.Base.util.FormatDate(new Date((new Date()).getTime() - 6 * 24 * 3600 * 1000)),
      orderdetail_enddate: this.Base.util.FormatDate(new Date((new Date()).getTime() ))
    });

    var meetingMgr = new MeetingMgr();
    this.Base.meetingMgr = meetingMgr;

    var that = this;
    that.Base.reloadOrderDetailChart();
  }
  onShow() {
    var that = this;

    var doctorstaticApi = new DoctorstaticApi();
    doctorstaticApi.summary({}, function (data) {
      that.Base.setMyData({ summary: data });
    });
  }
  tabClick(e) {
    this.Base.setMyData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
  orderdetaildate(e){
   var id=e.currentTarget.id;
   if(id=="7"){
     this.Base.setMyData({
       orderdetail_startdate: this.Base.util.FormatDate(new Date((new Date()).getTime() - 6 * 24 * 3600 * 1000)),
       orderdetail_enddate: this.Base.util.FormatDate(new Date((new Date()).getTime()))
     });
   }else{

     this.Base.setMyData({
       orderdetail_startdate: this.Base.util.FormatDate(new Date((new Date()).getTime() - 29 * 24 * 3600 * 1000)),
       orderdetail_enddate: this.Base.util.FormatDate(new Date((new Date()).getTime()))
     });
   }

   this.Base.reloadOrderDetailChart();
  }
  reloadOrderDetailChart(){
    var that=this;
    var data = this.getMyData();
    var startdate = data.orderdetail_startdate;
    var enddate = data.orderdetail_enddate;

    var doctorstaticApi = new DoctorstaticApi();
    doctorstaticApi.orderdetail({startdate:startdate,enddate:enddate}, function (data) {
      var categories=data.categories;
      var doctordata = data.doctor;
      var clinicdata = data.clinic;
      if (that.orderdetailLineChart==null){
        that.orderdetailLineChart=new wxCharts({
          canvasId: 'orderdetialline',
          type: 'line',
          categories: categories,
          animation: true,
          // background: '#f5f5f5',
          series: [{
            name: '我的',
            data: doctordata,
            format: function (val, name) {
              return val.toFixed(2) + '元';
            }
          }, {
            name: '诊所',
            data: clinicdata,
            format: function (val, name) {
              return val.toFixed(2) + '元';
            }
          }],
          xAxis: {
            disableGrid: true
          },
          yAxis: {
            title: '预约金额（元）',
            format: function (val) {
              return val.toFixed(2);
            },
            min: 0
          },
          width: 320,
          height: 180,
          dataLabel: false,
          dataPointShape: true,
          extra: {
            lineStyle: 'curve'
          }
        });



      }else{
        console.log(categories);
        console.log(doctordata);
        console.log(clinicdata);
        that.orderdetailLineChart.updateData({
          categories: categories,
          series: [{
            name: '我的',
            data: doctordata,
            format: function (val, name) {
              return val.toFixed(2) + '元';
            }
          }, {
            name: '诊所',
            data: clinicdata,
            format: function (val, name) {
              return val.toFixed(2) + '元';
            }
          }]
        });
      }
    });
  }
  changeOrderDetailStartDate(e) {
    var selectdate=e.detail.value;
    var data=this.Base.getMyData();
    var startdate = data.orderdetail_startdate;
    var enddate = data.orderdetail_enddate;

    var startdateTime = this.Base.util.StringToDate(selectdate).getTime();
    var enddateTime = this.Base.util.StringToDate(enddate).getTime();
    if (startdateTime > enddateTime){
      startdate = enddate;
    }else{
      startdate = selectdate;
    }
    this.Base.setMyData({
      orderdetail_startdate: startdate,
      orderdetail_enddate: enddate
    });
    this.Base.reloadOrderDetailChart();
  }
  changeOrderDetailEndDate(e) {
    console.log(e);

    var selectdate = e.detail.value;
    var data = this.Base.getMyData();
    var startdate = data.orderdetail_startdate;
    var enddate = data.orderdetail_enddate;

    var startdateTime = this.Base.util.StringToDate(startdate).getTime();
    var enddateTime = this.Base.util.StringToDate(selectdate).getTime();
    if (startdateTime > enddateTime) {
      enddate = startdate;
    } else {
      enddate = selectdate;
    }
    this.Base.setMyData({
      orderdetail_startdate: startdate,
      orderdetail_enddate: enddate
    });
    this.Base.reloadOrderDetailChart();
  }
}

var meeting = new PageObject();
var body = meeting.generateBodyJson();
body.onLoad = meeting.onLoad;
body.onShow = meeting.onShow;
body.tabClick = meeting.tabClick; 
body.orderdetaildate = meeting.orderdetaildate;
body.changeOrderDetailStartDate = meeting.changeOrderDetailStartDate;
body.changeOrderDetailEndDate = meeting.changeOrderDetailEndDate;
Page(body)
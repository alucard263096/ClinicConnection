// pages/static/static.js
import { AppBase } from "../../app/AppBase";
import { DoctorApi } from "../../apis/doctor.api.js";
import { DoctorstaticApi } from "../../apis/doctorstatic.api.js";
import { MeetingMgr } from "../../app/MeetingMgr";

var wxCharts = require('../../utils/wxcharts.js');

class PageObject extends AppBase {
  orderdetailLineChart = null;
  orderdetailPieChart = null;
  meetingdetailLineChart = null;
  meetingdetailPieChart = null;
  goodssalesdetailLineChart = null;
  goodssalesdetailPieChart = null;

  constructor() {
    super();
  }
  onLoad(options) {

    this.Base.Page = this;
    super.onLoad(options);

    this.Base.setMyData({
      tabs: [{ name: "概况", count: 0 }, { name: "预约", count: 0 }, { name: "会诊", count: 0 }, { name: "销售", count: 0 }],
      activeIndex:0,
      sliderOffset: 0,
      sliderLeft: 0,
      orderdetail_startdate: this.Base.util.FormatDate(new Date((new Date()).getTime() - 6 * 24 * 3600 * 1000)),
      orderdetail_enddate: this.Base.util.FormatDate(new Date((new Date()).getTime())),
      meetingdetail_startdate: this.Base.util.FormatDate(new Date((new Date()).getTime() - 6 * 24 * 3600 * 1000)),
      meetingdetail_enddate: this.Base.util.FormatDate(new Date((new Date()).getTime())),
      goodssalesdetail_startdate: this.Base.util.FormatDate(new Date((new Date()).getTime() - 6 * 24 * 3600 * 1000)),
      goodssalesdetail_enddate: this.Base.util.FormatDate(new Date((new Date()).getTime()))
    });

    var meetingMgr = new MeetingMgr();
    this.Base.meetingMgr = meetingMgr;

    var that = this;
    that.Base.reloadOrderDetailChart();
    that.Base.reloadmeetingDetailChart();
    that.Base.reloadgoodssalesDetailChart();
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
      var doctortotal = Number(data.doctortotal);
      var clinictotal = Number(data.clinictotal);
      if (that.orderdetailLineChart==null){


        that.orderdetailPieChart =  new wxCharts({
          animation: true,
          canvasId: 'orderdetialpie',
          type: 'pie',
          series: [{
            name: '我的',
            data: doctortotal,
          }, {
              name: '诊所',
              data: clinictotal,
          }],
          width: 380,
          height: 230,
          dataLabel: true,
        });


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
          width: 380,
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
        that.orderdetailPieChart.updateData({
          categories: categories,
          series: [{
            name: '我的',
            data: doctortotal,
          }, {
            name: '诊所',
            data: clinictotal,
          }],
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

  orderdetailTouchHandler(e) {
    console.log(this.Base.orderdetailLineChart.getCurrentDataIndex(e));
    this.Base.orderdetailLineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  }










  meetingdetaildate(e) {
    var id = e.currentTarget.id;
    if (id == "7") {
      this.Base.setMyData({
        meetingdetail_startdate: this.Base.util.FormatDate(new Date((new Date()).getTime() - 6 * 24 * 3600 * 1000)),
        meetingdetail_enddate: this.Base.util.FormatDate(new Date((new Date()).getTime()))
      });
    } else {

      this.Base.setMyData({
        meetingdetail_startdate: this.Base.util.FormatDate(new Date((new Date()).getTime() - 29 * 24 * 3600 * 1000)),
        meetingdetail_enddate: this.Base.util.FormatDate(new Date((new Date()).getTime()))
      });
    }

    this.Base.reloadmeetingDetailChart();
  }
  reloadmeetingDetailChart() {
    var that = this;
    var data = this.getMyData();
    var startdate = data.meetingdetail_startdate;
    var enddate = data.meetingdetail_enddate;

    var doctorstaticApi = new DoctorstaticApi();
    doctorstaticApi.meetingdetail({ startdate: startdate, enddate: enddate }, function (data) {
      var categories = data.categories;
      var doctordata = data.doctor;
      var clinicdata = data.clinic;
      var doctortotal = Number(data.doctortotal);
      var clinictotal = Number(data.clinictotal);
      if (that.meetingdetailLineChart == null) {


        that.meetingdetailPieChart = new wxCharts({
          animation: true,
          canvasId: 'meetingdetialpie',
          type: 'pie',
          series: [{
            name: '我的',
            data: doctortotal,
          }, {
            name: '诊所',
            data: clinictotal,
          }],
          width: 380,
          height: 230,
          dataLabel: true,
        });


        that.meetingdetailLineChart = new wxCharts({
          canvasId: 'meetingdetialline',
          type: 'line',
          categories: categories,
          animation: true,
          // background: '#f5f5f5',
          series: [{
            name: '我的',
            data: doctordata,
            format: function (val, name) {
              return val + '次';
            }
          }, {
            name: '诊所',
            data: clinicdata,
            format: function (val, name) {
              return val + '次';
            }
          }],
          xAxis: {
            disableGrid: true
          },
          yAxis: {
            title: '预约次数',
            format: function (val) {
              return val;
            },
            min: 0
          },
          width: 380,
          height: 180,
          dataLabel: false,
          dataPointShape: true,
          extra: {
            lineStyle: 'curve'
          }
        });



      } else {
        console.log(categories);
        console.log(doctordata);
        console.log(clinicdata);
        that.meetingdetailLineChart.updateData({
          categories: categories,
          series: [{
            name: '我的',
            data: doctordata,
            format: function (val, name) {
              return val + '次';
            }
          }, {
            name: '诊所',
            data: clinicdata,
            format: function (val, name) {
              return val + '次';
            }
          }]
        });
        that.meetingdetailPieChart.updateData({
          categories: categories,
          series: [{
            name: '我的',
            data: doctortotal,
          }, {
            name: '诊所',
            data: clinictotal,
          }],
        });
      }
    });
  }
  changemeetingDetailStartDate(e) {
    var selectdate = e.detail.value;
    var data = this.Base.getMyData();
    var startdate = data.meetingdetail_startdate;
    var enddate = data.meetingdetail_enddate;

    var startdateTime = this.Base.util.StringToDate(selectdate).getTime();
    var enddateTime = this.Base.util.StringToDate(enddate).getTime();
    if (startdateTime > enddateTime) {
      startdate = enddate;
    } else {
      startdate = selectdate;
    }
    this.Base.setMyData({
      meetingdetail_startdate: startdate,
      meetingdetail_enddate: enddate
    });
    this.Base.reloadmeetingDetailChart();
  }
  changemeetingDetailEndDate(e) {
    console.log(e);

    var selectdate = e.detail.value;
    var data = this.Base.getMyData();
    var startdate = data.meetingdetail_startdate;
    var enddate = data.meetingdetail_enddate;

    var startdateTime = this.Base.util.StringToDate(startdate).getTime();
    var enddateTime = this.Base.util.StringToDate(selectdate).getTime();
    if (startdateTime > enddateTime) {
      enddate = startdate;
    } else {
      enddate = selectdate;
    }
    this.Base.setMyData({
      meetingdetail_startdate: startdate,
      meetingdetail_enddate: enddate
    });
    this.Base.reloadmeetingDetailChart();
  }

  meetingdetailTouchHandler(e) {
    console.log(this.Base.meetingdetailLineChart.getCurrentDataIndex(e));
    this.Base.meetingdetailLineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  }








  goodssalesdetaildate(e) {
    var id = e.currentTarget.id;
    if (id == "7") {
      this.Base.setMyData({
        goodssalesdetail_startdate: this.Base.util.FormatDate(new Date((new Date()).getTime() - 6 * 24 * 3600 * 1000)),
        goodssalesdetail_enddate: this.Base.util.FormatDate(new Date((new Date()).getTime()))
      });
    } else {

      this.Base.setMyData({
        goodssalesdetail_startdate: this.Base.util.FormatDate(new Date((new Date()).getTime() - 29 * 24 * 3600 * 1000)),
        goodssalesdetail_enddate: this.Base.util.FormatDate(new Date((new Date()).getTime()))
      });
    }

    this.Base.reloadgoodssalesDetailChart();
  }
  reloadgoodssalesDetailChart() {
    var that = this;
    var data = this.getMyData();
    var startdate = data.goodssalesdetail_startdate;
    var enddate = data.goodssalesdetail_enddate;

    var doctorstaticApi = new DoctorstaticApi();
    doctorstaticApi.goodssalesdetail({ startdate: startdate, enddate: enddate }, function (data) {
      var categories = data.categories;
      var doctordata = data.doctor;
      var clinicdata = data.clinic;
      var doctortotal = Number(data.doctortotal);
      var clinictotal = Number(data.clinictotal);
      if (that.goodssalesdetailLineChart == null) {


        that.goodssalesdetailPieChart = new wxCharts({
          animation: true,
          canvasId: 'goodssalesdetialpie',
          type: 'pie',
          series: [{
            name: '我的',
            data: doctortotal,
          }, {
            name: '诊所',
            data: clinictotal,
          }],
          width: 380,
          height: 230,
          dataLabel: true,
        });


        that.goodssalesdetailLineChart = new wxCharts({
          canvasId: 'goodssalesdetialline',
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
            title: '销售金额（元）',
            format: function (val) {
              return val.toFixed(2);
            },
            min: 0
          },
          width: 380,
          height: 180,
          dataLabel: false,
          dataPointShape: true,
          extra: {
            lineStyle: 'curve'
          }
        });



      } else {
        console.log(categories);
        console.log(doctordata);
        console.log(clinicdata);
        that.goodssalesdetailLineChart.updateData({
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
        that.goodssalesdetailPieChart.updateData({
          categories: categories,
          series: [{
            name: '我的',
            data: doctortotal,
          }, {
            name: '诊所',
            data: clinictotal,
          }],
        });
      }
    });
  }
  changegoodssalesDetailStartDate(e) {
    var selectdate = e.detail.value;
    var data = this.Base.getMyData();
    var startdate = data.goodssalesdetail_startdate;
    var enddate = data.goodssalesdetail_enddate;

    var startdateTime = this.Base.util.StringToDate(selectdate).getTime();
    var enddateTime = this.Base.util.StringToDate(enddate).getTime();
    if (startdateTime > enddateTime) {
      startdate = enddate;
    } else {
      startdate = selectdate;
    }
    this.Base.setMyData({
      goodssalesdetail_startdate: startdate,
      goodssalesdetail_enddate: enddate
    });
    this.Base.reloadgoodssalesDetailChart();
  }
  changegoodssalesDetailEndDate(e) {
    console.log(e);

    var selectdate = e.detail.value;
    var data = this.Base.getMyData();
    var startdate = data.goodssalesdetail_startdate;
    var enddate = data.goodssalesdetail_enddate;

    var startdateTime = this.Base.util.StringToDate(startdate).getTime();
    var enddateTime = this.Base.util.StringToDate(selectdate).getTime();
    if (startdateTime > enddateTime) {
      enddate = startdate;
    } else {
      enddate = selectdate;
    }
    this.Base.setMyData({
      goodssalesdetail_startdate: startdate,
      goodssalesdetail_enddate: enddate
    });
    this.Base.reloadgoodssalesDetailChart();
  }

  goodssalesdetailTouchHandler(e) {
    console.log(this.Base.goodssalesdetailLineChart.getCurrentDataIndex(e));
    this.Base.goodssalesdetailLineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
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
body.orderdetailTouchHandler = meeting.orderdetailTouchHandler; 


body.meetingdetaildate = meeting.meetingdetaildate;
body.changemeetingDetailStartDate = meeting.changemeetingDetailStartDate;
body.changemeetingDetailEndDate = meeting.changemeetingDetailEndDate;
body.meetingdetailTouchHandler = meeting.meetingdetailTouchHandler;



body.goodssalesdetaildate = meeting.goodssalesdetaildate;
body.changegoodssalesDetailStartDate = meeting.changegoodssalesDetailStartDate;
body.changegoodssalesDetailEndDate = meeting.changegoodssalesDetailEndDate;
body.goodssalesdetailTouchHandler = meeting.goodssalesdetailTouchHandler;

Page(body)
// pages/order/order.js
import { AppBase } from "../../app/AppBase";
import { ApiConfig } from "../../apis/apiconfig";
import { OrderApi } from "../../apis/order.api";
import { WechatApi } from "../../apis/wechat.api";

class Order extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
  }
  onShow(){
    var that=this;
    var orderApi=new OrderApi();
    orderApi.detail({id:this.Base.options.id},function(data){
        that.Base.setMyData({order:data});
    });
  }
  viewPhotos(){
    var data = this.Base.getMyData();
    var order=data.order;
    var photos=order.photos;
    var nphotos=[];
    for(var i=0;i<photos.length;i++){
      nphotos.push(photos[i].photo);
    }
    this.Base.viewGallary("order", nphotos);
  }
  payOrder() {
    var that = this;
    var wechatApi = new WechatApi();
    console.log(this.Base.options.id);
    wechatApi.prepay({id:this.Base.options.id},function(data){
      if(data.code==0){
        wx.requestPayment({
          'timeStamp': data.timeStamp,
          'nonceStr': data.nonceStr,
          'package': data.package,
          'signType': data.signType,
          'paySign': data.paySign,
          'success': function (res) {
            console.log("payment success");
            console.log(res);
            wx.navigateTo({
              url: '../success/success',
            })
          },
          'fail': function (res) {
            console.log("payment fail");
            console.log(res);
            that.Base.error(res.err_desc);
          }
        })
      }else{
        that.Base.error(data.result);
      }
    });
  }

  refundRequest(){
    var that=this;
    wx.showModal({
      title: '警告',
      content: "确定要退款？",
      success: function (res) {
        if (res.confirm) {
          var orderApi = new OrderApi();
          orderApi.refund({ id: that.Base.options.id }, function (data) {
            if(data.code=="0"){
              var order = that.Base.getMyData();
              order.status = "RW";
              order.status_name = "等待退款";
              that.Base.setMyData({ order: order });
              that.Base.info("申请退款成功，稍后客服将会为您退款");
            }else{
              that.Base.error("申请退款失败，请重新尝试");
            }
          });
        } else if (res.cancel) {

        }
      }
    })
  }
}

var order=new Order();
var body = order.generateBodyJson();
body.onLoad = order.onLoad;
body.onShow = order.onShow; 
body.viewPhotos = order.viewPhotos;
body.payOrder = order.payOrder;
body.refundRequest = order.refundRequest;


Page(body)
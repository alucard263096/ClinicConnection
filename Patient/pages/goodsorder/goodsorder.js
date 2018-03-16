// pages/doctorlist/doctorlist.js
import { AppBase } from "../../app/AppBase";
import { ApiConfig } from "../../apis/apiconfig";
import { GoodsApi } from "../../apis/goods.api";
import { MemberApi } from "../../apis/member.api";
import { MallApi } from "../../apis/mall.api";

class Order extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    options.data ='[{"goods_id":"3","qty":2,"info":{"id":"3","created_date":"2018-02-28 17:04:42","created_user":"3","updated_date":"2018-02-28 18:01:58","updated_user":"3","clinic_id":"1","name":"安宫牛黄丸","summary":"安宫黄丸","price":"250.00","content":"","status":"A","seq":"0","cover":"efc1a80c391be252d7d777a437f86870_18022817021.jpg","oriprice":"300.00","cartqty":0}},{"goods_id":"1","qty":2,"info":{"id":"1","created_date":"2018-02-28 17:04:06","created_user":"3","updated_date":"2018-02-28 17:10:59","updated_user":"3","clinic_id":"1","name":"鱼腥草胶囊","summary":"鱼胶囊","price":"5.00","content":"鱼腥草胶囊","status":"A","seq":"0","cover":"a1fb168a7fbf12c41d9505e8b0cfcf81_18022817046.jpg","oriprice":null,"cartqty":2}}]';
    super.onLoad(options);
    
    var cart=JSON.parse(options.data);
    var totalamount=0;
    for(var i=0;i<cart.length;i++){
      totalamount+=Number(cart[i].qty)*Number(cart[i].info.price);
    }
    var goodsApi = new GoodsApi();
    var that = this;
    this.Base.setMyData({ cart: cart, addressid: 0, totalamount: totalamount, freeexpressprice: 0, expressfee: 0, comment:""});
    var memberApi=new MemberApi();
    memberApi.addresslist({is_default:"Y"},function(data){
      console.log("default address");
      console.log(data);
      if(data.length>0){
        that.Base.setAddress(data[0].id)
      }
    });
    var mallApi=new MallApi();
    mallApi.config({},function(data){
      if (data.freeexpressprice==undefined){
        data.freeexpressprice=0;
      }
      if (data.expressfee == undefined) {
        data.expressfee = 0;
      }
      that.Base.setMyData({ freeexpressprice: Number(data.freeexpressprice), expressfee: Number(data.expressfee), paymentdescription: data.paymentdescription});
    });
  }
  onShow() {
    var that = this;
  }
  gotoMemberAddress(){
    wx.navigateTo({
      url: '/pages/memberaddress/memberaddress?needreturn=Y',
    })
  }
  setAddress(id) {
    var that = this;
    var memberApi = new MemberApi();
    memberApi.addressdetail({ id: id }, function (data) {
      if(that.Base==undefined){

        that.setMyData({
          addressid: id,
          addressname: data.name,
          addressmobile: data.mobile,
          address: data.address
        });
      }else{


        that.Base.setMyData({
          addressid: id,
          addressname: data.name,
          addressmobile: data.mobile,
          address: data.address
        });
      }
    });
  }
}

var order = new Order();
var body = order.generateBodyJson();
body.onLoad = order.onLoad; 
body.onShow = order.onShow;
body.gotoMemberAddress = order.gotoMemberAddress;
body.setAddress = order.setAddress;
Page(body)
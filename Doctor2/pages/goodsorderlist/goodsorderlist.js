// pages/doctorlist/doctorlist.js
import { AppBase } from "../../app/AppBase";
import { ApiConfig } from "../../apis/apiconfig";
import { MemberApi } from "../../apis/member.api";
import { GoodsApi } from "../../apis/goods.api";

class Order extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;

    super.onLoad(options);
  }
  onShow() {
    var goodsApi = new GoodsApi();
    var that = this;
    goodsApi.orderlist({},function(data){
      that.Base.setMyData({list:data});
    });
  }
  gotoPayment(e){
    var id=e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/goodsorderpayment/goodsorderpayment?id='+id,
    })
  }
  addToCart(e) {
    var id = e.currentTarget.id;
    var list = this.Base.getMyData().list; 
    var memberApi = new MemberApi();
    for(var i=0;i<list.length;i++){
      if(id==list[i].id){
        for (var j = 0; j < list[i].goods.length; j++) {
          memberApi.addtocart({ goods_id: list[i].goods[j].goods_id});
        }
      }
    }
    wx.switchTab({
      url: '/pages/mall/mall',
    })
  }
}

var order = new Order();
var body = order.generateBodyJson();
body.onLoad = order.onLoad; 
body.onShow = order.onShow; 
body.gotoPayment = order.gotoPayment;
body.addToCart = order.addToCart;
Page(body)
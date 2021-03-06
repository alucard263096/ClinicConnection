// pages/orderlist/orderlist.js
import { AppBase } from "../../app/AppBase";
import { ApiConfig } from "../../apis/apiconfig";
import { OrderApi } from "../../apis/order.api";

class OrderList extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({ list: [] });
  }
  onShow() {
    var that = this;
    var orderApi = new OrderApi();
    orderApi.list({},function(data){
      that.Base.setMyData({list:data});
    });

  }
}

var order = new OrderList();
var body = order.generateBodyJson();
body.onLoad = order.onLoad;
body.onShow = order.onShow;


Page(body)
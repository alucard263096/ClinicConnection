// pages/doctorlist/doctorlist.js
import { AppBase } from "../../app/AppBase";
import { ApiConfig } from "../../apis/apiconfig";
import { GoodsApi } from "../../apis/goods.api";
import { MemberApi } from "../../apis/member.api";

class Order extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    options.data ='[{"goods_id":"3","qty":2,"info":{"id":"3","created_date":"2018-02-28 17:04:42","created_user":"3","updated_date":"2018-02-28 18:01:58","updated_user":"3","clinic_id":"1","name":"安宫牛黄丸","summary":"安宫黄丸","price":"250.00","content":"","status":"A","seq":"0","cover":"efc1a80c391be252d7d777a437f86870_18022817021.jpg","oriprice":"300.00","cartqty":0}},{"goods_id":"1","qty":2,"info":{"id":"1","created_date":"2018-02-28 17:04:06","created_user":"3","updated_date":"2018-02-28 17:10:59","updated_user":"3","clinic_id":"1","name":"鱼腥草胶囊","summary":"鱼胶囊","price":"5.00","content":"鱼腥草胶囊","status":"A","seq":"0","cover":"a1fb168a7fbf12c41d9505e8b0cfcf81_18022817046.jpg","oriprice":null,"cartqty":2}}]';
    super.onLoad(options);
    
    var cart=decodeURIComponent(options.data);
    var goodsApi = new GoodsApi();
    var that = this;
    this.Base.setMyData({cart:cart});
  }
  onShow() {
    var that = this;
  }
  
}

var order = new Order();
var body = order.generateBodyJson();
body.onLoad = order.onLoad;
body.onShow = order.onShow;
Page(body)
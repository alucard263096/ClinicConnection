// pages/doctorlist/doctorlist.js
import { AppBase } from "../../app/AppBase";
import { ApiConfig } from "../../apis/apiconfig";
import { MemberApi } from "../../apis/member.api";

class Order extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
   
    super.onLoad(options);

    var memberApi = new MemberApi();
    var that = this;
    memberApi.addresslist({},function(data){
      that.Base.setMyData({ list: data});
    });
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
// pages/doctorlist/doctorlist.js
import { AppBase } from "../../app/AppBase";
import { ApiConfig } from "../../apis/apiconfig";
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
    goodsApi.expressquery({ expresscode: this.Base.options.expresscode, expressno: this.Base.options.expressno }, function (data) {
      that.Base.setMyData({ list: data });
    });
  }
}

var order = new Order();
var body = order.generateBodyJson();
body.onLoad = order.onLoad;
body.onShow = order.onShow;
Page(body)
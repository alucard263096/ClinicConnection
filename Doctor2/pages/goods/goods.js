// pages/doctorlist/doctorlist.js
import { AppBase } from "../../app/AppBase";
import { ApiConfig } from "../../apis/apiconfig";
import { GoodsApi } from "../../apis/goods.api";
import { MemberApi } from "../../apis/member.api";

class Goods extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);
    //options.id=3;
    var goodsApi = new GoodsApi();
    var that = this;
    goodsApi.detail({ id: options.id }, function (data) {
      that.setData({ info: data });
    });

  }
  addToCart(){
    var id=this.Base.getMyData().info.id;
    var pages = getCurrentPages();
    //var preg = pages[pages.length - 2];
    //var e = { currentTarget:{id:id}};
    //preg.addToCart(e);
      //var id = e.currentTarget.id;
      var memberApi=new MemberApi();
      memberApi.addtocart({ goods_id: id},function(){

        wx.navigateBack({

        });
      });

  }
}

var obj = new Goods();
var body = obj.generateBodyJson(); 
body.onLoad = obj.onLoad;
body.addToCart = obj.addToCart;
Page(body)
// pages/doctorlist/doctorlist.js
import { AppBase } from "../../app/AppBase";
import { ApiConfig } from "../../apis/apiconfig";
import { GoodsApi } from "../../apis/goods.api";

class Mall extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);

    var goodsApi = new GoodsApi();
    var that = this;
    goodsApi.categorylist({}, function (data) {
      that.setData({ categories: data, category: data[0] });
    });

  }
  setSelectedCategory(e) {
    var id = e.currentTarget.id;
    for (var i = 0; i < this.data.categories.length; i++) {
      if (this.data.categories[i].id == id) {
        this.Base.setMyData({ category: this.data.categories[i] });
        break;
      }
    }
  }
  addToCart(e){
    var id=e.currentTarget.id;
    var neednew=false;
    for (var i = 0; i < this.cart.length;i++){
      if(this.cart[i].goods_id==id){
        this.cart[i].qty = this.cart[i].qty + 1;
        neednew = true;
        break;
      }
    }
    if (neednew == false){
      this.cart.push({goods_id:id,qty:1});
    }
    this.updateCartData();
  }
  updateCartData(){
    console.log(this.cart);
  }
}

var mall = new Mall();
var body = mall.generateBodyJson();
body.cart=[];
body.onLoad = mall.onLoad;
body.setSelectedCategory = mall.setSelectedCategory;
body.addToCart = mall.addToCart;
body.updateCartData = mall.updateCartData;
Page(body)
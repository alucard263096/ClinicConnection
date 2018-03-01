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
      that.updateCartData();
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
  minusToCart(e) {
    var id = e.currentTarget.id;
    for (var i = 0; i < this.cart.length; i++) {
      if (this.cart[i].goods_id == id) {
        this.cart[i].qty = this.cart[i].qty - 1;
        if(this.cart[i].qty==0){
          this.cart.splice(i,1);
        }
        break;
      }
    }
    this.updateCartData();
  }
  updateCartData(){
    
    var categories = this.Base.getMyData().categories;
    var category = this.Base.getMyData().category;
    var cart = this.cart;
    for(var i=0;i<categories.length;i++){

      categories[i].cartqty = 0;
      for(var j=0;j<categories[i].goods.length;j++){
        //
        for (var k = 0; k < cart.length;k++){
          if (categories[i].goods[j].id == cart[k].goods_id){
            categories[i].goods[j].cartqty = cart[k].qty;
            cart[k].info = categories[i].goods[j];
          }else{
            categories[i].goods[j].cartqty=0;
          }
          categories[i].cartqty += categories[i].goods[j].cartqty;
        }
      }
    }
    for (var j = 0; j < category.goods.length; j++) {
      category.goods[j].cartqty = 0;
      for (var k = 0; k < cart.length; k++) {
        if (category.goods[j].id == cart[k].goods_id) {
          category.goods[j].cartqty = cart[k].qty;
        }
      }
    }
    var totalprice=0;
    for (var k = 0; k < cart.length; k++) {
      totalprice += Number(cart[k].info.price * cart[k].qty);
    }
    totalprice = totalprice.toFixed(2);
    this.Base.setMyData({ categories: categories, category: category,cart:cart,totalprice:totalprice });
  }
  
  gotoGoods(e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../goods/goods?id='+id,
    });
  }
}

var mall = new Mall();
var body = mall.generateBodyJson();
body.cart=[];
body.onLoad = mall.onLoad;
body.setSelectedCategory = mall.setSelectedCategory;
body.addToCart = mall.addToCart; 
body.updateCartData = mall.updateCartData; 
body.minusToCart = mall.minusToCart;
body.gotoGoods = mall.gotoGoods;
Page(body)
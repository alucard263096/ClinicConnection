// pages/doctorlist/doctorlist.js
import { AppBase } from "../../app/AppBase";
import { ApiConfig } from "../../apis/apiconfig";
import { GoodsApi } from "../../apis/goods.api";
import { MemberApi } from "../../apis/member.api";

class Mall extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);


  }
  onShow() {
    var that = this;
    var goodsApi = new GoodsApi();
    goodsApi.categorylist({}, function (data) {
      that.setData({ categories: data, category: data[0] });
      var memberapi = new MemberApi();
      memberapi.getcart({}, function (data) {
        console.log("a");
        console.log(data);
        that.cart = data;
        that.updateCartData();
      }, false);
    },false);
    
  }
  setSelectedCategory(e) {
    var id = e.currentTarget.id;
    for (var i = 0; i < this.data.categories.length; i++) {
      if (this.data.categories[i].id == id) {
        this.Base.setMyData({ category: this.data.categories[i] });
        break;
      }
    }
    this.updateCartData();
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
    console.log(this.cart);
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
  updateCartData() {
    var categories = this.Base.getMyData().categories;
    if(categories==undefined){
      return;
    }
    var memberapi = new MemberApi();
    memberapi.updatecart({cart:JSON.stringify(this.cart)}, function (data) {},false);
    var category = this.Base.getMyData().category;
    var cart = this.cart;
    console.log(categories);
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
    console.log("cart");
    console.log(cart);
    this.Base.setMyData({ categories: categories, category: category,cart:cart,totalprice:totalprice });
  }
  
  gotoGoods(e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../goods/goods?id='+id,
    });
  }
  checkCart(){
    if(this.cart.length>0){
      this.Base.setMyData({ showingcart: true });
    }
  }
  closeCartlist(){
    this.Base.setMyData({ showingcart: false });
  }
  cleanCart(){
    var that=this;
    wx.showModal({
      title: '提示',
      content: '是否确认清空购物车？',
      success:function(e){
        if(e.confirm){
          that.cart = [];
          that.updateCartData();
          that.Base.setMyData({ showingcart: false });
        }
      }
    })
  }
  gotoOrder(){
    var that = this;
    if (this.Base.isLogined()) {
      wx.navigateTo({
        url: '../goodsorder/goodsorder?data='+JSON.stringify(this.cart),
      });
    } else {
      this.Base.askLogin();
    }
  }
}

var mall = new Mall();
var body = mall.generateBodyJson();
body.cart=[];
body.data.showingcart=false;
body.onLoad = mall.onLoad;
body.onShow = mall.onShow;
body.setSelectedCategory = mall.setSelectedCategory;
body.addToCart = mall.addToCart; 
body.updateCartData = mall.updateCartData; 
body.minusToCart = mall.minusToCart; 
body.gotoGoods = mall.gotoGoods; 
body.checkCart = mall.checkCart; 
body.closeCartlist = mall.closeCartlist; 
body.cleanCart = mall.cleanCart;
body.gotoOrder = mall.gotoOrder;
Page(body)
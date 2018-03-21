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
    if(options.needreturn=="Y"){
      this.Base.setMyData({ needreturn: "Y" });
    }
  }
  onShow() {
    var memberApi = new MemberApi();
    var that = this;
    memberApi.addresslist({}, function (data) {
      that.Base.setMyData({ list: data });
    });
  }
  editAddress(e){
    var id=e.currentTarget.id;
    wx.navigateTo({
      url: '../memberaddressadd/memberaddressadd?id='+id,
    })
  }
  deleteAddress(e){
    var id = e.currentTarget.id;
    var that=this;
    var memberApi = new MemberApi();
    memberApi.addressdelete({idlist:id},function(){
      that.onShow();
    });
  }
  chooseAddress(e){
    var id = e.currentTarget.id;
    var pages=getCurrentPages();
    var prevpage=pages[pages.length-2];
    console.log(prevpage.setAddress);
    if (prevpage.setAddress!=undefined){
      prevpage.setAddress(id);
    }
    wx.navigateBack({
      
    })
  }
  addNew(){
    wx.navigateTo({
      url: '/pages/memberaddressadd/memberaddressadd',
    })
  }
}

var order = new Order();
var body = order.generateBodyJson();
body.onLoad = order.onLoad; 
body.onShow = order.onShow;
body.editAddress = order.editAddress;
body.deleteAddress = order.deleteAddress;
body.chooseAddress = order.chooseAddress;
body.addNew = order.addNew;
Page(body)
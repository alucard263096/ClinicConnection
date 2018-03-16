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
    if(options.id!=undefined){
    memberApi.addressdetail({ id: options.id }, function (data) {
      that.Base.setMyData({ name: data.name, mobile: data.mobile, address: data.address, is_default: data.is_default_value });
      });
    }
    this.Base.setMyData({ name: "", mobile: "", address: "", is_default: "Y" });
  }
  onShow() {
    var that = this;
  }
  inputName(e) {
    var val = e.detail.value;
    this.Base.setMyData({ name: val });
  }
  inputMobile(e) {
    var val = e.detail.value;
    this.Base.setMyData({ mobile: val });
  }
  inputAddress(e) {
    var val = e.detail.value;
    this.Base.setMyData({ address: val });
  }
  bindDefault(e) {
    this.Base.setMyData({ is_default: this.Base.getMyData().is_default == 'Y' ? "N" : "Y" });
  }
  saveAddress() {
    var data = this.Base.getMyData();
    var json = {
      name: data.name,
      mobile: data.mobile,
      address: data.address,
      is_default: data.is_default
    };
    if(this.Base.options.id!=undefined){
      json.primary_id = this.Base.options.id;
    }
    console.log(json.name);
    if (json.name == "") {
      this.Base.setMyData({ showTopTips:"收件人不能为空"});
      return;
    }
    if (json.mobile == "") {
      this.Base.setMyData({ showTopTips: "手机号码不能为空" });
      return;
    }
    if (json.address == "") {
      this.Base.setMyData({ showTopTips: "收件地址不能为空" });
      return;
    }
    this.Base.setMyData({ showTopTips: "" });
    var memberApi = new MemberApi();
    memberApi.addressupdate(json,function(data){
      if(data.code=="0"){
        wx.showToast({
          title: '保存成功',
        });
        wx.navigateBack({
          
        })
        return;
      }else{
        wx.showModal({
          title: '错误',
          content: '添加失败，请稍后重试',
          showCancel:false
        })
      }
    })
  }
}

var order = new Order();
var body = order.generateBodyJson();
body.onLoad = order.onLoad;
body.onShow = order.onShow;
body.inputName = order.inputName;
body.inputMobile = order.inputMobile;
body.inputAddress = order.inputAddress;
body.saveAddress = order.saveAddress;
body.bindDefault = order.bindDefault;
Page(body)
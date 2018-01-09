// pages/home/home.js
import { AppBase} from "../../app/AppBase";
import { ApiConfig } from "../../apis/apiconfig";
import { ClinicApi } from "../../apis/clinic.api";
var WxParse = require('../../wxParse/wxParse');

class Home extends AppBase{
 constructor(){
   super();
 }


 bindShowName(e){
   console.log(e);
   this.Base.setMyData({"name":"world"});
   this.Base.aaa();
 }
 aaa(){
   this.bbb();
 }
 bbb(){
   console.log("bbbb");
 }
 onLoad(options) {
    this.Base.Page = this;

    super.onLoad(options);
    console.log("in home");
    console.log(options.unicode);
    if(options.unicode==undefined){
      ApiConfig.SetUnicode("vista");
    }else{
      ApiConfig.SetUnicode(options.unicode);
    }
    var clinicapi=new ClinicApi();
    var that=this;
    clinicapi.detail({},function(data){
      data.content = that.Base.util.HtmlDecode(data.content);
      WxParse.wxParse('content', 'html', data.content, that, 10);
      that.setData({clinic:data});
    });
    clinicapi.stardoctor({}, function (data) {
      that.setData({ stardoctors: data });
    });
  }
}
var home = new Home();
var body = home.generateBodyJson();
body.bindShowName=home.bindShowName;
body.onLoad=home.onLoad;
Page(body)
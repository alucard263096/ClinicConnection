// pages/member/member.js
import { AppBase } from "../../app/AppBase";
import { MemberApi } from "../../apis/member.api.js";
import { ClinicApi } from "../../apis/clinic.api.js";

class Member extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
  }
  onShow() {
    var that = this;
    if (AppBase.MemberInfo!=null){
      this.Base.setMyData({ member: AppBase.MemberInfo });
    }
  }
  gotoClinic() {
    var clinicapi=new ClinicApi();
    clinicapi.detail({},(ret)=>{
      wx.navigateToMiniProgram({
        appId: ret.wechatconfig_appid   ,
        path: 'pages/home/home?unicode='+ret.unicode,
      })
    });
  }
}

var member = new Member();
var body = member.generateBodyJson();
body.onLoad = member.onLoad; 
body.onShow = member.onShow;
body.gotoClinic = member.gotoClinic;

Page(body)
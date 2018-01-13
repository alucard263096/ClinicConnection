import { AppBase } from "../../app/AppBase";
import { ApiConfig } from "../../apis/apiconfig";
import { DoctorApi } from "../../apis/doctor.api";

class Signin extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);
    this.Base.setMyData({
      isAgree: true,
      mobile: "",
      verifycode: "",
      showTopTips: "",
      reminderResend: 0
    });
  }
  agreeChange(e) {
    this.setData({ isAgree: !this.Base.getMyData().isAgree });
  }
  verifycodeChange(e) {
    this.Base.setMyData({ verifycode: e.detail.value });
  }
  mobileChange(e) {
    this.Base.setMyData({ mobile: e.detail.value });
  }
  sendVerifycode(){
    var mobile = "";
    var data=this.Base.getMyData();
    try {
      mobile = parseInt(data.mobile).toString();
    } catch (e) {

    }
    if (mobile[0] != "1" || mobile.length.toString() != "11") {
      this.Base.info("手机号码不正确，请重新输入");
      return;
    }
    var that = this;
    var doctorApi = new DoctorApi();
    doctorApi.sendloginverifycode({ mobile: mobile },
      function (data) {
        that.Base.setMyData({ reminderResend: 60 });
        var interval = setInterval(function () {
          var reminderResend = that.data.reminderResend;
          reminderResend--;
          that.Base.setMyData({ reminderResend: reminderResend });
          if (reminderResend == 0) {
            clearInterval(interval);
          }
        }, 1000);
      });
  }
  submitLogin() {
    var data = this.Base.getMyData();
    if (data.isAgree == false) {
      this.Base.info( "请先阅读并勾选同意《医生使用条款》" );
      return;
    }
    var mobile = "";
    try {
      mobile = parseInt(data.mobile).toString();
    } catch (e) {

    }
    if (mobile[0] != "1" || mobile.length.toString() != "11") {
      this.Base.info("请输入正确的手机号码" );
      return;
    }
    if (data.verifycode.trim() == "") {
      this.Base.info("验证码不能为空" );
      return;
    }
    var that = this;
    var doctorApi = new DoctorApi();
    doctorApi.login({
      mobile: mobile,
      verifycode: data.verifycode
    }, function (data) {
      if (data.code == -501) {
        that.Base.error("验证码不正确" );
        return;
      }
      if(data.length==0){
        that.Base.error("登录失败，请询问管理员");
        return;
      }
      if (data.length == 1) {
        ApiConfig.SetToken(data[0].token);
        wx.switchTab({
          url: '/pages/home/home',
        })
        return;
      }
      if (data.length > 1) {
        var namearr=[];
        for(var i=0;i<data.length;i++){
          namearr.push(data[i].clinic_id_name+" - "+data[i].name);
        }
        wx.showActionSheet({
          itemList: namearr,
          success: function (res) {
            console.log(data[res.tapIndex]);
            var doctor = data[res.tapIndex];
            ApiConfig.SetToken(doctor.token);
            doctorApi.updatetoken({},function(data){
              ApiConfig.SetToken(data.return); 
              wx.switchTab({
                url: '/pages/home/home',
              })
            });
          },
          fail: function (res) {
            console.log(res.errMsg)
          }
        })
      }
    });
  }
}
var signin = new Signin(); 
var body = signin.generateBodyJson();
body.onLoad = signin.onLoad;
body.agreeChange = signin.agreeChange;
body.mobileChange = signin.mobileChange; 
body.verifycodeChange = signin.verifycodeChange; 
body.sendVerifycode = signin.sendVerifycode;
body.submitLogin = signin.submitLogin;
Page(body)

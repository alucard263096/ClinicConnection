// pages/home/home.js
import { AppBase} from "../../App/AppBase.js";
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
  onLoad(options){
    super.onLoad(options);
    this.Base.Page = this;
    console.log("in home");
  }
}
var home = new Home();
var body = home.generateBodyJson();
body.bindShowName=home.bindShowName;
body.onLoad=home.onLoad;
Page(body)
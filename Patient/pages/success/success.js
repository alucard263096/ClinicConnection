// pages/success/success.js
import { AppBase } from "../../app/AppBase";
class Success extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
  }
}
var success = new Success();
var body = success.generateBodyJson();
body.onLoad = success.onLoad;
Page(body)
// pages/doctorlist/doctorlist.js
import { AppBase } from "../../app/AppBase";
import { ApiConfig } from "../../apis/apiconfig";
import { DepartmentApi } from "../../apis/department.api";

class DoctorList extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);

    var departmentApi = new DepartmentApi();
    var that = this;
    departmentApi.list({}, function (data) {
      that.setData({ departments: data,department:data[0] });
    });

  }
  setSelectedDepartment(e){
    var id=e.currentTarget.id;
    for(var i=0;i<this.data.departments.length;i++){
      if(this.data.departments[i].id==id){
        this.Base.setMyData({ department: this.data.departments[i] });
        break;
      }
    }
  }


}

var doctorlist = new DoctorList();
var body = doctorlist.generateBodyJson();
body.onLoad = doctorlist.onLoad;
body.setSelectedDepartment = doctorlist.setSelectedDepartment;
Page(body)
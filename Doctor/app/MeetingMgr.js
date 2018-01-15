import { ApiConfig} from "../apis/apiconfig.js";
import {MeetingApi} from "../apis/meeting.api";

export class MeetingMgr{
  meetings=[];
  createMeeting(id, receivecallback) {
    if (this.meetings[id]==undefined){
      var task = setInterval(function(){},function(){
        var meetingapi = new MeetingApi();
        meetingapi.chating({},function(data){
          receivecallback(id, data);
        });
      },1000);
      var meeting = {
        id: id,
        task: task
      };
      this.meetings[id] = meeting;
      return meeting;
    }else{
      return this.meetings[id];
    }
  }
}
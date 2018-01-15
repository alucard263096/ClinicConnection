import { ApiConfig} from "../apis/apiconfig.js";
import {MeetingApi} from "../apis/meeting.api";

export class MeetingMgr{
  meetings=[];
  createMeeting(id,page, receivecallback) {
    if (this.meetings[id] == undefined) {
      console.log(1);
      var task = setInterval(function(){
        var meetingapi = new MeetingApi();
        console.log(id);
        meetingapi.chating({ meeting_id: id},function(data){
          receivecallback(id, page, data);
        },false);
      },1000);
      var meeting = {
        id: id,
        task: task
      };
      this.meetings[id] = meeting;
      return meeting;
    } else {
      console.log(2);
      return this.meetings[id];
    }
  }
}
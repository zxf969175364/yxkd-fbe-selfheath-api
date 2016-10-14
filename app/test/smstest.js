
import sms from "../utils/sms"

sms.sendSMS('15810399968','怎么会UI是').then(function(msg){
    "use strict";
    console.log(msg)
}).catch(function(error){
    "use strict";
    console.log(error)
})
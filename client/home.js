import { UserInfo} from '../imports/api/userinfo.js'
import { Events } from '../imports/api/events.js'
import { Activities } from '../imports/api/activities.js'

if (Meteor.isClient) {
    $("body").off();

    Template.home.onRendered(function(){
        checkevents();
        $("li[data-template='saved'] a").on("click", function(){
            setTimeout(function(){
                checkevents();
            }, 40);
        });
    });
    
    $("body").on("click", "div #template #today-list .todo .complete", function(event){
        var action = $(event.target).closest(".todo").find(".list-group-item").html();
        var date = GetTodayDate()
        var faded = 0;
        $(".info").fadeOut(function(){
            if(faded == 0){
                faded ++;
                var myEvent = Events.findOne({"date": date, "text": action})
                var addedCarbon = myEvent.carbon
                var addedMoney = myEvent.money
                var currentUser = UserInfo.findOne({"userID": Meteor.user().emails[0].address})
                var carbonnumber = currentUser.carbon
                var moneynumber = currentUser.money
                carbonnumber += addedCarbon
                moneynumber += addedMoney
                Meteor.call('updateCarbon', currentUser.userID, carbonnumber)
                Meteor.call('updateMoney', currentUser.userID, moneynumber, function(error, result) {
                  Meteor.call('deleteTodayDate', action, date)
                  var completedEvent = "You completed the action - " + action;
                  var d = new Date();
                  var seconds = d.getTime() / 1000;
                  Activities.insert({"text": completedEvent, "date": date, "userID": Meteor.user().emails[0].address, "timestamp": seconds})
                });
                $(".info").fadeIn(function(){
                    $(event.target).closest(".todo").slideUp(function(){
                        checkevents();
                    });
                });
            }
        });
    });

    $("body").on("click", "div #template #today-list .todo .failed", function(event){
        var action = $(event.target).closest(".todo").find(".list-group-item").html();
        var date = GetTodayDate()
        $(event.target).closest(".todo").fadeOut(function(){
            Meteor.call('deleteTodayDate', action, date, function(){
                checkevents();
            });
        });
    });

    function GetTodayDate() {
       var tdate = new Date();
       var dd = tdate.getDate(); //yields day
       if (dd<10) {
          dd = "0" + dd
       }
       var MM = tdate.getMonth(); //yields month
       if (MM<10) {
          MM = "0" + (MM+1)
       }
       var yyyy = tdate.getFullYear(); //yields year
       var xxx = yyyy + "-" + MM + "-" + dd;

       return xxx;
    }
}

function checkevents(){
    var noevents = "<p class = 'none'>No tasks today! Go to Actions to make a difference.</p>"
    if($("#today-list").children().length == 0){
        $("#today-list").append(noevents);
        $(".none").fadeIn();
    }
}

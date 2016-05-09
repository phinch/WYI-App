import { UserInfo} from '../imports/api/userinfo.js'
import { Events } from '../imports/api/events.js'

if (Meteor.isClient) {
    //TODO: On .complete button click, change the CO2 and money values and remove event
    //TODO: On .failed button click, just remove the actions
    //TODO: Fluff it up with some animation and CSS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    console.log("home client");
    $("body").off();

    Template.home.onRendered(function(){
        checkevents();
    });
    
    $("body").on("click", "div #template #today-list .todo .complete", function(event){
        $(event.target).closest(".todo").slideUp(); //woosh
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
                console.log(carbonnumber)
                console.log(moneynumber)
                Meteor.call('updateCarbon', currentUser.userID, carbonnumber)
                Meteor.call('updateMoney', currentUser.userID, moneynumber, function(error, result) {
                  console.log(result)
                  console.log(error)
                  Meteor.call('deleteTodayDate', action, date)
                });
                $(".info").fadeIn();
            }
            checkevents();
        });
    });

    $("body").on("click", "div #template #today-list .todo .failed", function(event){
        $(event.target).closest(".todo").fadeOut(function(){
            checkevents();
        });
        var action = $(event.target).closest(".todo").find(".list-group-item").html();
        var date = GetTodayDate()
        Meteor.call('deleteTodayDate', action, date)
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
        console.log("appending")
        $("#today-list").append(noevents);
        $(".none").fadeIn();
    }
}

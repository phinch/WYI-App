import { Events } from '../imports/api/events.js'
import { Activities } from '../imports/api/activities.js'

if (Meteor.isClient) {

    Template.reminders.onRendered( () => {
        var clicks = 0;
        var timer;
        $( '#events-calendar' ).fullCalendar({
             events: function(start, end, timezone, callback) {

                var events = [];
                eventlist = Events.find({}).fetch();
                for (i=0; i<eventlist.length; i++) {
                    events.push({
                        title: eventlist[i].text,
                        start: eventlist[i].date,
                        id: eventlist[i]._id
                    });
                }
                callback(events);
            },

            eventClick: function(calEvent, jsEvent, view) {
/*                Meteor.call('deleteEvent', calEvent, function(error, result){
                    $('#events-calendar').fullCalendar( 'refetchEvents' );
                    
                    }   
                });*/
                clicks++;  //count clicks
                if(clicks === 1) {
                    timer = setTimeout(function() {
                        var eventclick = $(jsEvent.target).closest("td");
                        var thisday = eventclick.index();
                        var thisweek = eventclick.closest(".fc-week").index();
                        var findweek = $(".fc-day-grid .fc-week").eq(thisweek);
                        console.log(findweek[0]);
                        var findday = $(findweek).find(".fc-bg table tbody tr .fc-day").eq(thisday);
                        var date = findday.attr("data-date");
                        popit(date); 
                        clicks = 0;             //after action performed, reset counter
                    }, 500);
                } else {
                    clearTimeout(timer);    //prevent single-click action
                    Meteor.call('deleteEvent', calEvent, function(error, result){
                        $('#events-calendar').fullCalendar( 'refetchEvents' );
                        var included = Events.findOne({"text": calEvent.title})
                         if (included === undefined) {
                            Meteor.call('deleteActivity', calEvent.title)
                        }
                    });
                    clicks = 0;             //after action performed, reset counter
                }
            },

            height: $("#outer").height() - 20
        });

        $(".fc-prev-button").css("border-radius", "12px 0 0 12px");
        $(".fc-next-button").css("border-radius", "0 12px 12px 0");

        //CLICK EVENTS
        $("#outer").on("click", "#template #events-calendar .fc-view-container .fc-view table .fc-body tr .fc-widget-content .fc-scroller .fc-day-grid .fc-week .fc-bg table tbody tr .fc-day", function(event){
            var date = $(event.target).attr("data-date");
            popit(date);
        });
        $("#outer").on("click", "#template #events-calendar .fc-view-container .fc-view table .fc-body tr .fc-widget-content .fc-scroller .fc-day-grid .fc-week .fc-content-skeleton table thead tr .fc-day-number", function(event){
            var date = $(event.target).attr("data-date");
            popit(date);
        });

        $("#outer").on("click", "#template #events-calendar .fc-view-container .fc-view table .fc-body tr .fc-widget-content .fc-scroller .fc-day-grid .fc-week .fc-content-skeleton table tbody tr td:not(.fc-event-container)", function(event){
            var eventclick = $(event.target).closest("td");
            if(eventclick.attr("class") != ".fc-event-container"){ //We have a separate event handler for clicking an fc-event
                var thisday = eventclick.index();
                var thisweek = eventclick.closest(".fc-week").index();
                var findweek = $(".fc-day-grid .fc-week").eq(thisweek);
                console.log(findweek[0]);
                var findday = $(findweek).find(".fc-bg table tbody tr .fc-day").eq(thisday);
                var date = findday.attr("data-date");
                popit(date);
            }
        });

        //HOVER EVENTS
        $("#outer").on("mouseover", "#template #events-calendar .fc-view-container .fc-view table .fc-body tr .fc-widget-content .fc-scroller .fc-day-grid .fc-week .fc-bg table tbody tr .fc-day", function(event){
            console.log("hovering...");
            var eventclick = $(event.target);
            var thisday = eventclick.index();
            var thisweek = eventclick.closest(".fc-week").index();
            var findweek = $(".fc-day-grid .fc-week").eq(thisweek);
            var findtbody = $(findweek).find(".fc-content-skeleton table tbody");
            hoverbubble(findtbody, thisday);
        });
    });
    
    Tracker.autorun(function() {
        $('#events-calendar').fullCalendar('refetchEvents');
    });
}

function popit(date){
    //Reset
    $("#blackscreen").off("click");
    $(".popup").remove();
    $("#popup").off("click");
    //$(".fc-day").css("background", "white");

    $("#blackscreen").fadeIn();
    $("#popup").fadeIn();

    //TODO: Convert to formatted date
    $("#popup .title").html($("#popup .title").html() + date);
    $("#blackscreen").on("click", function(event){
        $("#popup").fadeOut(function(){
            $("#popup .title").html("Add a new action: ");
        });
        $("#blackscreen").fadeOut();
    });

    $("#popup").on("click", "#actions .listactions .description .submit", function(event){
        params = { 
            "text": $("#popup #actiontitle").html(),
            "date": date
        }
        var included = Events.findOne({"text": $("#popup #actiontitle").html(), "date": date})
        if (included === undefined) {
            Meteor.call('addEvent', params, function(error, result) {
                $('#events-calendar').fullCalendar( 'refetchEvents' );
            });
            $("#popup").fadeOut(function(){
                $("#popup .title").html("Add a new action: ");
            });
            $("#blackscreen").fadeOut();
        }
        else {
            alert("This action is already present on the selected date.")
        }  
    });
}

function hoverbubble(tbody, thisday){
    //Get a list of actions for that day
    //Note: pass in the tbody above the trs containing the actions and the index of the day
    var children = tbody.children(); //Each child is a tr.
    var firsttr = children[0];
    
}

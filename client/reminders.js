import { Events } from '../imports/api/events.js'
import { Activities } from '../imports/api/activities.js'

if (Meteor.isClient) {
    Template.reminders.onRendered( () => {
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
                Meteor.call('deleteEvent', calEvent, function(error, result){
                    $('#events-calendar').fullCalendar( 'refetchEvents' );
                    var included = Events.findOne({"text": calEvent.title})
                    if (included === undefined) {
                    Meteor.call('deleteActivity', calEvent.title)
                    }   
                });
            },

            height: $("#outer").height() - 20
        });
        $(".fc-day").on("click", function(event){
            //Reset
            $("#blackscreen").off("click");
            $(".popup").remove();
            $("#popup").off("click");
            $(".fc-day").css("background", "white");
            //Turn yellow
            $(event.target).css("background", "#fcf8e3");

            $("#blackscreen").fadeIn();
            $("#popup").fadeIn();

            //TODO: Convert to formatted date
            $("#popup .title").html($("#popup .title").html() + $(event.target).attr("data-date"));
            var date = $(event.target).attr("data-date");
            $("#blackscreen").on("click", function(event){
                $("#popup").fadeOut();
                $("#blackscreen").fadeOut();
                $("#popup .title").html("Add a new action: ");
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
                    $("#popup").fadeOut();
                    $("#blackscreen").fadeOut();
                    $("#popup .title").html("Add a new action: ");
                }
                else {
                    alert("This action is already present on the selected date.")
                }      
            });
        });
        $(".fc-prev-button").css("border-radius", "12px 0 0 12px");
        $(".fc-next-button").css("border-radius", "0 12px 12px 0");

        $("#outer").on("click", "#template #events-calendar .fc-view-container .fc-view table .fc-body tr .fc-widget-content .fc-scroller .fc-day-grid .fc-week .fc-bg table tbody tr .fc-day", popit);
        $("#template #events-calendar .fc-view-container .fc-view table .fc-body tr .fc-widget-content .fc-scroller .fc-day-grid .fc-week .fc-content-skeleton table thead tr .fc-day-number").on("click", popit);

    });
    
    Tracker.autorun(function() {
        $('#events-calendar').fullCalendar('refetchEvents');
    });
}

function popit(event){
    //Reset
    $("#blackscreen").off("click");
    $(".popup").remove();
    $("#popup").off("click");
    $(".fc-day").css("background", "white");
    //Turn yellow

    //$('.fc-day[data-customerID='+$(event.target).attr("data-date")+']').css("background", "#fcf8e3");

    $("#blackscreen").fadeIn();
    $("#popup").fadeIn();

    //TODO: Convert to formatted date
    $("#popup .title").html($("#popup .title").html() + $(event.target).attr("data-date"));
    var date = $(event.target).attr("data-date");
    $("#blackscreen").on("click", function(event){
        $("#popup").fadeOut();
        $("#blackscreen").fadeOut();
        $("#popup .title").html("Add a new action: ");
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
            $("#popup").fadeOut();
            $("#blackscreen").fadeOut();
            $("#popup .title").html("Add a new action: ");
        }
        else {
            alert("This action is already present on the selected date.")
        }  
    });
}

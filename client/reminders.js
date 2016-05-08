import { Events } from '../imports/api/events.js'

if (Meteor.isClient) {
    Template.reminders.onRendered( () => {
        $( '#events-calendar' ).fullCalendar({
             events: function(start, end, timezone, callback) {

                var events = [];
                eventlist = Events.find({}).fetch();
                for (i=0; i<eventlist.length; i++) {
                    events.push({
                        title: eventlist[i].text,
                        start: eventlist[i].date
                    });
                }
                callback(events);
            },
            height: $("#outer").height() - 20
        });

        $(".fc-prev-button").css("border-radius", "12px 0 0 12px");
        $(".fc-next-button").css("border-radius", "0 12px 12px 0");

        $("#outer").on("click", "#template #events-calendar .fc-view-container .fc-view table .fc-body tr .fc-widget-content .fc-scroller .fc-day-grid .fc-week .fc-bg table tbody tr .fc-day", popit);
        $("#template #events-calendar .fc-view-container .fc-view table .fc-body tr .fc-widget-content .fc-scroller .fc-day-grid .fc-week .fc-content-skeleton table thead tr .fc-day-number").on("click", popit);
        //TODO: new fcday click
        //TODO: event click

        console.log($("#events-calendar"));
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
        Meteor.call('addEvent', params, function(error, result) {
            $('#events-calendar').fullCalendar( 'refetchEvents' );
        });
        console.log(params)
    });
}

import { Events } from '../imports/api/events.js'

if (Meteor.isClient) {
    Template.reminders.onRendered( () => {
        $( '#events-calendar' ).fullCalendar({
             events: function(start, end, timezone, callback) {
                callback(Events.find({}).fetch());
            },

            height: $("#outer").height() - 20
        });

        $(".fc-day").on("click", function(event){
            //Reset
            $("#blackscreen").off("click");
            $(".popup").remove();
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
                Meteor.call('addEvent', params, function(error, result) {
                    $('#calendar').fullCalendar( 'refetchEvents' );
                });
                console.log(params)
            });
        });

        console.log($("#events-calendar"));
    });
}

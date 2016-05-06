Template.reminders.onRendered( () => {
    $( '#events-calendar' ).fullCalendar();

    $(".fc-day").on("click", function(event){
        $(event.target).css("background", "black");
    });

    console.log($("#events-calendar"));
});

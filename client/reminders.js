Template.reminders.onRendered( () => {
    $( '#events-calendar' ).fullCalendar();

    $(".fc-day").on("click", function(event){
        //Reset
        $("#blackscreen").off("click");
        $(".popup").remove();
        $(".fc-day").css("background", "white");
        //Turn yellow
        $(event.target).css("background", "#fcf8e3");

        $("#blackscreen").fadeIn();
        $("#popup").fadeIn();
        console.log($(event.target).attr("data-date"));
        //TODO: Convert to formatted date
        $("#popup .title").html($("#popup .title").html() + $(event.target).attr("data-date"));
        
        console.log(Template.list_actions);

        $("#blackscreen").on("click", function(event){
            $("#popup").fadeOut();
            $("#blackscreen").fadeOut();
            $("#popup .title").html("Add a new action: ");
        });
    });

    console.log($("#events-calendar"));
});

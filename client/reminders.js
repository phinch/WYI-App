Template.reminders.onRendered( () => {
    $( '#events-calendar' ).fullCalendar();

    $(".fc-day").on("click", function(event){
        $(".popup").remove();
        $(".fc-day").css("background", "white");
        //Turn yellow
        $(event.target).css("background", "#ffeef8");

        $("body").append("<div id = 'blackscreen'></div>");
        $("#popup").show();
        console.log($(event.target).attr("data-date"));
        //TODO: Convert to formatted date
        $("#popup .title").html($("#popup .title").html() + $(event.target).attr("data-date"));
        
        console.log(Template.list_actions);
    });

    console.log($("#events-calendar"));
});

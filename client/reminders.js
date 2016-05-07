Template.reminders.onRendered( () => {
    $( '#events-calendar' ).fullCalendar();

    $(".fc-day").on("click", function(event){
        $(".popup").remove();
        $(".fc-day").css("background", "white");
        //Turn yellow
        $(event.target).css("background", "#ffeef8");
        
        //Popup div
        $(event.target).append("<div class = 'popup'>"+Template.list_actions.renderFunction+"</div>");
        console.log(Template.list_actions);
    });

    console.log($("#events-calendar"));
});

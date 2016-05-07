Template.list_actions.onRendered( () => {
    $( '#action-calendar' ).fullCalendar();

    $(".fc-day").on("click", function(event){
        $(event.target).css("background", "black");
    });

    console.log($("#events-calendar"));
});

if (Meteor.isClient) {
    //TODO: On .complete button click, change the CO2 and money values and remove event
    //TODO: On .failed button click, just remove the actions
    //TODO: Fluff it up with some animation and CSS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    console.log("home client");
    $("body").off();
    
    $("body").on("click", "div #template #today-list .todo .complete", function(event){
        $(event.target).closest(".todo").slideUp(); //woosh
        var action = $(event.target).closest(".todo").find(".list-group-item").html();
        var date = GetTodayDate()
        Meteor.call('deleteTodayDate', action, date)
        var faded = 0;
        $(".info").fadeOut(function(){
            if(faded == 0){
                faded ++;
                $(".carbon").html((parseInt($(".carbon").html().split('t')[0]) + 2)+"t");
                $(".money").html('$' + (parseInt($(".money").html().split('$')[1].replace(/,/g, "")) + 123).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                $(".info").fadeIn();
            }
        });
    });

    $("body").on("click", "div #template #today-list .todo .failed", function(event){
        $(event.target).closest(".todo").fadeOut(); //woosh
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


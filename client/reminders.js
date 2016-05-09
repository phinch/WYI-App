import { Events } from '../imports/api/events.js'
import { Activities } from '../imports/api/activities.js'

if (Meteor.isClient) {

    Template.reminders.onRendered( () => {
        $("#outer").off();
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

            eventMouseover: function(calEvent, jsEvent, view){
                var date = getdate(jsEvent);
                var events = getevents(date);
                hoverbubble(date, events);
            },

            eventMouseout: function(calEvent, jsEvent, view){
                $(".dayevents").remove();
            },

            eventClick: function(calEvent, jsEvent, view) {
                clicks++;  //count clicks
                if(clicks === 1) {
                    timer = setTimeout(function() {

                        var date = getdate(jsEvent);
                        popit(date); 
                        clicks = 0;             //after action performed, reset counter
                    }, 300);
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

        $("#outer").on("click", "#template #events-calendar .fc-view-container .fc-view table .fc-body tr .fc-widget-content .fc-scroller .fc-day-grid .fc-week .fc-content-skeleton table tbody tr td", function(event){
            var date = getdate(event);
            popit(date);
        });

        $("#outer").on("click", "#template #events-calendar .fc-view-container .fc-view table .fc-body tr .fc-widget-content .fc-scroller .fc-day-grid .fc-week .fc-content-skeleton table tbody tr td a", function(event){
            event.stopPropogation();
        });
         

        //HOVER EVENTS
        $("#outer").on("mouseover", "#template #events-calendar .fc-view-container .fc-view table .fc-body tr .fc-widget-content .fc-scroller .fc-day-grid .fc-week .fc-bg table tbody tr .fc-day", function(event){
            var date = $(event.target).attr("data-date");
            var events = getevents(date);
            hoverbubble(date, events);
        });

        $("#outer").on("mouseover", "#template #events-calendar .fc-view-container .fc-view table .fc-body tr .fc-widget-content .fc-scroller .fc-day-grid .fc-week .fc-content-skeleton table thead tr .fc-day-number", function(event){
            var date = $(event.target).attr("data-date");
            var events = getevents(date);
            hoverbubble(date, events);
        });

        $("#outer").on("mouseover", "#template #events-calendar .fc-view-container .fc-view table .fc-body tr .fc-widget-content .fc-scroller .fc-day-grid .fc-week .fc-content-skeleton table tbody tr td", function(event){
            var date = getdate(event);
            var events = getevents(date);
            hoverbubble(date, events);
        });

        $("#outer").on("mouseleave", "#template #events-calendar .fc-view-container .fc-view table .fc-body tr .fc-widget-content .fc-scroller .fc-day-grid .fc-week .fc-bg table tbody tr .fc-day", function(event){
            hoverbubble(null, [null]);
        });

        $("#outer").on("mouseleave", "#template #events-calendar .fc-view-container .fc-view table .fc-body tr .fc-widget-content .fc-scroller .fc-day-grid .fc-week .fc-content-skeleton table tbody tr td", function(event){
            hoverbubble(null, [null]);
        });

        $("#outer").on("mouseleave", "#template #events-calendar .fc-view-container .fc-view table .fc-body tr .fc-widget-content .fc-scroller .fc-day-grid .fc-week .fc-content-skeleton table thead tr .fc-day-number", function(event){
            hoverbubble(null, [null]);
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
    $("#blackscreen").height($(window).height());
    $("#blackscreen").width($(window).width());
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
            "date": date,
            "carbon": parseInt($("#popup #carbonsave").html().split(' ')[4]),
            "money": parseInt($("#popup #moneysave").html().split('$')[1])
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

function getdate(event){
    var eventclick = $(event.target).closest("td");
    var thisweek = eventclick.closest(".fc-week").index();
    var findweek = $(".fc-day-grid .fc-week").eq(thisweek);
    
    var mytr = eventclick.closest("tr").index();
    var alltrs = eventclick.closest("tbody");
    var row = [0, 1, 2, 3, 4, 5, 6];

    for(var i = 0; i < mytr; i++){
        var thistr = $(alltrs).find("tr").eq(i);
        for(var j = 0; j < thistr.children().length; j++){
            var td = $(thistr).find("td").eq(j);
            if(td.attr("rowspan") != undefined){
                row.splice(row.indexOf(j),1);
            }
        }
    }

    var thisday = row[eventclick.closest("td").index()];

    var findday = $(findweek).find(".fc-bg table tbody tr .fc-day").eq(thisday);
    return findday.attr("data-date");
}

function getevents(date){
    $(".dayevents").remove();
    //First, find the index of the day and week
    var thisday = $(".fc-day[data-date = "+date+"]");
    var dayindex = thisday.index();
    var thisweek = thisday.closest(".fc-week");
    var weekindex = thisweek.index();

    //Then, get the tbody belonging to the week
    var tbody = thisweek.find(".fc-content-skeleton table tbody");

    //Similar to getdate above, we'll iterate through the trs, but will pick up events from the dayindex each step of the way
    var row = [0, 1, 2, 3, 4, 5, 6];
    var events = [];

    var trcount = 0;
    var end = false;
    while(!end){
        var tr = $(tbody).find("tr").eq(trcount);
        if(!(0 in tr)){
            end = true;
            continue;
        }
        //If dayindex is still in row, we have an event to add; specifically, that element is at the td with indexOf(dayindex)
        //If dayindex is not in row, we have extracted all events
        if(row.indexOf(dayindex) != -1){
            var td = $(tr).find("td").eq(row.indexOf(dayindex));
            events.push($(td).find("a span").html());
            trcount++;
        }else{
            end = true;
            continue;
        }

        //Now filter by the same rowspan search used in getdate
        for(var j = 0; j < tr.children().length; j++){
            var td = $(tr).find("td").eq(j);
            if(td.attr("rowspan") != undefined){
                row.splice(row.indexOf(j),1);
            }
        }
    }
    return events;
}

function hoverbubble(date, events){
    if(events[0] != undefined && !(0 in $(".dayevents"))){
        $("body").append("<div class = 'dayevents'></div>")
        $(".dayevents").append("<h2 class = 'date'>"+date+"</h2>");
        for(i in events){
            $(".dayevents").append("<p class = 'dayevent'>"+events[i]+"</p>");
        }
        var height = 80+events.length*20;
        var dayy = $(".fc-day[data-date="+date+"]").offset()["top"];
        var dayx = $(".fc-day[data-date="+date+"]").offset()["left"];
        var dayheight = $(".fc-day[data-date="+date+"]").height();
        var daywidth = $(".fc-day[data-date="+date+"]").width();
        $(".dayevents").attr("minheight", dayy);
        $(".dayevents").attr("maxheight", dayy+dayheight);
        $(".dayevents").attr("minwidth", dayx);
        $(".dayevents").attr("maxwidth", dayx+daywidth);
        $(".dayevents").css("top", dayy-((height-92)/2));
        $(".dayevents").css("left", dayx+daywidth+10);
        $(".dayevents").css("height", height);
    }else if(0 in $(".dayevents")){
        var x = event.pageX;
        var y = event.pageY;
        var minheight = $(".dayevents").attr("minheight");
        var maxheight = $(".dayevents").attr("maxheight");
        var minwidth = $(".dayevents").attr("minwidth");
        var maxwidth = $(".dayevents").attr("maxwidth");
        if(x < minwidth || x > maxwidth || y < minheight || y > maxheight){
            $(".dayevents").remove();
        }
    }
}

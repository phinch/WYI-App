import { Events } from '../imports/api/events.js'
import { Activities } from '../imports/api/activities.js'

if (Meteor.isClient) {
    function makeDraggable() {
        $('#calendar .fc-event').each(function() {
            $(this).draggable({
                zIndex: 999,
                revert: true,      // will cause the event to go back to its
                revertDuration: 0  //  original position after the drag
            });

        });
    }
    console.log("actions calendar");
	Template.action_calendar.rendered = function(){
        setTimeout(function(){
	        var clicks = 0;
            var timer;

	        var name = $('#name').html()
	        $('#calendar').fullCalendar({
		        events: function(start, end, timezone, callback) {

                    var events = [];
                    eventlist = Events.find({"text": name}).fetch();
                    for (i=0; i<eventlist.length; i++) {
                        events.push({
                            title: eventlist[i].text,
                            start: eventlist[i].date,
                            end: eventlist[i].date,
                            id: eventlist[i]._id
                        });
                    }
                    console.log("made it here", events, callback);
                    callback(events)
                    console.log("made it Here");
                },
                eventClick: function(calEvent, jsEvent, view) {
                	clicks++;  //count clicks
                    if(clicks === 1) {
                        timer = setTimeout(function() {
                            clicks = 0;
                        }, 500);
                    } else {
                        clearTimeout(timer);    //prevent single-click action
                        Meteor.call('deleteEvent', calEvent, function(error, result){
                            $('#calendar').fullCalendar( 'refetchEvents' );
                            var included = Events.findOne({"text": calEvent.title})
                            if (included === undefined) {
                                Meteor.call('deleteActivity', calEvent.title)
                            }
                        });
                        clicks = 0;//after action performed, reset counter
                    }
                },
             
		        height: 400
            });
	        $('.description').on("click", "#calendar .fc-view-container .fc-view table .fc-body tr .fc-widget-content .fc-scroller .fc-day-grid .fc-week .fc-bg table tbody tr .fc-day", function(event){
		        var dateClicked = $(event.target).attr("data-date");

		        params = {
		              "text": name,
		              "date": dateClicked
		        }

		        var included = Events.findOne({"text": name, "date": dateClicked})
            	if (included === undefined) {
              		Meteor.call('addEvent', params, function(error, result) {
		            	$('#calendar').fullCalendar( 'refetchEvents' );
                        makeDraggable();
			        });
                }
	        });

	        $('.description').on("click", "#calendar .fc-view-container .fc-view table .fc-body tr .fc-widget-content .fc-scroller .fc-day-grid .fc-week .fc-content-skeleton table thead tr .fc-day-number", function(event){
		        var dateClicked = $(event.target).attr("data-date");

		        params = {
		              "text": name,
		              "date": dateClicked
		        }

		        var included = Events.findOne({"text": name, "date": dateClicked})
            	if (included === undefined) {
              		Meteor.call('addEvent', params, function(error, result) {
		            	$('#calendar').fullCalendar( 'refetchEvents' );
                        makeDraggable();
			        });
                }
	        });

            $('#calendar .fc-event').each(function() {
                $(this).draggable({
                    zIndex: 999,
                    revert: true,      // will cause the event to go back to its
                    revertDuration: 0  //  original position after the drag
                });
            });

	        $('.description').on("click", "#calendar .fc-view-container .fc-view table .fc-body tr .fc-widget-content .fc-scroller .fc-day-grid .fc-week .fc-content-skeleton table tbody tr td", function(event){
		        var dateClicked = getdate(event);

		        params = {
		              "text": name,
		              "date": dateClicked
		        }

		        var included = Events.findOne({"text": name, "date": dateClicked})
            	if (included === undefined) {
              		Meteor.call('addEvent', params, function(error, result) {
		            	$('#calendar').fullCalendar( 'refetchEvents' );
                        makeDraggable();
			        });
                }
	        });

        }, 50);
    }
}

function getdate(event){
    var eventclick = $(event.target).closest("td");
    var thisweek = eventclick.closest(".fc-week").index();
    var findweek = $(".fc-day-grid .fc-week").eq(thisweek);
    
    var mytr = eventclick.closest("tr").index();
    var alltrs = eventclick.closest("tbody");
    var row = [0, 1, 2, 3, 4, 5, 6];

    console.log(alltrs, mytr);

    for(var i = 0; i < mytr; i++){
        var thistr = $(alltrs).find("tr").eq(i);
        for(var j = 0; j < thistr.children().length; j++){
            var td = $(thistr).find("td").eq(j);
            if(td.attr("rowspan") != undefined){
                row.splice(row.indexOf(j),1);
            }
        }
        console.log(row);
    }

    var thisday = row[eventclick.closest("td").index()];
    console.log(thisday);

    var findday = $(findweek).find(".fc-bg table tbody tr .fc-day").eq(thisday);
    return findday.attr("data-date");
}

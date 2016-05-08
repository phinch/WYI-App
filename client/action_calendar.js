import { Events } from '../imports/api/events.js'
import { Activities } from '../imports/api/activities.js'

if (Meteor.isClient) {
	Template.actions_calendar.rendered = function(){
		
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
                        id: eventlist[i]._id
                    });
                }
                callback(events);
            },
            eventClick: function(calEvent, jsEvent, view) {
            	clicks++;  //count clicks
                if(clicks === 1) {
                    timer = setTimeout(function() {
/*                        var eventclick = $(jsEvent.target).closest("td");
                        var thisday = eventclick.index();
                        var thisweek = eventclick.closest(".fc-week").index();
                        var findweek = $(".fc-day-grid .fc-week").eq(thisweek);
                        console.log(findweek[0]);
                        var findday = $(findweek).find(".fc-bg table tbody tr .fc-day").eq(thisday);
                        var date = findday.attr("data-date");
                        popit(date); */
                        clicks = 0;             //after action performed, reset counter
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
                    clicks = 0;             //after action performed, reset counter
                }
            },
         
			height: 200
	/*		windowResize: function(view) {
	            	alert("boo!")
			    	},*/
	    });
		$('.fc-day').on("click", function(event){
			var dateClicked = $(event.target).attr("data-date");

			params = {
			      "text": name,
			      "date": dateClicked
			}

			var included = Events.findOne({"text": name, "date": dateClicked})
        	if (included === undefined) {
          		Meteor.call('addEvent', params, function(error, result) {
			    	$('#calendar').fullCalendar( 'refetchEvents' );
				});
        	}	
			

			/*if (date.hasClass("clicked") === false){
				date.addClass("clicked");
				date.css("background", "black");
				var dateClicked = date.attr("data-date");
				dates.push(dateClicked)

			} else {
				date.removeClass("clicked");
				date.css("background", "white");
				var dateClicked = date.attr("data-date");
				var index = dates.indexOf(dateClicked);
				dates.splice(index, 1);

				}*/
		});

		//Todo: Remove duplicates
		/*$('.submit').on("click", function() {
			for (i = 0; i<dates.length; i++) {
				params = {
			      "text": name,
			      "date": dates[i]
			    }
			    Meteor.call('addEvent', params, function(error, result) {
			        $('#calendar').fullCalendar( 'refetchEvents' );
			    });
			    console.log(params)
				}
				$(".fc-day").css("background", "white")
				$(".fc-today").css("background", "#fcf8e3")
			});*/
		}
	}
import { Events } from '../imports/api/events.js'
/*Template.dropdown_example.helpers({
	options: function() {
        return {
            height: 200,
            windowResize: function(view) {
            	alert("boo!")
		    	},
		    dayClick: function(date, jsEvent, view) {
		    	alert('Clicked on: ' + date.format());

			    alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);

			    alert('Current view: ' + view.name);

		        $(this).css('background', 'red');
			}
        }
    }
});
*/
if (Meteor.isClient) {
	Template.actions_calendar.rendered = function(){
		dates = []
		
		var name = $('#name').html()
		$('#calendar').fullCalendar({
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
            eventClick: function(calEvent, jsEvent, view) {
            	Meteor.call('deleteEvent', calEvent, function(error, result){
            		$('#calendar').fullCalendar( 'refetchEvents' );
            	});
            },

			height: 200
	/*		windowResize: function(view) {
	            	alert("boo!")
			    	},*/
	    });
		$('.fc-day').on("click", function(event){
			var date = $(event.target)

			if (date.hasClass("clicked") === false){
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

				}
			});

		//Todo: Remove duplicates
		$('.submit').on("click", function() {
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
			});
		}
	}
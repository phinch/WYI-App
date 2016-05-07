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

Template.actions_calendar.rendered = function(){
	dates = []
	$('#calendar').fullCalendar({

		height: 200,
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
			console.log(dates)
		} else {
			date.removeClass("clicked");
			date.css("background", "white");
			var dateClicked = date.attr("data-date");
			var index = dates.indexOf(dateClicked);
			dates.splice(index, 1);
			console.log(dates)
			}
		});
	}
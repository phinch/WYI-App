import { Meteor } from 'meteor/meteor';
import { Actions } from '../imports/api/actions.js'
import { Events } from '../imports/api/events.js'
import '../imports/api/activities.js'

Meteor.startup(() => {
  // code to run on server at startup
  return Meteor.methods({

      closeAll: function() {
        return Actions.update({}, {$set: {status:null}}, {multi: true});
      },

      addEvent: function(params) {
      	return Events.insert(params);
      }

    });
});

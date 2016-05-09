import { Meteor } from 'meteor/meteor';
import { Actions } from '../imports/api/actions.js'
import { Events } from '../imports/api/events.js'
import { Activities} from '../imports/api/activities.js'
import { UserInfo} from '../imports/api/userinfo.js'

Meteor.startup(() => {
  // code to run on server at startup
  return Meteor.methods({

      closeAll: function() {
        return Actions.update({}, {$set: {status:null}}, {multi: true});
      },

      addEvent: function(params) {
      	return Events.insert(params);
      },

      insertUser: function(params) {
      	return UserInfo.insert(params);
      },

      updateCarbon: function(user, carbon) {
      	return UserInfo.update({"userID": user}, {$set:{"carbon": carbon}})
      },

      updateMoney: function(user, money) {
        return UserInfo.update({"userID": user}, {$set:{"money": money}})
      },

      fetchEvents: function() {
      	return Events.find({});
      },

      fetchEventsDate: function(date) {
      	return Events.find({"date": date})
      },

      deleteEvent: function(event) {
      	return Events.remove({"_id": event.id})
      },

      deleteTodayDate: function(text, date) {
      	return Events.remove({"text": text, "date": date})
      },

      deleteActivity: function(text) {
      	return Activities.remove({"text": text})
      }
    });
});

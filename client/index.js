import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Activities}  from '../imports/api/activities.js';
import { Actions } from '../imports/api/actions.js'
import { Events } from '../imports/api/events.js'
import './index.html';

if (Meteor.isClient) {
    Template.register.events({
        'submit form': function(event) {
            event.preventDefault();
            var emailVar = event.target.registerEmail.value;
            var passwordVar = event.target.registerPassword.value;
            Accounts.createUser({
                email: emailVar,
                password: passwordVar
            });
        }
    });

    Template.login.events({
    'submit form': function(event) {
        event.preventDefault();
        var emailVar = event.target.loginEmail.value;
        var passwordVar = event.target.loginPassword.value;
        Meteor.loginWithPassword(emailVar, passwordVar);
      }
    });
    Template.loggedin.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
    }
  });
}
Template.index.onCreated(function helloOnCreated() {
  this.currentTab = new ReactiveVar( "home" );
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

Template.index.helpers({
  tab: function() {
    return Template.instance().currentTab.get();
  },
  tabData: function() {
    var tab = Template.instance().currentTab.get();
    var now = GetTodayDate();
    var data = {
      "home": Events.find({"date": now}),
    };
    console.log(data[tab])
    console.log(tab)
    return { contentType: tab, items: data[tab] }
  }
});

Template.index.events({
  'click .nav-pills li': function( event, template ) {
    var currentTab = $( event.target ).closest( "li" );

    currentTab.addClass( "active" );
    $( ".nav-pills li" ).not( currentTab ).removeClass( "active" );

    template.currentTab.set( currentTab.data( "template" ) );
  },

  /*'click': function() {
        Session.set('dropdown', null);
    }
*/});

Template.dashboard.onCreated(function OnCreated() {
  this.currentTab2 = new ReactiveVar( "activities" );
});

Template.dashboard.helpers({
  tab: function() {
    return Template.instance().currentTab2.get();
  },
  tabData: function() {
    var tab = Template.instance().currentTab2.get();

    var data = {
      "actions": Activities.find({}),
    };

    return { contentType: tab, items: data[tab] };
  }
});

Template.dashboard.events({
  'click .nav-pills2 li': function( event, template ) {
    var currentTab2 = $( event.target ).closest( "li" );

    currentTab2.addClass( "active" );
    $( ".nav-pills2 li" ).not( currentTab2 ).removeClass( "active" );

    template.currentTab2.set( currentTab2.data( "template" ) );
  }
});

Template.myprofile.onCreated(function OnCreated() {
  this.currentTab2 = new ReactiveVar( "about" );
});

Template.myprofile.helpers({
  tab: function() {
    return Template.instance().currentTab2.get();
  },
  tabData: function() {
    var tab = Template.instance().currentTab2.get();

    var data = {
      "about": [
        { "name": "Seeking Wisdom: From Darwin to Munger", "creator": "Peter Bevelin" }
      ],
      "travel": [
        { "name": "Ghostbusters", "creator": "Dan Aykroyd" },
      ],
      "home": [
        { "name": "bleh", "creator": "bleh" },
      ],
      "food": [
        { "name": "Grand Theft Auto V", "creator": "Rockstar Games" },
      ]
    };

    return { contentType: tab, items: data[tab] };
  }
});

Template.myprofile.events({
  'click .nav-pills2 li': function( event, template ) {
    var currentTab2 = $( event.target ).closest( "li" );

    currentTab2.addClass( "active" );
    $( ".nav-pills2 li" ).not( currentTab2 ).removeClass( "active" );

    template.currentTab2.set( currentTab2.data( "template" ) );
  }
});

Template.list_actions.helpers({
  myactions(){
    return Actions.find({});
  },
});

Template.remind_actions.helpers({
  myactions(){
    return Actions.find({});
  },
});


$(document).keyup(function(evt) {
    if (evt.keyCode === 27) {
        Meteor.call('closeAll');
    }
});


/*Template.dropdown_example.active = function () {
  return this.status === "active";
};*/

Template.dropdown_example.helpers({
  active(){
    return this.status==="active";
  }
})

Template.dropdown_example.events({

    'click li a': function(event, template) {
        event.preventDefault();
        event.stopPropagation(); 
        Meteor.call('closeAll');
        Actions.update(this._id, {$set: {status: "active"}});
    },

    'click .close button': function(event) {
        event.preventDefault();
        Actions.update(this._id, {$set: {status: null}});
    },

    'click .submit button': function(event) {
        event.preventDefault();
        var selected_activity = Actions.findOne({"_id": this._id})
        var included = Activities.findOne({"_id": selected_activity._id})
        if (included === undefined) {
          Activities.insert(selected_activity)
        }
    }

});

Template.reminder_example.helpers({
  active(){
    return this.status==="active";
  }
})

Template.reminder_example.events({

    'click li a': function(event, template) {
        event.preventDefault();
        event.stopPropagation(); 
        Meteor.call('closeAll');
        Actions.update(this._id, {$set: {status: "active"}});
    },

    'click .close': function(event) {
        event.preventDefault();
        Actions.update(this._id, {$set: {status: null}});
    },

    'click .submit': function(event) {
        event.preventDefault();
        var selected_activity = Actions.findOne({"_id": this._id})
        var included = Activities.findOne({"_id": selected_activity._id})
        if (included === undefined) {
          Activities.insert(selected_activity)
        }
    }

});

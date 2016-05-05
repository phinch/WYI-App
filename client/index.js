import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Activities}  from '../imports/api/activities.js';
import { Actions } from '../imports/api/actions.js'
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

Template.index.helpers({
  tab: function() {
    return Template.instance().currentTab.get();
  },
  tabData: function() {
    var tab = Template.instance().currentTab.get();

    /*var data = {
      "activities": [
        { "name": "Seeking Wisdom: From Darwin to Munger", "creator": "Peter Bevelin" }
      ],
      "actions": [
        { "name": "Ghostbusters", "creator": "Dan Aykroyd" },
      ],
      "reminders": [
        { "name": "Grand Theft Auto V", "creator": "Rockstar Games" },
      ]
    };*/
/*
    return { contentType: tab, items: data[tab] };*/
    return { contentType: tab}
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
      "activities": Activities.find({}),
      /*"activities": [
        { "name": "Seeking Wisdom: From Darwin to Munger", "creator": "Peter Bevelin" }
      ],*/
/*      "actions": [
        { "name": "Ghostbusters", "creator": "Dan Aykroyd" },
      ],
      "reminders": [
        { "name": "Grand Theft Auto V", "creator": "Rockstar Games" },
      ]*/
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


$(document).keyup(function(evt) {
    if (evt.keyCode === 27) {
        /*Actions.update({_id:Actions.find({status:"active"})['_id']}, {$set: {status:null}}, {multi: true});*/
    }
});


Template.dropdown_example.active = function () {
  return this.status === "active";
};

Template.dropdown_example.events({

    'click li a': function(event, template) {
        event.preventDefault();
        event.stopPropagation(); 
        Actions.update(this._id, {$set: {status: "active"}});
    },

    'click .close button': function(event) {
        event.preventDefault();
        Actions.update(this._id, {$set: {status: null}});
    },

    'click .submit button': function(event) {
      event.preventDefault();
      var selected_activity = Actions.findOne({"_id": this._id})
      Activities.insert(selected_activity)
    }

});
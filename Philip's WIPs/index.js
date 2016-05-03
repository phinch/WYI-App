import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

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
  this.currentTab = new ReactiveVar( "dashboard" );
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
  }
});

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
      "activities": [
        { "name": "Seeking Wisdom: From Darwin to Munger", "creator": "Peter Bevelin" }
      ],
      "actions": [
        { "name": "Ghostbusters", "creator": "Dan Aykroyd" },
      ],
      "reminders": [
        { "name": "Grand Theft Auto V", "creator": "Rockstar Games" },
      ]
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
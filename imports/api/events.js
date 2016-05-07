import { Mongo } from 'meteor/mongo';

export const Events = new Mongo.Collection( 'events' );

/*Events.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Events.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let EventsSchema = new SimpleSchema({
  'text': {
    type: String,
    label: 'The title of this action'
  },
  'date': {
    type: String,
    label: 'The date of the action'
  },
  'co2': {
    type: Number,
    label: 'How much CO2 the aciton will save.'
  },
  'money': {
    type: Number,
    label: 'How much money the action will save.'
  },
});

Events.attachSchema( EventsSchema );*/
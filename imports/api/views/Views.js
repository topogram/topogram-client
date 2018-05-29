import { Mongo } from 'meteor/mongo'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'

import { Nodes } from '../nodes/Nodes.js'

class ViewsCollection extends Mongo.Collection {

}

export const Views = new ViewsCollection('views')

// Deny all client-side updates since we will be using methods to manage this collection
Views.deny({
  insert() { return true },
  update() { return true },
  remove() { return true }
})

Views.schema = new SimpleSchema({
  _id : {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  topogramId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
    label : 'The ID of the reference topogram'
  },
  title : {
    type: String,
    label: 'The name of the topogram',
    optional: false
  },
  description : {
    type: String,
    label: 'A description of what the topogram is about',
    optional: true
  },
  sharedPublic : {
    type: Boolean,
    label : 'Indicates if a topogram is visible by anonymous users',
    defaultValue: false
  },
  // 'nodesPositions' : {
  //   type: [Object]
  // },
  // 'nodesPositions.$': {
  //   type: Object
  // },
  // 'nodesPositions.$.x' : {
  //   type: Number,
  //   label: 'X coordinate of the node'
  // },
  // 'nodesPositions.$.y' : {
  //   type: Number,
  //   label: 'Y coordinates of the node'
  // },
  // 'nodesPositions.$.id' : {
  //   type: String,
  //   label: 'ID of the node'
  // },
  UIState : {
    type: Object,
    label: 'State of the UI to load at start',
    optional: true
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  createdAt: {
    type: Date,
    label: 'Time when the node was created'
  }
})

Views.attachSchema(Views.schema)

Views.helpers({
  isPrivate() {
    return !!this.userId || !!this.sharedPublic
  },
  editableBy(userId) {
    if (!this.userId) return true
    return this.userId === userId
  }
})

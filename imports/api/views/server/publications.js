/* eslint-disable prefer-arrow-callback */
import { Meteor } from 'meteor/meteor'
import { Views } from '../../collections.js'


Meteor.publish( 'views.byTopogram', function viewsByTopogram(topogramId) {
  return Views.find({
    topogramId
  }, {
    'sort': { 'createdAt': -1 },
    'limit': 20
  })
})

/*
 *  SINGLE View
 */
Meteor.publish( 'view', function ( viewId ) {
  // TODO : prevent subscribing to private view
  return Views.find({ '_id': viewId })
})

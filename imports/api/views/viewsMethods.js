import { Views } from '../collections.js'

import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'


/**
* Create a view
*
* @instance {ValidatedMethod}
* @param {String} title the title of the new view
* @return {Object} the View object as inserted in Mongo
*/
export const viewCreate = new ValidatedMethod({
  name: 'view.create',
  validate: Views.simpleSchema()
    .pick([
      'title',
      'topogramId',
      'nodesPositions',
      'userId'
    ]).validator({ clean: true, filter: false }),
  run({ topogramId, title, nodesPositions, userId=this.userId }) {

    // make sure topogramId exists

    return Views.insert( {
      title,
      topogramId,
      nodesPositions,
      userId,
      'createdAt': new Date() // current time
    })
  }
})

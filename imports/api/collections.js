import { Mongo } from 'meteor/mongo'

import { Topograms } from '/imports/api/topograms/Topograms.js'
import { Views } from '/imports/api/views/Views.js'
import { Nodes } from '/imports/api/nodes/Nodes.js'
import { Edges } from '/imports/api/edges/Edges.js'

export const Comments = new Mongo.Collection( 'comments' )

export {
  Nodes,
  Edges,
  Views,
  Topograms
}

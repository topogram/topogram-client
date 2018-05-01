import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Restivus } from 'meteor/nimble:restivus'

// import logger from '/imports/logger.js'

import { createNodes, updateNode, deleteNodes } from '/imports/endpoints/nodes.js'
import { createEdges, updateEdge, deleteEdges } from '/imports/endpoints/edges.js'

import {
  createTopogram,
  togglePublicTopogram
} from '/imports/endpoints/topograms.js'

import { buildSuccessAnswer, buildErrorAnswer } from '/imports/api/responses'
import { Topograms, Nodes, Edges } from '/imports/api/collections.js'

// Global API configuration
export const Api = new Restivus({
  apiPath: 'api',
  useDefaultAuth: true,
  prettyJson: true,
  onLoggedIn() {
    // logger.log(this.user.username + ' (' + this.userId + ') logged in')
  },
  onLoggedOut() {
    // logger.log(this.user.username + ' (' + this.userId + ') logged out')
  }
})

// Home
Api.addRoute('',
  { authRequired: false },
  { get() { return { 'message' : 'API works' } } }
)

Api.addRoute('topogramsPublic', { authRequired: false }, {
  get() {
    return Topograms.find({ 'sharedPublic': 1 }).fetch()
  }
})

// Generates: POST on /api/users and GET, DELETE /api/users/:id for
Api.addCollection(Meteor.users, {
  excludedEndpoints: [ 'put','delete','patch'],
  routeOptions: {
    authRequired: true
  },
  endpoints: {
    post: {
      authRequired: false,
      action() {
        const data = this.bodyParams
        const user = Meteor.users.find({ 'emails.address': data.email }).fetch()
        if (user.length) {
          const err = buildErrorAnswer({
            statusCode : 403,
            message: 'Unauthorized - Email already exists'
          })
          return err
        }
        else {
          Accounts.createUser(data)
          const user = Meteor.users.findOne({ 'emails.address': data.email })
          return buildSuccessAnswer({
            statusCode : 201,
            data : { '_id' : user._id }
          })
        }
      }
    },
    delete: {
      roleRequired: 'admin'
    }
  }
})

// Topograms
Api.addCollection(Topograms, {
  routeOptions: {
    authRequired: true
  },
  endpoints: {
    post: {
      action() {
        const data = createTopogram({
          title : this.bodyParams.title,
          userId: this.userId
        })
        if (typeof(data.body) !== 'undefined' && data.body.status === 'error') return data
        return buildSuccessAnswer({ statusCode : 201, data })
      }
    },
    getAll: {
      action() {
        const data = Topograms.find().fetch()
        return buildSuccessAnswer({ statusCode : 200, data })
      }
    }
    // ,delete: {}
  }
})

Api.addRoute('topograms/getByName', {
  post: {
    authRequired: false,
    action() {
      const title = this.bodyParams.name
      return buildSuccessAnswer({
        'statusCode': 200,
        'data' : Topograms.findOne({ "title":title })
      })
    }
  }
})

Api.addRoute('topograms/:_id/togglePublic', {
  post: {
    authRequired: true,
    action() {
      const _id = this.urlParams._id
      togglePublicTopogram({ topogramId : _id })
      return {
        'status': 'success',
        'data' : Topograms.findOne(_id)
      }
    }
  }
})

// Nodes
Api.addCollection(Nodes, {
  routeOptions: { authRequired: false },
  endpoints: {
    post: {
      authRequired: true,
      action() {
        const topogramId = this.bodyParams.topogramId

        // parse Date object from JSON
        const nodes = this.bodyParams.nodes
          .map( n=> {
            const { data } = n
            if (data.start) data.start = new Date(n.data.start)
            if (data.end) data.end = new Date(n.data.end)
            return { data }
          })

        const data = createNodes(topogramId, nodes)
        return buildSuccessAnswer({ statusCode : 201, data })
      }
    },
    put : {
      authRequired: true,
      action() {
        const nodeId = this.urlParams.id
        const data = this.bodyParams
        const res = updateNode(nodeId, data)
        return buildSuccessAnswer({ statusCode : 201, data : res })
      }
    }
  }
})

Api.addRoute('nodes/delete', {
  post : {
    authRequired: true,
    action() {
      const nodeIds = this.bodyParams.nodes
      const data = deleteNodes(nodeIds)
      // Nodes.find({ '_id' : { $in : ids } }).fetch()
      return buildSuccessAnswer({ statusCode : 201, data })
    }
  }
})

Api.addRoute('topograms/:_id/nodes', {
  get: {
    authRequired: false,
    action() {
      const _id = this.urlParams._id
      const data = Nodes.find({ 'topogramId' : _id }).fetch()
      return buildSuccessAnswer({ data })
    }
  }
})

// Edges
Api.addCollection(Edges, {
  routeOptions: { authRequired: false },
  endpoints: {
    post: {
      authRequired: true,
      action() {
        const topogramId = this.bodyParams.topogramId
        const edges = this.bodyParams.edges
        .map( n=> {
          const { data } = n
          if (data.start) data.start = new Date(n.data.start)
          if (data.end) data.end = new Date(n.data.end)
          return { data }
        })

        const data = createEdges( topogramId, edges )
        return buildSuccessAnswer({ statusCode : 201, data })
      }
    },
    put : {
      authRequired: true,
      action() {
        const edgeId = this.urlParams.id
        const data = this.bodyParams
        const res = updateEdge(edgeId, data)
        return buildSuccessAnswer({ statusCode : 201, res })
      }
    }
  }
})

Api.addRoute('edges/delete', {
  post : {
    authRequired: true,
    action() {
      const edgeIds = this.bodyParams.edges
      const data = deleteEdges(edgeIds)
      // Edges.find({ '_id' : { $in : ids } }).fetch()
      return buildSuccessAnswer({ data })
    }
  }
})

Api.addRoute('topograms/:_id/edges', {
  get: {
    authRequired: false,
    action() {
      const _id = this.urlParams._id
      const data = Edges.find({ 'topogramId' : _id }).fetch()
      return buildSuccessAnswer({ data })
    }
  }
})

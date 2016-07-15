import './selectLayout.html'
import { Template } from 'meteor/templating'

import { $ } from 'meteor/jquery'
import { Meteor } from 'meteor/meteor'

Template.selectLayout.rendered = function() {
  $('.dropdown-button').dropdown()
}

Template.selectLayout.helpers({
    layouts: function() {
      var layouts =  []
      // add map layout
      layouts.push(
        // 'dagre', // hierarchical ACL display, not useful for us
        'cose', // uncaught 'prototype' Error
        // 'cola', // can not get it to work
        'spread', // CPU overhead
        // 'arbor', // works quite okay
        // 'springy', // force rendering
        'random',
        // 'grid', // uselss layout
        // 'circle', // useless as well
        'breadthfirst',
        'concentric'
      )

      return layouts.map(function(d) {
            return {
                'slug': d,
                'name': d.charAt(0).toUpperCase() + d.slice(1)
            }
        })
    }

})

Template.selectLayout.events = {
  // apply layout
  'click .layout': function(event, instance) {
    var layoutName = $(event.target).data().layoutName
    var network = instance.data.network.get()
    console.log(layoutName, network);
    var layoutConfig = {
        animate: false,
        name: layoutName,
        stop: function() {  // callback on layoutstop
            var nodesLayout = network.nodes().map(function(node) {
                return {
                    _id : node.data("_id"),
                    position: node.position()
                }
            })
            Meteor.call('updateNodesPositions', nodesLayout)  // save nodes position
        }
    }

    if(layoutName == "spread"){
      layoutConfig.minDist= 50  // Minimum distance between nodes
      layoutConfig.padding= 80  // Padding
    } else if (layoutName == "springy") {
      // springy forces and config
      layoutConfig.stiffness = 800
      layoutConfig.repulsion = 300
      layoutConfig.damping= 0.9

    }

    var layout = network.makeLayout(layoutConfig)
    layout.run()
  }
}

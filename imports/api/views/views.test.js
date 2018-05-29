/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor'
import { Factory } from 'meteor/dburles:factory';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { chai, assert } from 'meteor/practicalmeteor:chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

chai.expect();

import '../factories.js'
import { Views } from './Views.js'
import { Nodes } from '../nodes/Nodes.js'

import {
  viewCreate,
//   viewDelete,
//   viewUpdate,
//   viewTogglePublic
} from './viewsMethods.js'

if (Meteor.isServer) {
  describe('Views', function() {

    import './server/publications.js'

    let userId = Random.id()
    let topogramId = 'topogramId'

    describe('mutators', function () {
      it('builds correctly from factory', function () {
        const view = Factory.create('view');
        assert.typeOf(view, 'object');
        assert.match(view.title, /New View/);
      });
    })

    describe('publications', function () {

      const createView = (props = {}) => {
        const views = Factory.create('view', props);
        return views
      }

      beforeEach(function () {
        Nodes.remove({});
      });

      //
      describe('views.byTopogram', function () {
        const topogram = Factory.create('topogram');
        const topogramId = topogram._id;
        _.times(3, () => createView({topogramId}));

        it('sends all views from a topogram', function (done) {
         const collector = new PublicationCollector();
         collector.collect('views.byTopogram', topogramId, (collections) => {
           chai.assert.equal(collections.views.length, 3);
           done();
         });
        });
      });

      describe('view', function () {
        const topogram = Factory.create('topogram');
        const topogramId = topogram._id;
        _.times(3, () => createView({topogramId}));

        const title = "My Lovely Title";
        const view = createView({topogramId, title});

        it('sends only a single view', function (done) {
          const collector = new PublicationCollector();
          collector.collect('view', view._id, (collections) => {
            chai.assert.equal(collections.views.length, 1);
            chai.assert.equal(collections.views[0].title, title);
            chai.assert.equal(collections.views[0]._id, view._id);
            done();
          });
        });
      });

    })

    describe('properties', function(){

      describe('nodesPositions', function(){

        const topogram = Factory.create('topogram');
        const topogramId = topogram._id;

        it('should accept an object describing {x,y} position nodes', function(done){
          const title = "My topo view"
          const nodesPositions = Array(10)
            .fill({ x : 10, y : 10})
            .map((p,i) =>(
              { ...p, id : i.toString()}
            ))
          console.log(nodesPositions);
          viewCreate._execute({}, {topogramId, title, nodesPositions} );

          let v = Views.findOne()
          assert.equal(v.nodesPositions.length, 10)
          assert.equal(v.nodesPositions[0].x, 10 )
          assert.equal(v.nodesPositions[0].y, 10 )
          done()
        })
      })

      // describe('createdAt (timestamp)', function(){
      //   it('should be created once and never modified', function(done) {
      //     let nodesPositions = {}
      //     viewCreate._execute({}, {topogramId, nodesPositions} );
      //
      //     // created once
      //     let n = Views.findOne()
      //     assert.equal( Math.round(n.createdAt.getTime()/ 10000), Math.round( Date.now()/10000 ) );
      //
      //     // and never modified
      //     // let position = { x : 10, y : 10 }
      //     // nodeMove._execute({}, { nodeId : n.data.id,  position } );
      //     // let nAfter = Views.findOne()
      //     // assert.equal( n.createdAt.getTime(), nAfter.createdAt.getTime())
      //     done()
      //   })
      // })
      //
      // describe('updatedAt (timestamp)', function(){
      //   it('should be modified on each action', function(done) {
      //     viewCreate._execute({}, {topogramId} );
      //
      //     // created once
      //     let n = Views.findOne()
      //     assert.equal( Math.round(n.updatedAt.getTime()/ 10000), Math.round( Date.now()/10000 ) );
      //
      //     // and never modified
      //     // let position = { x : 10, y : 10 }
      //     // nodeMove._execute({}, { nodeId : n.data.id,  position } );
      //     // let nAfter = Views.findOne()
      //     // assert.notEqual( n.createdAt.getTime(), nAfter.updatedAt.getTime())
      //     // assert.isAbove( nAfter.updatedAt.getTime(), n.createdAt.getTime())
      //     done()
      //   })
      // })

    })

    describe('methods', function () {

      beforeEach(function () {
        Views.remove({});
        Nodes.remove({});
        topogramId = Factory.create('topogram')._id;
      });

      // describe('views.create', function () {
      //
      //   topogramId = Factory.create('topogram')._id;
      //   it('creates a view', function (done) {
      //     viewCreate._execute({ userId }, {
      //       title :'test name',
      //       nodesPositions : {},
      //       topogramId
      //     });
      //     assert.equal(Views.find().count(), 1);
      //     let t = Views.findOne({ _id : { $ne : topogramId }})
      //     assert.equal(t.title, 'test name');
      //     assert.equal(t.nodesPositions, {});
      //     assert.equal(t.userId, userId);
      //     done()
      //   })
      // })

      /*
      describe('topograms.delete', function () {
        it('deletes a topogram based on its _id and its nodes', function(done) {
          Factory.create('node', { topogramId });
          topogramDelete._execute({}, { topogramId });
          assert.equal(Views.find().count(), 0);
          assert.equal(Nodes.find().count(), 0);
          done();
        })
      })

      describe('topograms.updateTitle', function () {
        it('update the title of a topogram based on its _id and a new title', function(done) {
          Factory.create('node', { topogramId });
          let title = "blabla"
          let t_before = Views.findOne({ _id : topogramId });
          topogramUpdateTitle._execute({},{
            topogramId,
            title
          });
          assert.equal(Views.find().count(), 1);
          let t = Views.findOne({ _id : topogramId });
          assert.equal(t.title, title);
          done();
        })
      })

      describe('topograms.update', function () {
        it('update the topogram based on its _id', function(done) {

          Factory.create('node', { topogramId });

          let title = "blabla"
          let description = "Some awesome description"
          let t_before = Views.findOne({ _id : topogramId });

          topogramUpdate._execute({},{
            topogramId,
            title,
            description
          });

          assert.equal(Views.find().count(), 1);

          let t = Views.findOne({ _id : topogramId });
          assert.equal(t.title, title);
          assert.equal(t.description, description);
          done();
        })
      })

      describe('topograms.togglePublic', function () {
        it('toggle the visibility (sharedPublic) of a topogram', function(done) {

          Factory.create('node', { topogramId });
          let t_before = Views.findOne({ _id : topogramId });
          assert.equal(t_before.sharedPublic, false);

          topogramTogglePublic._execute({},{
            topogramId
          });
          let t = Views.findOne({ _id : topogramId });
          assert.equal(t.sharedPublic, true);

          topogramTogglePublic._execute({},{
            topogramId
          });
          let t_again = Views.findOne({ _id : topogramId });
          assert.equal(t_again.sharedPublic, false);

          done();
        })
      })
    */
    })
  })
}

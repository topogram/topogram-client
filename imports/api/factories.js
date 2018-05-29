import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'

import {
  Topograms,
  Nodes,
  Edges,
  Views
} from './collections.js'

Factory.define('topogram', Topograms, {
  createdAt: () => new Date(),
  title: () => 'New Topogram',
  slug : () => faker.helpers.slugify('New Topogram'),
  description : () => faker.lorem.paragraph()
})

Factory.define('view', Views, {
  createdAt: () => new Date(),
  topogramId: Factory.get('topogram'),
  title: () => 'New View',
  slug : () => faker.helpers.slugify('New View'),
  nodesPositions : [],
  description : () => faker.lorem.paragraph()
})

Factory.define('node', Nodes, {
  createdAt: () => new Date(),
  topogramId: Factory.get('topogram'),
  data : {
    id : () => faker.random.uuid(),
    name: () => faker.lorem.sentence(),
    lat : () => faker.address.latitude(),
    lon : () => faker.address.longitude(),
    start : () => faker.date.past(),
    end : () => faker.date.future(),
    group : () => faker.hacker.noun(),
    weight : () => faker.random.number()
  }
})

Factory.define('edge', Edges, {
  createdAt: () => new Date(),
  topogramId: Factory.get('topogram'),
  data : {
    id : () => faker.random.uuid(),
    source : Factory.get('node'),
    target : Factory.get('node'),
    name: () => faker.lorem.sentence(),
    lat : () => faker.address.latitude(),
    lon : () => faker.address.longitude(),
    start : () => faker.date.past(),
    end : () => faker.date.future(),
    group : () => faker.hacker.noun(),
    weight : () => faker.random.number()
  }
})

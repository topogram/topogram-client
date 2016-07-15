/*
* YOUR PLUGINS goes here
*
* All plugins run client-side only.
* A Topogram plugin is a Blaze template for Meteor
* or some simple JS code running on the client.
*
* Copy your plugins in the `/plugins` directory, then import the main JS file below
*
*/

import './plugins/client/topogram-plugin-map/map.js'

export const plugins = [
  "map"
] // name of the template to import

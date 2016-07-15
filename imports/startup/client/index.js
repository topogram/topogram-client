import { Template } from 'meteor/templating'
import * as _ from 'lodash'

// register helpers
Template.registerHelper( 'objectToPairs', function( object ) {
    return _.map( object, function( value, key ) {
        return {
            key: key,
            value: value
        }
    } )
} )

// config accounts
import '../../accounts.js'

// routes
import './routes/routes.jsx'
import './routes/topograms.jsx'
import './routes/accounts.jsx'

// register plugins
import '../../plugins.js'

import React from 'react'

import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'

const style = {
  display : 'block',
  width: '30%',
  margin : '2em auto'
}

const CallToAction = () => (
  <div style={style}>
    <FlatButton
      label='Read the docs'
      href='http://topogram.io'
      // secondary={true}
      style={{marginRight : '1em'}}
      />
    <RaisedButton
      label='Register'
      href='/signup'
      primary={true}
      />
  </div>
)

export default CallToAction

import React, { PropTypes } from 'react'
import { Card, CardTitle, CardText } from 'material-ui/Card'

import Markdown from '../markdown/Markdown.jsx'

const SelectedItem = ({ title, group, children, notes }) => (
  <Card>
    <CardTitle
      title={title}
      subtitle={group}
      titleStyle={{ fontSize : '1.2em' }}
      actAsExpander={true}
      showExpandableButton={true}
    />
    <CardText expandable={true}>
      {children}
      {
        notes ?
          <Markdown source={notes} />
          :
          null
      }
    </CardText>
  </Card>
)

SelectedItem.propTypes = {
  title : PropTypes.string,
  notes : PropTypes.string,
  children : PropTypes.node,
  group : PropTypes.string
}

export default SelectedItem

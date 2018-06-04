import React, {PropTypes} from 'react'
import { CardTitle, CardText } from 'material-ui/Card'
import moment from 'moment'
import Markdown from '../markdown/Markdown.jsx'

const PanelDescription = ({
  topogram,
  nodesCount,
  edgesCount
}) => (
  <span>
    <CardTitle
      title={topogram.title}
      titleStyle={{ fontSize : '14pt', lineHeight : '1em' }}
      subtitle={`${nodesCount} nodes, ${edgesCount} edges`}
      />
    <CardText>
      {
        topogram.description ?
          <Markdown source={topogram.description} />
        :
          null
      }

      <p style={{fontSize:'.9em', color:'#5A5A5A'}}>Last modified {moment(topogram.lastModified).fromNow()} | Created {moment(topogram.createdAt).fromNow()}</p>
    </CardText>

  </span>
)

export default PanelDescription

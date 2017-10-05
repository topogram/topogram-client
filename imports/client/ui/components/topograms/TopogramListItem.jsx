import React, { PropTypes } from 'react'
import moment from 'moment'
// import { defineMessages, injectIntl } from 'react-intl'

import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card'

import Markdown from '../markdown/Markdown.jsx'

// import IconMenu from 'material-ui/IconMenu'
// import IconButton from 'material-ui/IconButton'
// import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
// import Settings from '../settings/Settings.jsx'

import FlatButton from 'material-ui/FlatButton'

// const messages = defineMessages({
//   browse : {
//     'id': 'topogram.index.card.button.browse',
//     'defaultMessage': 'Browse',
//     'message': ''
//   }
// })


const TopogramListItem = ({
  topogramTitle,
  topogramDescription,
  topogramId,
  lastModified,
  // topogramSharedPublic,
  // router
}) => (
  <Card>
    <CardTitle
      title={topogramTitle}
      // title={<Link to={`/topograms/${topogramId}`}>{title}</Link>}
      titleStyle={{ fontSize:'13pt', lineHeight:'1.1em', paddingBottom : '.2em' }}
      subtitle={<span>{moment(lastModified).fromNow()}</span>}
      actAsExpander={true}
      showExpandableButton={!!topogramDescription}
    />
    {
      topogramDescription?
      <CardText expandable={true}>
        <Markdown source={topogramDescription} />
      </CardText>
      :
      null
    }
    <CardActions>
      <FlatButton
        href={`/topograms/${topogramId}`}
        // labelPosition="before"
        label="Browse"
      />

      {/* <IconMenu
         iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
       >
        <Settings
          topogramId={topogramId}
          topogramTitle={topogramTitle}
          topogramSharedPublic={topogramSharedPublic}
          router={router}
          />
      </IconMenu> */}

    </CardActions>
  </Card>
)

TopogramListItem.propTypes = {
  topogramTitle: PropTypes.string.isRequired,
  topogramDescription: PropTypes.string,
  topogramId: PropTypes.string.isRequired,
  lastModified: PropTypes.instanceOf(Date).isRequired
}


export default TopogramListItem

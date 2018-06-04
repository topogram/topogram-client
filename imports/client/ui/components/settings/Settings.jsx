import React, { PropTypes } from 'react'

import Subheader from 'material-ui/Subheader'

import TopogramTogglePublic from './TopogramTogglePublic.jsx'
import TopogramEdit from './TopogramEdit.jsx'
import TopogramDelete from './TopogramDelete.jsx'

const Settings = ({
  topogramTitle,
  topogramId,
  router,
  topogramSharedPublic,
  topogramDescription
}) => (
  <span>
    <Subheader>Settings</Subheader>
    <TopogramTogglePublic
      topogramId={topogramId}
      topogramSharedPublic={topogramSharedPublic}
      key="ToggleTopogramPublicButton"
    />
    <TopogramEdit
      topogramId={topogramId}
      topogramTitle= {topogramTitle}
      topogramDescription={topogramDescription}
      key="EditTopogramTitle"
    />
    <TopogramDelete
      topogramTitle= {topogramTitle}
      topogramId={topogramId}
      router={router}
      key="DeleteTopogram"
    />
  </span>
)

Settings.propTypes = {
  topogramId: PropTypes.string.isRequired,
  topogramTitle: PropTypes.string.isRequired,
  topogramDescription: PropTypes.string,
  topogramSharedPublic: PropTypes.bool.isRequired,
  router: PropTypes.object.isRequired
}

export default Settings

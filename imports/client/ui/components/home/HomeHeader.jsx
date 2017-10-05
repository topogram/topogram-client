import React from 'react'
import { FormattedMessage, defineMessages } from 'react-intl'

import Particles from './Particles.jsx'

const messages = defineMessages({
  tagline : {
    'id': 'home.tagline',
    'defaultMessage': 'Social Network Analysis for humans.',
    'message': 'Social Network Analysis for humans.'
  },
  subtitle : {
    'id': 'home.subtitle',
    'defaultMessage': 'An open-source toolkit to process, visualize and analyze networks.',
    'message': 'An open-source toolkit to process, visualize and analyze networks.'
  },
  browseTopograms: {
    'id': 'home.browseTopograms',
    'defaultMessage': 'Browse publics topograms',
    'message': 'Browse publics topograms'
  }
})

const HomeHeader = () => (
  <section
    className="home-header"
  >
    <Particles />
    <div className="header-container">
      <h1>Topogram</h1>
      <h4>
        <FormattedMessage {...messages.tagline} />
      </h4>
      <p><FormattedMessage {...messages.subtitle} /></p>
    </div>
  </section>
)

export default HomeHeader

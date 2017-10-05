import React from 'react'
import Snackbar from 'material-ui/Snackbar'

import TopogramList from '../components/topograms/TopogramList.jsx'
import HomeHeader from '../components/home/HomeHeader.jsx'
import Features from '../components/home/Features.jsx'
import CallToAction from '../components/home/CallToAction.jsx'


// define and export our Welcome component
export class HomeComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      message: ''
    }
  }

  static propTypes = {
    topograms: React.PropTypes.array.isRequired,
    loadTopograms: React.PropTypes.func.isRequired,
    stopTopogramsSubscription: React.PropTypes.func.isRequired,
    router: React.PropTypes.object.isRequired
  }


  promptSnackbar = (msg) => {
    this.setState({
      open: true,
      message: msg
    })
  }

  handleRequestClose = () =>{
    this.setState({
      open: false,
    })
  }

  componentDidMount() {
    this.props.loadTopograms()
  }

  componentWillUnmount() {
    this.props.stopTopogramsSubscription()
  }


  render() {
    return (
      <div>
        <HomeHeader />


        <Features />

        <CallToAction />

        <TopogramList
          topograms={this.props.topograms}
          // title={<FormattedMessage {...messages.browseTopograms} />}
          title="Browse publics topograms"
          showFilters={false}
          router={this.props.router}
        />

        <Snackbar
          open={this.state.open}
          message={this.state.message}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    )
  }
}

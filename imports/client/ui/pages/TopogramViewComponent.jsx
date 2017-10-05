import React, { PropTypes } from 'react'
import ui from 'redux-ui'

import MainViz from '/imports/client/ui/components/mainViz/MainViz.jsx'
import SideNav from '/imports/client/ui/components/SideNav.jsx'
import SelectionPanel from '/imports/client/ui/components/selectionPanel/SelectionPanel.jsx'

// UI state default values
@ui({
  state: {
    filterPanelIsOpen: true,
    // filters
    minTime : null,
    maxTime : null,
    currentSliderTime : () => new Date().getTime(), // TODO set default to minTime
    // viz layout settings
    graphVisible : true, // default to graph view
    geoMapVisible : false,
    timeLineVisible : false,
    // selectionPanelVisible : false,
    // network/map
    layoutName : 'preset',
    nodeRadius : 'degree',
    geoMapTile : 'default',
    // selection
    selectionModeOn : false,
    selectionPanelVisible : false,
    selectedElements : [],
    cy : null // cytoscape graph
  }
})
export class TopogramViewComponent extends React.Component {

  static propTypes = {
    ui: PropTypes.object,
    updateUI: PropTypes.func,
    hasTimeInfo: PropTypes.bool,
    hasGeoInfo: PropTypes.bool,
    maxTime: PropTypes.instanceOf(Date),
    minTime: PropTypes.instanceOf(Date),
    nodes: PropTypes.array,
    edges: PropTypes.array,
    topogram: PropTypes.object,
    topogramId: PropTypes.string,
    isLoggedIn : PropTypes.bool,
    userId: PropTypes.string,
    loadTopogram : PropTypes.func.isRequired,
    loadNodes : PropTypes.func.isRequired,
    loadEdges : PropTypes.func.isRequired,
    stopNodesSubscription : PropTypes.func.isRequired,
    stopEdgesSubscription : PropTypes.func.isRequired,
    stopTopogramSubscription : PropTypes.func.isRequired,
    router : PropTypes.object.isRequired,
    params : PropTypes.shape({
      topogramId : PropTypes.string.isRequired
    })
  }

  constructor(props) {
    super(props)
    this.toggleSideNav = this.toggleSideNav.bind(this)

    // snackbar
    this.state = {
      open: false,
      message: ''
    }
    this.promptSnackbar = this.promptSnackbar.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)
  }

  componentDidMount() {
    this.props.loadTopogram(this.props.params.topogramId)
    this.props.loadNodes(this.props.params.topogramId)
    this.props.loadEdges(this.props.params.topogramId)
  }

  componentWillUnmount() {
    this.props.stopNodesSubscription()
    this.props.stopEdgesSubscription()
    this.props.stopTopogramSubscription()
  }

  toggleSideNav() {
    const toggled = this.refs.sideNav.state.open ? false : true
    this.refs.sideNav.setState({ open : toggled })
  }

  promptSnackbar(msg) {
    this.setState({
      open: true,
      message: msg
    })
  }

  handleRequestClose() {
    this.setState({
      open: false,
    })
  }

  componentWillUpdate() {

    // // show timeline if time info
    // if (this.props.hasTimeInfo)
    //   this.props.updateUI('timeLineVisible', true)

    if (this.props.hasTimeInfo && !this.props.ui.minTime && !this.props.ui.maxTime) {
      // pass value to UI as default
      this.props.updateUI('minTime', this.props.minTime)
      this.props.updateUI('maxTime', this.props.maxTime)
    }
  }

  render() {

    const nodes = this.props.hasTimeInfo ?
      this.props.nodes
        .filter(n => new Date(this.props.ui.maxTime) >= new Date(n.data.end))
        .filter(n => new Date(this.props.ui.currentSliderTime) >= new Date(n.data.end))
        .filter(n => new Date(n.data.start) >= new Date(this.props.ui.minTime))
      :
      this.props.nodes

    const nodeIds = nodes.map(n => n.data.id)

    const edges = this.props.edges
      .filter(e =>
        nodeIds.includes(e.data.source) && nodeIds.includes(e.data.target)
      )

    // console.log(this.props.userId, this.props.topogram.userId, this.props.isLoggedIn);
    // console.log(this.props.userId === this.props.topogram.userId && this.props.isLoggedIn);

    return (
      <div>

        <MainViz
          nodes={ nodes }
          edges={ edges }
          hasTimeInfo={ this.props.hasTimeInfo }
          hasGeoInfo={ this.props.hasGeoInfo }
        />
        { this.props.ui.filterPanelIsOpen ?
          <SideNav
            topogramId={ this.props.params.topogramId }
            topogramTitle={ this.props.topogram.title }
            topogramIsPublic={ this.props.topogram.sharedPublic }
            topogramDescription={this.props.topogram.description}
            authorIsLoggedIn={ this.props.userId === this.props.topogram.userId && this.props.isLoggedIn }
            nodes={ nodes }
            edges={ edges }
            router={this.props.router}
          />
          :
          null
        }
        <SelectionPanel
          open={!!this.props.ui.selectionPanelVisible}
        />
      </div>
    )
  }
}

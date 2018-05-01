import React, { PropTypes } from 'react'
import ui from 'redux-ui'

import MainViz from '/imports/client/ui/components/mainViz/MainViz.jsx'
import TitleBox from '/imports/client/ui/components/TitleBox.jsx'
import SidePanel from '/imports/client/ui/components/SidePanel/SidePanel.jsx'

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ExploreIcon from 'material-ui/svg-icons/action/explore';

// UI state default values
@ui({
  state: {
    filterPanelIsOpen: true,
    // filters
    minTime : null,
    maxTime : null,
    currentSliderTime : () => new Date().getTime(), // TODO set default to minTime
    selectedNodeCategories: [],
    // viz layout settings
    graphVisible : true, // default to graph view
    geoMapVisible : false,
    timeLineVisible : false,
    // network/map
    layoutName : 'preset',
    nodeRadius : 'degree',
    geoMapTile : 'default',
    // selection
    selectedElements : [],
    focusElement: null,
    cy : null, // cytoscape graph
    // isolate
    isolateMode : false,
    prevPositions : null
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
    nodeCategories: PropTypes.array,
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
    this.toggleTitleBox = this.toggleTitleBox.bind(this)

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

  handleToggleSelectionMode = () =>
    this.props.updateUI('filterPanelIsOpen', !this.props.ui.filterPanelIsOpen)

  handleEnterIsolateMode = () => {

    const {
      cy,
      selectedElements,
      isolateMode
    } = this.props.ui

    // store previous nodes position
    const prevPositions = {}
    if (!isolateMode) {
      cy.nodes().forEach(n =>
        prevPositions[n.id()] = {...n.position()}
      )
      this.props.updateUI('prevPositions', {...prevPositions})
    }

    // isolate mode ON
    this.props.updateUI('isolateMode', true)

    // get my nodes/edges
    const selectedIds = selectedElements.map(e => e.data.id)
    const focusedNodes = cy.filter((i, e) =>
      selectedIds.includes(e.id())
    )

    cy.nodes().style({ 'opacity': '0' });
    cy.edges().style({ 'opacity': '0' });

    // select
    var subGraph = focusedNodes.openNeighborhood();
    focusedNodes.style({ 'opacity': '1' });
    subGraph.style({ 'opacity': '1'});

    // apply focus layout
    subGraph.layout({
      'name':"spread",
      'minDist' : 30,
      'padding' : 50
    })
  }

  handleEnterExtractMode = () => {

    const {
      cy,
      selectedElements,
      isolateMode
    } = this.props.ui

    // store previous nodes position
    const prevPositions = {}
    if (!isolateMode) {
      cy.nodes().forEach(n =>
        prevPositions[n.id()] = {...n.position()}
      )
      this.props.updateUI('prevPositions', {...prevPositions})
    }

    // isolate mode ON
    this.props.updateUI('isolateMode', true)

    // get my nodes/edges
    const selectedIds = selectedElements.map(e => e.data.id)
    const focusedNodes = cy.filter((i, e) =>
      selectedIds.includes(e.id())
    )

    cy.nodes().style({ 'opacity': '0' });
    cy.edges().style({ 'opacity': '0' });

    // select ,need to catch type error since layout is not redefined, but it is OK for what we want
    try {
      var subGraph = focusedNodes.openNeighborhood();
      focusedNodes.style({ 'opacity': '1' });
      subGraph.style({ 'opacity': '1'});

    } catch (e) {
      console.log(e instanceof TypeError);
    }
    // apply focus layout
    // subGraph.layout({
    //   'name':"spread",
    //   'minDist' : 30,
    //   'padding' : 50
    // })
    //this.layout.stop()
//console.log(layout);
  }



  handleExitIsolateMode = () => {

    const {
      cy,
      prevPositions
    } = this.props.ui

    // isolate mode ON
    this.props.updateUI('isolateMode', false)

    // show all again
    cy.nodes().style({ 'opacity': '1' });
    cy.edges().style({ 'opacity': '1' });

    // bring back positions
    cy.nodes().positions((i,n) => prevPositions[n.id()])
    this.props.updateUI('prevPositions', null)

    cy.fit()
  }


  onFocusElement = (el) => this.props.updateUI('focusElement', el)
  onUnfocusElement = () => this.props.updateUI('focusElement', null)

  selectElement = (el) => {

    el.data.selected = true

    const { cy } = this.props.ui
    let filter = `${el.group.slice(0,-1)}[id='${el.data.id}']`
    cy.filter(filter).data('selected', true)

    this.props.updateUI(
      'selectedElements',
      [...this.props.ui.selectedElements, el]
    )

  }

  unselectElement = (el) => {

    el.data.selected = false

    const { cy, isolateMode } = this.props.ui
    let filter = `${el.group.slice(0,-1)}[id='${el.data.id}']`
    cy.filter(filter).data('selected', false)

    const {selectedElements} = this.props.ui

    const remainingElements = [...
        selectedElements.filter(n =>
          !(
            n.data.id === el.data.id
            &&
            n.group === el.group
          )
        )
    ]

    this.props.updateUI('selectedElements', remainingElements)
    // console.log(remainingElements, isolateMode);

    if(!remainingElements.length && isolateMode)
      this.handleExitIsolateMode()
  }

  unselectAllElements = () => {
    const { cy, selectedElements } = this.props.ui

    cy.elements().data('selected', false)
    selectedElements.forEach(el=> el.data.selected = false)

    this.props.updateUI('selectedElements', [])

  }

  toggleTitleBox() {
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

  componentWillUpdate(nextProps) {

    // // show timeline if time info
    // if (this.props.hasTimeInfo)
    //   this.props.updateUI('timeLineVisible', true)

    const {
      ui,
      hasTimeInfo,
      nodeCategories,
      minTime,
      maxTime
    } = this.props

    if (hasTimeInfo && !ui.minTime && !ui.maxTime) {
      // pass value to UI as default
      this.props.updateUI('minTime', minTime)
      this.props.updateUI('maxTime', maxTime)
    }

    // default value to all
    if (nodeCategories && !ui.selectedNodeCategories.length)
      this.props.updateUI('selectedNodeCategories', nodeCategories)

  }

  render() {

    const {
      hasTimeInfo,
      nodeCategories,
      user,
      router
    } = this.props

    const filterTime = (n) => hasTimeInfo ?
      //new Date(this.props.ui.maxTime) >= new Date(n.data.end)
      //&& new Date(this.props.ui.currentSliderTime) >= new Date(n.data.end)
      //&&
       new Date(n.data.start) >= new Date(this.props.ui.minTime)
       && new Date(this.props.ui.currentSliderTime) >= new Date(n.data.start)
      :
      true

    const filterCategories = (n) => !!nodeCategories.length ?
      this.props.ui.selectedNodeCategories.includes(n.data.group)
      :
      true

    const selectedIds = this.props.ui.selectedElements.map(d=>d.data.id)
    const nodes =  this.props.nodes.filter(n =>
        filterTime(n)
        && filterCategories(n)
      )
      .map(n => {
        let selected = selectedIds.includes(n.data.id)
        let node = Object.assign( {}, n)
        node.data.selected = selected
        return node
      })

    const nodeIds = nodes.map(n => n.data.id)

    const edges = this.props.edges

      .filter(e => hasTimeInfo ?
        new Date(e.data.start) >= new Date(this.props.ui.minTime)
        && new Date(this.props.ui.currentSliderTime) >= new Date(e.data.start)
        && nodeIds.includes(e.data.source) && nodeIds.includes(e.data.target)
       :
        nodeIds.includes(e.data.source) && nodeIds.includes(e.data.target)
      )

    // console.log(this.props.userId, this.props.topogram.userId, this.props.isLoggedIn);
    // console.log(this.props.userId === this.props.topogram.userId && this.props.isLoggedIn);

    return (
      <div>

        <FloatingActionButton
          style={{
            position: 'fixed',
            right: '20px',
            top: '20px'
          }}
          onClick={this.handleToggleSelectionMode}
          >
          <ExploreIcon />
        </FloatingActionButton>

        <MainViz
          topogramId={ this.props.params.topogramId }
          nodes={ nodes }
          edges={ edges }
          onFocusElement={this.onFocusElement}
          onUnfocusElement={this.onUnfocusElement}
          onClickElement={this.onClickElement}
          selectElement={this.selectElement}
          unselectElement={this.unselectElement}
          unselectAllElements={this.unselectAllElements}
          hasTimeInfo={ this.props.hasTimeInfo }
          hasGeoInfo={ this.props.hasGeoInfo }
        />

        <TitleBox
          topogramTitle={ this.props.topogram.title }
          selectedElements={this.props.ui.selectedElements}
          focusElement={this.props.ui.focusElement}
          cy={this.props.ui.cy}
          onFocusElement={this.onFocusElement}
          onUnfocusElement={this.onUnfocusElement}
          isolateMode={this.props.ui.isolateMode}
          handleEnterIsolateMode={this.handleEnterIsolateMode}
          handleEnterExtractMode={this.handleEnterExtractMode}
          handleExitIsolateMode={this.handleExitIsolateMode}
          selectElement={this.selectElement}
          unselectAllElements={this.unselectAllElements}
          unselectElement={this.unselectElement}
        />

        <SidePanel
          nodes={ nodes }
          edges={ edges }
          topogram={ this.props.topogram }
          nodeCategories={this.props.nodeCategories}

          user={user}
          router={router}

          hasTimeInfo={ this.props.hasTimeInfo }
          hasGeoInfo={ this.props.hasGeoInfo }

          open={this.props.ui.filterPanelIsOpen}

          router={this.props.router}
          authorIsLoggedIn={ this.props.userId === this.props.topogram.userId && this.props.isLoggedIn }

          onFocusElement={this.onFocusElement}
          onUnfocusElement={this.onUnfocusElement}
          selectElement={this.selectElement}
          unselectAllElements={this.unselectAllElements}
          unselectElement={this.unselectElement}
        />
      </div>
    )
  }
}

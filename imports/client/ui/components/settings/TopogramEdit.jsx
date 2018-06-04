import React, { PropTypes } from 'react'

import ModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import MenuItem from 'material-ui/MenuItem'

import Markdown from '../markdown/Markdown.jsx'

import { topogramUpdate } from '../../../../api/topograms/topogramsMethods.js'

export default class TopogramEditTitle extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      title: this.props.topogramTitle,
      description: this.props.topogramDescription,
      previewOpen : false,
      open: false
    }
  }

  static propTypes = {
    topogramTitle : PropTypes.string,
    topogramId : PropTypes.string
  }

  handleTitleChange = (event) => {
    this.setState({ title : event.target.value })
  }

  handleDescriptionChange = (event) => {
    this.setState({ description : event.target.value })
  }

  handleClickUpdateTitle = () => {
    topogramUpdate.call({
      topogramId : this.props.topogramId,
      title : this.state.title,
      description : this.state.description
    })
    this.handleClose()
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  togglePreview = () => {
    this.setState({ previewOpen: !this.state.previewOpen })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render() {

    const actions = [
      <FlatButton
        label="Cancel"
        key="cancel"
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label={this.state.previewOpen ? "Back to Edit" : "Preview"}
        key="preview"
        secondary={true}
        onTouchTap={this.togglePreview}
      />,
      <FlatButton
        label="Update"
        key="update"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClickUpdateTitle}
      />
    ]

    return (
      <div>
        <MenuItem
          primaryText="Edit Title or Description"
          onTouchTap={this.handleOpen}
          leftIcon={<ModeEdit />}
        />
        <Dialog
          title='Edit topogram content'
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
          {
            this.state.previewOpen?
              <span>
                <h3>{this.state.title}</h3>
                <hr />
              </span>
            :
              <TextField
                floatingLabelText="Edit Title"
                fullWidth={true}
                value={this.state.title}
                onChange={this.handleTitleChange}
                floatingLabelFixed={true}
                multiLine={false}
              />
          }
          {
            this.state.previewOpen?
              <Markdown source={this.state.description} />
            :
            <TextField
              floatingLabelText="Edit Description (Markdown supported)"
              fullWidth={true}
              value={this.state.description}
              onChange={this.handleDescriptionChange}
              floatingLabelFixed={true}
              multiLine={true}
              rowsMax={5}
            />
          }
        </Dialog>
      </div>
    )
  }
}

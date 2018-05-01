import React, { PropTypes } from 'react'
import ui from 'redux-ui'
import moment from 'moment'

import { Card, CardText, CardHeader } from 'material-ui/Card'
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker'
import IconButton from 'material-ui/IconButton'
import PlayCircleFilled from 'material-ui/svg-icons/av/play-circle-filled';
import Pause from 'material-ui/svg-icons/av/pause';
import Stop from 'material-ui/svg-icons/av/stop';
import TimeSlider from './TimeSlider.jsx'

const styleTimeLine = {
  height: '30vh',
  position: 'fixed',
  bottom: 0,
  width: '100vw'
}

@ui()
export default class TimeLine extends React.Component {

  constructor(props) {
   super(props)

   var seconds = parseInt((this.props.ui.maxTime-this.props.ui.minTime)/1000);
   var tempo = Math.floor(seconds);

   this.originalTempo = tempo

   this.state = {
     playing : false,
     tempo,
     step : 1,
     timer : null
   }
  }

  static propTypes = {
    hasTimeInfo : PropTypes.bool
  }

  handleChangeMinTime = (event, date) => {
    this.props.updateUI('minTime', date)
  }

  handleChangeMaxTime = (event, date) => {
    this.props.updateUI('maxTime', date)
  }

  openMinDatePicker = () => {
    this.refs.minDatePicker.focus()
  }

  openMaxDatePicker = () => {
    this.refs.maxDatePicker.focus()
  }

  pause = () => {
    // clearInterval
    clearInterval(this.state.timer)
    this.setState({playing : false, timer : null})
  }

  play = () => {

    const { tempo } = this.state;
    const { maxTime } = this.props.ui

    // start setInterval
    const timer = setInterval( () => {
      const newTime = Math.round(this.props.ui.currentSliderTime) + tempo;
      if (newTime >= Math.round(maxTime)) this.pause()

      this.props.updateUI({currentSliderTime :  newTime })
    },10)

    this.setState({
      playing : true,
      timer
    })
  }

  stop = () => {
    this.pause()
    this.props.updateUI({
      currentSliderTime : Math.round(this.props.ui.minTime)
    })
  }

  handleChangeStep = (e) => {
    const step = e.target.value
    const tempo = this.originalTempo*step
    this.setState({ step, tempo })
  }

  render() {

    const { minTime, maxTime } = this.props.ui
    const { hasTimeInfo } = this.props

    return (
      <Card
        style={styleTimeLine}
      >
        { !hasTimeInfo ?
          <CardHeader
            title={'No time info available.'}
          />
          :
          <div>
            <CardHeader
              subtitle={
                <div>
                <span>
                  From <a onClick={this.openMinDatePicker}
                    style={{ cursor : 'pointer', color : 'black' }}>
                    {`${moment(minTime).format('MMM Do YYYY')}`}
                  </a> to <a onClick={this.openMaxDatePicker}
                    style={{ cursor : 'pointer', color : 'black' }}>
                    {`${moment(maxTime).format('MMM Do YYYY')}`}
                  </a>

                  <IconButton
                    onClick={
                      this.state.playing ?
                        () => this.pause()
                        :
                        () => this.play()
                      }
                    alt="Play/Resume"
                    title="Play/Resume"
                    >
                    {
                      this.state.playing ?
                        <Pause />
                        :
                        <PlayCircleFilled />
                    }
                  </IconButton>
                  <IconButton
                    onClick={() => this.stop()}
                    alt="Stop"
                    title="Stop"
                    >
                    <Stop />
                  </IconButton>

                  <TextField
                    name='stepSetter'
                    type='number'
                    min={0.1}
                    max={10}
                    step={.1}
                    floatingLabelFixed={true}
                    floatingLabelText='Speed'
                    style={{width : '3em', margin: '0 2em'}}
                    value={this.state.step}

                    // columns={3}

                    onChange={this.handleChangeStep}
                    />

                </span>
                </div>
              }
            />



            <DatePicker
              onChange={this.handleChangeMinTime}
              ref="minDatePicker"
              autoOk={true}
              textFieldStyle={{ display: 'none' }}
              floatingLabelText="Min Date"
              value={minTime}
            />
            <DatePicker
              ref="maxDatePicker"
              textFieldStyle={{ display: 'none' }}
              onChange={this.handleChangeMaxTime}
              autoOk={true}
              floatingLabelText="Max Date"
              value={maxTime}
            />
            <CardText>
              { minTime && maxTime ?
                <TimeSlider
                  minTime={new Date(minTime).getTime()}
                  maxTime={new Date(maxTime).getTime()}
                  />
                :
                null
              }
            </CardText>
          </div>
        }
      </Card>
    )
  }
}

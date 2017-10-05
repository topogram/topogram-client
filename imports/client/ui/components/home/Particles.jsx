import React from 'react'
import particles from 'particles.js'

const style = {
  display: 'flex',
  height : '98vh',
  position: 'absolute',
  top :0
}

class Particles extends React.Component {

  componentWillMount () {
    window.particlesJS.load('particles', '/data/particlesjs-config.json', function() {
      console.log('callback - particles.js config loaded');}
    );
  }

  render = () => (
    <div id="particles" style={style}>
      <script src="" type="text/javascript"></script>
    </div>
  )

}

export default Particles

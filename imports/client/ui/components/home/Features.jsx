import React from 'react'

import {GridList, GridTile} from 'material-ui/GridList';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingTop : '2em'
  },
  gridList: {
    width: '80%',
    height: 450,
    overflowY: 'auto',
  },
  img :{
    width : '100vw',
    height : 180,
    overflow : 'hidden'
  }
};

const Features = () => (
  <div style={Object.assign({background : 'url(img/network.png)'}, styles.img)}>
    {/* <img src="img/map.png" alt="" /> */}
  </div>

  //   <GridList
  //      cellHeight={250}
  //      style={styles.gridList}
  //      cols={3}
  //    >
  //     <GridTile>
  //         <h2>Time-based</h2>
  //         <p>Explore transforming networks over time</p>
  //     </GridTile>
  //     <GridTile
  //       title='Geographical Maps'
  //       //subtitle={<span>by <b>tile.author</b></span>}
  //       >
  //     </GridTile>
  //     <GridTile
  //       title='Networks & Graph'
  //       // subtitle={<span>by <b>tile.author</b></span>}
  //       >

  //     </GridTile>
  //   </GridList>
  // </div>
)

export default Features

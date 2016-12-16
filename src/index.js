import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      mode: 'play',
      squares: [],
      generations: 0,
      speed: 100,
      width: 40,
      height: 40
    }
  }

  componentDidMount() {
    this._start()
  }

  _changeSpeed(speed) {
    this.setState({ speed: speed })
    clearTimeout(this.timer)
    this._play(speed)
  }

  _start() {
    this.setState({ squares: this._createGrid(this._generateRandomState), generations: 1, mode: 'play' })
    this._play()
  }

  _play(speed = 100) {
    if(this.state.mode === 'clear' || (this.state.generations === 0 && this.state.mode === 'pause')) {
      this.setState({ squares: this._createGrid(this._generateRandomState), generations: 1, mode: 'play' })
    }

    //this.setState({ squares: this._createGrid(this._generateRandomState) })
    this.timer = setInterval(() => {
      this.setState({ squares: this._createGrid(this._calculateNewState.bind(this)), generations: this.state.generations+1, mode: 'play' })
    }, speed);
  }

  _pause() {
    clearTimeout(this.timer);
    this.setState({ mode: 'pause' })
  }

  _clear() {
    clearTimeout(this.timer);
    this.setState({ squares: this._loopGrid(() => 0), generations: 0, mode: 'clear' })
  }

  _calculateNewState(x, y) {

    let total = 0;
    const actualState = this.state.squares[x][y];

    if(this.state.squares[x] && this.state.squares[x][y+1]) { total += 1; }
    if(this.state.squares[x] && this.state.squares[x][y-1]) { total += 1; }
    if(this.state.squares[x-1] && this.state.squares[x-1][y-1]) { total += 1; }
    if(this.state.squares[x-1] && this.state.squares[x-1][y]) { total += 1; }
    if(this.state.squares[x-1] && this.state.squares[x-1][y+1]) { total += 1; }
    if(this.state.squares[x+1] && this.state.squares[x+1][y-1]) { total += 1; }
    if(this.state.squares[x+1] && this.state.squares[x+1][y]) { total += 1; }
    if(this.state.squares[x+1] && this.state.squares[x+1][y+1]) { total += 1; }

    // Une cellule morte possédant exactement trois voisines vivantes devient vivante (elle naît).
    if(!actualState && total === 3) {
      return 1;
    }

    // Une cellule vivante possédant deux ou trois voisines vivantes le reste, sinon elle meurt.
    if(actualState && (total < 2 || total > 3)) {
      return 0;
    }


    return actualState;
  }

  _generateRandomState() {
    return Math.round(Math.random());
  }

  _loopGrid(func) {
    let grid = [];
    for (let i = 0; i < this.state.width; i++) {
      grid[i] = [];
      for (let j = 0; j < this.state.height; j++) {
        grid[i][j] = func(i, j);
      }
    }

    return grid;
  }

  _createGrid(func) {
    return this._loopGrid(func)
  }

  _displayGrid() {
    const array = this.state.squares.map(function(x) {
      let mapped = x.map(function(y, i) {
        return <Square cell={y} />
      })
      mapped = <div className="ordinate">{mapped}</div>;
      return mapped;
    });
    return array;
  }

  render() {
    return (
      <div className="game">
        <Menu mode={this.state.mode} speed={this.state.speed} _play={this._play.bind(this)} _pause={this._pause.bind(this)} _clear={this._clear.bind(this)} _changeSpeed={this._changeSpeed.bind(this)} />
        <Grid _displayGrid={this._displayGrid.bind(this)} squares={this.state.squares} />
        <Footer generations={this.state.generations} />
      </div>
    )
  }
}

class Menu extends React.Component {

  render() {

    return (
      <div className="menu">
        <h1>The game of life</h1>
        <div className="buttons-wrapper">
          <div className="label">Mode:</div>
          <button className={this.props.mode === 'play' ? 'active' : ''} onClick={() => this.props._play()}>play</button>
          <button className={this.props.mode === 'pause' ? 'active' : ''} onClick={() => this.props._pause()}>pause</button>
          <button onClick={() => this.props._clear()}>clear</button>
        </div>
        <div className="buttons-wrapper">
          <div className="label">Speed:</div>
          <button className={this.props.speed === 400 ? 'active' : ''} onClick={() => this.props._changeSpeed(400)}>slow</button>
          <button className={this.props.speed === 200 ? 'active' : ''} onClick={() => this.props._changeSpeed(200)}>medium</button>
          <button className={this.props.speed === 100 ? 'active' : ''} onClick={() => this.props._changeSpeed(100)}>fast</button>
        </div>
      </div>
    )
  }
}

class Grid extends React.Component {
  render() {
    return (
      <div className="grid">
        { this.props.squares && this.props._displayGrid() }
      </div>
    )
  }
}

class Footer extends React.Component {
  render() {
    return (
      <div className="footer">generations: {this.props.generations}</div>
    )
  }
}

class Square extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.cell !== this.props.cell;
  }

  render() {
    return <div className={`square ${this.props.cell ? 'alive' : 'dead'}`} ></div>
  }
}


ReactDOM.render(
  <App />,
  document.querySelector('#app')
);

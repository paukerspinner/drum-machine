import React from 'react';
import './App.css';
import './myStyle.css'
import { notes } from './constants/pianoKeys';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playedNotes: ''
    }
  }

  indexOf = (prop, value) => {
    let result = -1;
    for (let i = 0; i < notes.length; i++) {
      if (notes[i][prop] === value) { result = i; }
    }
    return result;
  }

  convert = (fromProp, toProp, value) => {
    var index = this.indexOf(fromProp, value);
    return index !== -1 ? notes[index][toProp] : '';
  }

  activeNote = () => {}

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handlleKeyUp);
    document.addEventListener('click', this.handleClick);
  }

  handleClick = event => {
    let symbol = event.target.id;
    let key = this.convert('symbol', 'key', symbol);
    let audio = document.querySelector(`[data-key="${key}"`);
    if (this.playSound(audio))
      this.setState({
        playedNotes: [this.state.playedNotes, symbol.replace('_', '#')].join(" ")
      })
  }

  playSound = (audio) => {
    if (audio && !isNaN(audio.duration)) {
      audio.currentTime = 0;
      setTimeout(() => audio.play(), 10);
      return true;
    }
    return false;
  }

  handlleKeyUp = (event) => {
    let key = String.fromCharCode(event.keyCode);
    let symbol = this.convert('key', 'symbol', key);
    let tag = document.getElementById(symbol);
    if (tag) {
      tag.className = tag.className.replace(/actived-note\s/g, '');
    }
  }

  handleKeyDown = (event) => {
    let key = String.fromCharCode(event.keyCode);
    let symbol = this.convert('key', 'symbol', key);
    let tag = document.getElementById(symbol);
    if (tag) {
      tag.className = "actived-note " + tag.className;
      tag.click();
    }
  }

  handleChange = event => {
    var name = event.target.name;
    var value = event.target.value;
    this.setState({ [name] : value });
  }

  render() {
    var audios = notes.map((note, index) => {
      return (
        <audio key={index} data-key={note.key} src={note.url} />
      )
    })

    var noteTags = notes.map((note, index) => {
      var classNote = /_/.test(note.symbol) ? 'black-note' : 'white-note';
      return (
        <span key={index} id={note.symbol} className={classNote} />
      )
    })
    return (
      <div className="container" id="piano">
        { noteTags }
        { audios }
        <textarea id="historyNotes" value={this.state.playedNotes} readOnly/>
      </div>
    );
  }
}

export default App;

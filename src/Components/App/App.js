import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistTracks: [],
      playlistName: "My Playlist",
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack=this.removeTrack.bind(this);
    this.updatePlaylistName=this.updatePlaylistName.bind(this);
    this.savePlaylist=this.savePlaylist.bind(this);
    this.search=this.search.bind(this);
  }
  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id))
      return;
    const newArr = this.state.playlistTracks;
    newArr.push(track);
    this.setState({
      playlistTracks: newArr
    });
  }
  updatePlaylistName(name){
    this.setState({
      playlistName:name
    })
  }
  removeTrack(track) {
    let index=0;
    const newArr = this.state.playlistTracks;
    for (let i = 0; i < newArr.length; i++) {
      if (newArr[i] === track.id) {
        index = i;
        return;
      }
    }
    newArr.splice(index,1);
    this.setState({
      playlistTracks: newArr
    })
  }
  savePlaylist(){
    let trackURIs=this.state.playlistTracks.map(track=>track.uri);
    Spotify.savePlaylist(this.state.playlistName,trackURIs);
      this.setState({
        playlistName:'My Playlist',
        playlistTracks: []
      });
   
  }
  search(searchTerm){
    Spotify.search(searchTerm).then(searchResult=>{
      // let newArr=this.state.searchResults;
      // newArr.push(searchResult);
      console.log(searchResult);
      this.setState({
        searchResults:searchResult
      });
    });
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults onAdd={this.addTrack} searchResults={this.state.searchResults} />
            <Playlist onSave={this.savePlaylist} onNameChange={this.updatePlaylistName} searchResults={this.state.searchResults} onRemove={this.removeTrack} playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

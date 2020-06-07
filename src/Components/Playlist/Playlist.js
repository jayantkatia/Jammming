import React from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList';
class Playlist extends React.Component {
    constructor(props){
        super(props);
        this.handleNameChange=this.handleNameChange.bind(this);
    }
    handleNameChange(e){
       this.props.onNameChange(e.target.value);
    }
    render() {
        return (
            <div className="Playlist">
                <input value={this.props.playlistName} onChange={this.handleNameChange} />
            <TrackList  onRemove={this.props.onRemove} isRemoval={true} tracks={this.props.playlistTracks} playlistName={this.props.playlistName}/>
                <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
            </div>
        );
    }
}
export default Playlist;
let userAccessToken;
const redirectURL = 'http://madman-voice.surge.sh';
const apiKey = '';
const Spotify = {
    getAccessToken() {
        if (userAccessToken) {
            return userAccessToken;
        }
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            console.log(accessTokenMatch);
            console.log(expiresInMatch);

            userAccessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            window.setTimeout(() => {
                userAccessToken = '';

            }, expiresIn * 1000);


            window.history.pushState('Access Token', null, '/');
            return userAccessToken;
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${apiKey}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURL}`
        }

    },
    search(searchTerm) {
        const userAccessToken = this.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
            headers: {
                Authorization: `Bearer ${userAccessToken}`
            }
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Request Failed');
        }, networkError => console.log(networkError.message)).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            console.log("I am Here before return ");
            return jsonResponse.tracks.items.map(track => ({

                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri

            }));

        });
    },
    savePlaylist(playlistName, arrURI) {
        if(!playlistName || !arrURI) {
            return;
        }
      
        userAccessToken = this.getAccessToken();
        const headers = {
            Authorization: `Bearer ${userAccessToken}`
        }
        let uid;
        fetch('https://api.spotify.com/v1/me', { headers: headers }).then(response => response.json()).then(jsonResponse => {
        const uid=jsonResponse.id;    
        return fetch(`https://api.spotify.com/v1/users/${uid}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: playlistName })
            }).then(response => response.json()).then(jsonResponse => {
                
                const playlistID = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ uris: arrURI })
                });
            })
        });
    }


};
export default Spotify;

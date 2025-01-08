from flask import Flask, request, jsonify
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from model import generate_song  # Import your ML model to generate the song

app = Flask(__name__)

# Spotify OAuth setup
sp_oauth = SpotifyOAuth(client_id='YOUR_SPOTIFY_CLIENT_ID',
                         client_secret='YOUR_SPOTIFY_CLIENT_SECRET',
                         redirect_uri='YOUR_REDIRECT_URI',
                         scope="playlist-read-private")

# Endpoint to get user's playlists
@app.route('/playlists', methods=['GET'])
def get_playlists():
    token = request.headers.get('Authorization').split(" ")[1]
    sp = spotipy.Spotify(auth=token)
    playlists = sp.current_user_playlists()

    playlist_data = [{'id': playlist['id'], 'name': playlist['name']} for playlist in playlists['items']]
    return jsonify({'playlists': playlist_data})

# Endpoint to generate a song from the selected playlist
@app.route('/generate_song', methods=['GET'])
def generate_song_from_playlist():
    playlist_id = request.args.get('playlistId')
    token = request.headers.get('Authorization').split(" ")[1]

    sp = spotipy.Spotify(auth=token)
    tracks = sp.playlist_tracks(playlist_id)['items']
    track_ids = [track['track']['id'] for track in tracks]

    # Get the audio features of each track
    audio_features = []
    for track_id in track_ids:
        features = sp.audio_features(track_id)[0]
        audio_features.append(features)

    # Generate a song based on these audio features
    generated_song_path = generate_song(audio_features)

    # Return the URL to the generated song
    song_url = f"/static/generated_songs/{generated_song_path.split('/')[-1]}"
    return jsonify({'songUrl': song_url})

if __name__ == '__main__':
    app.run(debug=True)

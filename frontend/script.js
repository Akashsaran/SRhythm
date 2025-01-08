const clientId = "YOUR_SPOTIFY_CLIENT_ID"; // Replace with your Spotify Client ID
const redirectUri = "YOUR_REDIRECT_URI"; // Replace with your redirect URI
let accessToken = null;

document.getElementById("loginBtn").addEventListener("click", () => {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=playlist-read-private`;
  window.location.href = authUrl;
});

function getAccessTokenFromUrl() {
  const params = new URLSearchParams(window.location.hash.substring(1));
  return params.get("access_token");
}

async function fetchPlaylists() {
  const response = await fetch("YOUR_BACKEND_URL/playlists", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  const dropdown = document.getElementById("playlistDropdown");

  data.playlists.forEach((playlist) => {
    const option = document.createElement("option");
    option.value = playlist.id;
    option.textContent = playlist.name;
    dropdown.appendChild(option);
  });

  document.getElementById("playlistSelection").style.display = "block";
}

document
  .getElementById("generateSongBtn")
  .addEventListener("click", async () => {
    const selectedPlaylistId =
      document.getElementById("playlistDropdown").value;
    const response = await fetch(
      `YOUR_BACKEND_URL/generate_song?playlistId=${selectedPlaylistId}`,
      {
        method: "GET",
      }
    );

    if (response.ok) {
      const data = await response.json();
      const songUrl = data.songUrl;
      document.getElementById("generatedSong").src = songUrl;
    } else {
      document.getElementById("status").textContent =
        "Error: Could not generate the song.";
    }
  });

window.onload = () => {
  accessToken = getAccessTokenFromUrl();
  if (accessToken) {
    fetchPlaylists();
  }
};

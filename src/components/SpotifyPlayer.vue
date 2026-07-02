<template>
  <div class="playlist-panel">
    <div class="panel-header">
      <span class="panel-title">🎵 Spotify</span>
    </div>

    <div class="panel-body">
      <div v-if="!spotify.isConnected" class="connect-area">
        <p style="color: #aaa; font-size: 13px; margin-bottom: 10px;">
          Verbinde dein Spotify um Playlists zu laden
        </p>
        <button class="btn-connect" @click="spotify.login()">Mit Spotify verbinden</button>
      </div>

      <div v-else>
        <div v-if="!spotify.playerReady && spotify.playerStatus" class="status-msg">
          {{ spotify.playerStatus }}
        </div>

        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>

        <div class="search-row">
          <input
            v-model="searchQuery"
            @input="onSearch"
            type="text"
            placeholder="Playlist suchen..."
            class="search-input"
          />
          <button v-if="searchQuery" @click="clearSearch" class="btn-clear">✕</button>
        </div>

        <div v-if="loading" class="loading-text">Laden...</div>

        <div v-else class="playlist-list">
          <p class="list-label">{{ searchQuery ? 'Suchergebnisse' : 'Meine Playlists' }}</p>
          <div v-if="playlists.length === 0" style="color: #666; font-size: 13px;">
            Keine Playlists gefunden
          </div>
          <div v-for="pl in playlists" :key="pl.id" class="playlist-row">
            <img v-if="pl.images?.[0]" :src="pl.images[0].url" class="pl-cover" />
            <div v-else class="pl-cover-placeholder">♪</div>
            <div class="pl-info">
              <span class="pl-name">{{ pl.name }}</span>
              <span class="pl-tracks">{{ pl.tracks?.total ?? '?' }} Tracks</span>
            </div>
            <button
              @click="play(pl)"
              class="btn-play"
              :disabled="!spotify.playerReady"
              :title="!spotify.playerReady ? 'Player wird geladen...' : 'Abspielen'"
            >▶</button>
          </div>
        </div>

        <button @click="spotify.disconnect()" class="btn-disconnect">Trennen</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSpotifyStore } from '@/stores/spotify'

const spotify = useSpotifyStore()

const searchQuery = ref('')
const playlists = ref<any[]>([])
const loading = ref(false)
const errorMsg = ref('')

onMounted(async () => {
  if (spotify.isConnected) {
    spotify.initPlayer()
    await loadMyPlaylists()
  }
})

async function loadMyPlaylists() {
  loading.value = true
  playlists.value = await spotify.getMyPlaylists()
  loading.value = false
}

async function play(pl: any) {
  errorMsg.value = ''
  const result = await spotify.playPlaylist(pl.uri)
  if (result === 'premium_required') {
    errorMsg.value = 'Spotify Premium wird benötigt'
  } else if (result === 'no_device') {
    errorMsg.value = 'Kein aktives Gerät — öffne Spotify auf einem Gerät'
  }
}

// TODO: debounce
async function onSearch() {
  if (!searchQuery.value.trim()) {
    await loadMyPlaylists()
    return
  }
  loading.value = true
  playlists.value = await spotify.searchPlaylists(searchQuery.value)
  loading.value = false
}

function clearSearch() {
  searchQuery.value = ''
  loadMyPlaylists()
}
</script>

<style scoped>
.playlist-panel {
  background: #111418;
  border: 1px solid #2b313d;
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
}

.panel-header {
  background: #181c24;
  padding: 12px 14px;
  border-bottom: 1px solid #1e232d;
}

.panel-title {
  color: #1db954;
  font-weight: 700;
  font-size: 14px;
}

.panel-body {
  padding: 12px 14px;
}

.connect-area {
  text-align: center;
  padding: 10px 0;
}

.btn-connect {
  background: #1db954;
  color: black;
  border: none;
  border-radius: 20px;
  padding: 9px 20px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}

.btn-connect:hover {
  background: #17a349;
}

.status-msg {
  color: #888;
  font-size: 12px;
  margin-bottom: 10px;
  text-align: center;
}

.error-msg {
  background: #3d1515;
  color: #f87171;
  font-size: 12px;
  padding: 8px 10px;
  border-radius: 6px;
  margin-bottom: 10px;
}

.search-row {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 4px;
}

.search-input {
  flex: 1;
  background: #222834;
  border: 1px solid #384152;
  border-radius: 6px;
  color: white;
  padding: 8px 10px;
  font-size: 13px;
  outline: none;
}

.search-input:focus {
  border-color: #1db954;
}

.btn-clear {
  background: transparent;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
}

.loading-text {
  color: #aaa;
  font-size: 13px;
  margin-top: 8px;
}

.list-label {
  color: #888;
  font-size: 11px;
  text-transform: uppercase;
  margin: 10px 0 6px 0;
  letter-spacing: 0.5px;
}

.playlist-list {
  max-height: 420px;
  overflow-y: auto;
}

.playlist-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 0;
  border-bottom: 1px solid #1e232d;
}

.playlist-row:last-child {
  border-bottom: none;
}

.pl-cover {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
}

.pl-cover-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background: #2b313d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.pl-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.pl-name {
  color: white;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pl-tracks {
  color: #666;
  font-size: 11px;
}

.btn-play {
  background: #1db954;
  border: none;
  color: black;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 13px;
  flex-shrink: 0;
  font-weight: 700;
}

.btn-play:disabled {
  background: #2b313d;
  color: #555;
  cursor: not-allowed;
}

.btn-play:not(:disabled):hover {
  background: #17a349;
}

.btn-disconnect {
  margin-top: 14px;
  background: transparent;
  border: 1px solid #333;
  color: #666;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  width: 100%;
}

.btn-disconnect:hover {
  border-color: #dc2626;
  color: #dc2626;
}
</style>

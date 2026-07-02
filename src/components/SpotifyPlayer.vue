<template>
  <div class="spotify-wrapper">
    <div class="spotify-header" @click="open = !open">
      <span class="spotify-logo">🎵 Spotify</span>
      <span class="toggle-btn">{{ open ? '▲' : '▼' }}</span>
    </div>

    <div v-if="open" class="spotify-body">
      <!-- nicht verbunden -->
      <div v-if="!spotify.isConnected" class="connect-area">
        <p style="color: #aaa; font-size: 13px; margin-bottom: 10px;">Verbinde dein Spotify um Playlists zu laden</p>
        <button class="btn-spotify-connect" @click="spotify.login()">Mit Spotify verbinden</button>
      </div>

      <!-- verbunden -->
      <div v-else>
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

        <div v-if="loading" style="color: #aaa; font-size: 13px; margin-top: 8px;">Laden...</div>

        <!-- Suchergebnisse oder eigene Playlists -->
        <div v-else>
          <p class="list-label">{{ searchQuery ? 'Suchergebnisse' : 'Meine Playlists' }}</p>
          <div v-if="playlists.length === 0" style="color: #666; font-size: 13px;">Keine Playlists gefunden</div>
          <div
            v-for="pl in playlists"
            :key="pl.id"
            class="playlist-row"
          >
            <img
              v-if="pl.images && pl.images[0]"
              :src="pl.images[0].url"
              class="pl-cover"
            />
            <div v-else class="pl-cover-placeholder">♪</div>
            <div class="pl-info">
              <span class="pl-name">{{ pl.name }}</span>
              <span class="pl-tracks">{{ pl.tracks?.total ?? '?' }} Tracks</span>
            </div>
            <a :href="pl.external_urls?.spotify" target="_blank" class="btn-open">
              Öffnen
            </a>
          </div>
        </div>

        <button @click="spotify.disconnect()" class="btn-disconnect">Trennen</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useSpotifyStore } from '@/stores/spotify'

const spotify = useSpotifyStore()

const open = ref(false)
const searchQuery = ref('')
const playlists = ref<any[]>([])
const loading = ref(false)

// eigene playlists laden sobald man aufmacht
watch(open, async (val) => {
  if (val && spotify.isConnected && !searchQuery.value) {
    await loadMyPlaylists()
  }
})

async function loadMyPlaylists() {
  loading.value = true
  playlists.value = await spotify.getMyPlaylists()
  loading.value = false
}

// TODO: debounce hier würde sinn machen aber erstmal so
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
.spotify-wrapper {
  background: #111418;
  border: 1px solid #2b313d;
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.spotify-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  cursor: pointer;
  user-select: none;
  background: #181c24;
}

.spotify-logo {
  color: #1db954;
  font-weight: 700;
  font-size: 14px;
}

.toggle-btn {
  color: #aaa;
  font-size: 12px;
}

.spotify-body {
  padding: 12px 14px;
}

.connect-area {
  text-align: center;
}

.btn-spotify-connect {
  background: #1db954;
  color: black;
  border: none;
  border-radius: 20px;
  padding: 9px 20px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}

.btn-spotify-connect:hover {
  background: #17a349;
}

.search-row {
  display: flex;
  gap: 6px;
  align-items: center;
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

.list-label {
  color: #888;
  font-size: 11px;
  text-transform: uppercase;
  margin: 10px 0 6px 0;
  letter-spacing: 0.5px;
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

.btn-open {
  background: #1db954;
  color: black;
  text-decoration: none;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 12px;
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-open:hover {
  background: #17a349;
}

.btn-disconnect {
  margin-top: 12px;
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

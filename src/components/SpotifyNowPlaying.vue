<template>
  <div class="now-playing-bar" v-if="spotify.isConnected">
    <!-- linke seite: cover + song info -->
    <div class="track-info">
      <template v-if="spotify.currentTrack">
        <img v-if="spotify.currentTrack.albumArt" :src="spotify.currentTrack.albumArt" class="cover" />
        <div v-else class="cover-placeholder">♪</div>
        <div class="meta">
          <span class="track-name">{{ spotify.currentTrack.name }}</span>
          <span class="artist">{{ spotify.currentTrack.artist }}</span>
        </div>
      </template>
      <template v-else>
        <div class="cover-placeholder">♪</div>
        <div class="meta">
          <span class="track-name" style="color: #555;">{{ spotify.playerStatus || 'Nichts läuft gerade' }}</span>
        </div>
      </template>
    </div>

    <!-- mitte: controls -->
    <div class="controls">
      <button class="ctrl-btn" @click="spotify.skipPrevious()">⏮</button>
      <button class="ctrl-btn play-btn" @click="togglePlay">
        {{ spotify.isPlaying ? '⏸' : '▶' }}
      </button>
      <button class="ctrl-btn" @click="spotify.skipNext()">⏭</button>
    </div>

    <!-- rechte seite: leer oder später volume etc -->
    <div class="right-side"></div>
  </div>
</template>

<script setup lang="ts">
import { useSpotifyStore } from '@/stores/spotify'

const spotify = useSpotifyStore()

async function togglePlay() {
  if (spotify.isPlaying) {
    await spotify.pausePlayback()
  } else {
    await spotify.resumePlayback()
  }
}
</script>

<style scoped>
.now-playing-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0d1017;
  border-bottom: 1px solid #1e232d;
  padding: 10px 20px;
  height: 64px;
  gap: 16px;
}

.track-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.cover {
  width: 44px;
  height: 44px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
}

.cover-placeholder {
  width: 44px;
  height: 44px;
  border-radius: 4px;
  background: #1e232d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.track-name {
  color: white;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
}

.artist {
  color: #888;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.ctrl-btn {
  background: transparent;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
  line-height: 1;
  transition: color 0.15s;
}

.ctrl-btn:hover {
  color: white;
}

.play-btn {
  background: #1db954;
  color: black;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-btn:hover {
  background: #17a349;
  color: black;
}

.right-side {
  flex: 1;
}
</style>

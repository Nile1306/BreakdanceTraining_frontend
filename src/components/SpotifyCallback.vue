<template>
  <div style="text-align:center; margin-top: 100px; color: white;">
    <p v-if="error">Fehler beim Verbinden mit Spotify :(</p>
    <p v-else>Verbinde mit Spotify...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSpotifyStore } from '@/stores/spotify'

const router = useRouter()
const spotify = useSpotifyStore()
const error = ref(false)

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')

  if (!code) {
    error.value = true
    return
  }

  const ok = await spotify.handleCallback(code)
  if (ok) {
    router.push('/')
  } else {
    error.value = true
  }
})
</script>

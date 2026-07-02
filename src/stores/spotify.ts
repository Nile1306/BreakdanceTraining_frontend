import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI
const SCOPES = 'playlist-read-private playlist-read-collaborative user-read-playback-state user-modify-playback-state streaming user-read-email user-read-private'

function generateVerifier(length = 128) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const arr = crypto.getRandomValues(new Uint8Array(length))
  return arr.reduce((acc: string, x: number) => acc + chars[x % chars.length], '')
}

async function generateChallenge(verifier: string) {
  const data = new TextEncoder().encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export const useSpotifyStore = defineStore('spotify', () => {
  const accessToken = ref(localStorage.getItem('spotify_token') || '')
  const expiresAt = ref(Number(localStorage.getItem('spotify_expires_at')) || 0)

  const isConnected = computed(() => !!accessToken.value && Date.now() < expiresAt.value)

  async function login() {
    const verifier = generateVerifier()
    const challenge = await generateChallenge(verifier)
    localStorage.setItem('spotify_verifier', verifier)

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      code_challenge_method: 'S256',
      code_challenge: challenge,
    })

    window.location.href = `https://accounts.spotify.com/authorize?${params}`
  }

  async function handleCallback(code: string) {
    const verifier = localStorage.getItem('spotify_verifier')
    if (!verifier) {
      console.error('kein verifier gefunden')
      return false
    }

    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: verifier,
      }),
    })

    const data = await res.json()
    console.log('spotify auth:', data)

    if (!data.access_token) return false

    accessToken.value = data.access_token
    expiresAt.value = Date.now() + data.expires_in * 1000

    localStorage.setItem('spotify_token', data.access_token)
    localStorage.setItem('spotify_expires_at', expiresAt.value.toString())
    localStorage.removeItem('spotify_verifier')
    return true
  }

  // TODO: refresh token implementieren irgendwann
  async function searchPlaylists(query: string) {
    if (!query.trim()) return []

    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=12`,
      { headers: { Authorization: `Bearer ${accessToken.value}` } }
    )
    const data = await res.json()
    if (data.error) {
      console.error('spotify search error', data.error)
      return []
    }
    return data.playlists?.items?.filter(Boolean) ?? []
  }

  async function getMyPlaylists() {
    const res = await fetch('https://api.spotify.com/v1/me/playlists?limit=20', {
      headers: { Authorization: `Bearer ${accessToken.value}` }
    })
    const data = await res.json()
    if (data.error) return []
    return data.items ?? []
  }

  async function playPlaylist(uri: string) {
    const res = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ context_uri: uri }),
    })
    if (res.status === 403) return 'premium_required'
    if (res.status === 404) return 'no_device'
    return 'ok'
  }

  async function getCurrentPlayback() {
    const res = await fetch('https://api.spotify.com/v1/me/player', {
      headers: { Authorization: `Bearer ${accessToken.value}` },
    })
    if (res.status === 204 || !res.ok) return null
    return await res.json()
  }

  async function pausePlayback() {
    await fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken.value}` },
    })
  }

  async function resumePlayback() {
    await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken.value}` },
    })
  }

  async function skipNext() {
    await fetch('https://api.spotify.com/v1/me/player/next', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken.value}` },
    })
  }

  function disconnect() {
    accessToken.value = ''
    expiresAt.value = 0
    localStorage.removeItem('spotify_token')
    localStorage.removeItem('spotify_expires_at')
  }

  return {
    accessToken,
    isConnected,
    login,
    handleCallback,
    searchPlaylists,
    getMyPlaylists,
    playPlaylist,
    getCurrentPlayback,
    pausePlayback,
    resumePlayback,
    skipNext,
    disconnect,
  }
})

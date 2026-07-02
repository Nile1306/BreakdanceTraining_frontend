import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:5173/callback'
const SCOPES = 'playlist-read-private playlist-read-collaborative user-read-playback-state user-modify-playback-state streaming user-read-email user-read-private'

// module-level, pinia macht komplexe objekte kaputt wenn man sie reactive macht
let _player: any = null

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

function loadSDKScript(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).Spotify) { resolve(); return }
    const script = document.createElement('script')
    script.src = 'https://sdk.scdn.co/spotify-player.js'
    script.async = true
    document.body.appendChild(script)
    ;(window as any).onSpotifyWebPlaybackSDKReady = () => resolve()
  })
}

export const useSpotifyStore = defineStore('spotify', () => {
  const accessToken = ref(localStorage.getItem('spotify_token') || '')
  const expiresAt = ref(Number(localStorage.getItem('spotify_expires_at')) || 0)

  // player state
  const deviceId = ref('')
  const playerReady = ref(false)
  const playerStatus = ref('')
  const isPlaying = ref(false)
  const currentTrack = ref<{ name: string; artist: string; albumArt: string } | null>(null)

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

  async function initPlayer() {
    if (_player) return
    playerStatus.value = 'Player wird geladen...'
    await loadSDKScript()

    _player = new (window as any).Spotify.Player({
      name: 'Breakdance Training',
      getOAuthToken: (cb: (t: string) => void) => cb(accessToken.value),
      volume: 0.8,
    })

    _player.addListener('ready', ({ device_id }: any) => {
      console.log('spotify player ready:', device_id)
      deviceId.value = device_id
      playerReady.value = true
      playerStatus.value = ''
    })

    _player.addListener('not_ready', () => {
      deviceId.value = ''
      playerReady.value = false
      playerStatus.value = 'Player nicht bereit'
    })

    _player.addListener('player_state_changed', (state: any) => {
      if (!state) return
      isPlaying.value = !state.paused
      const track = state.track_window?.current_track
      if (track) {
        currentTrack.value = {
          name: track.name,
          artist: track.artists?.map((a: any) => a.name).join(', ') ?? '',
          albumArt: track.album?.images?.[1]?.url ?? '',
        }
      }
    })

    _player.addListener('account_error', () => {
      playerStatus.value = 'Spotify Premium benötigt'
    })

    _player.addListener('authentication_error', ({ message }: any) => {
      console.error('auth error', message)
      playerStatus.value = 'Auth Fehler'
    })

    _player.connect()
  }

  function disconnectPlayer() {
    if (_player) {
      _player.disconnect()
      _player = null
    }
    deviceId.value = ''
    playerReady.value = false
    currentTrack.value = null
    isPlaying.value = false
  }

  // TODO: refresh token implementieren irgendwann
  async function searchPlaylists(query: string) {
    if (!query.trim()) return []
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=12`,
      { headers: { Authorization: `Bearer ${accessToken.value}` } }
    )
    const data = await res.json()
    if (data.error) { console.error('spotify search error', data.error); return [] }
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

  async function getDeviceId() {
    if (deviceId.value) return deviceId.value

    // fallback: direkt von api holen falls ready event noch nicht gefeuert hat
    const res = await fetch('https://api.spotify.com/v1/me/player/devices', {
      headers: { Authorization: `Bearer ${accessToken.value}` },
    })
    const data = await res.json()
    console.log('verfügbare geräte:', data.devices)
    const mine = data.devices?.find((d: any) => d.name === 'Breakdance Training')
    if (mine) {
      deviceId.value = mine.id
      return mine.id
    }
    return ''
  }

  async function playPlaylist(uri: string) {
    const id = await getDeviceId()
    console.log('play auf device:', id, 'uri:', uri)

    // zuerst playback auf browser device übertragen
    if (id) {
      await fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken.value}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_ids: [id], play: false }),
      })
    }

    const url = id
      ? `https://api.spotify.com/v1/me/player/play?device_id=${id}`
      : 'https://api.spotify.com/v1/me/player/play'

    const body = uri ? JSON.stringify({ context_uri: uri }) : undefined
    const res = await fetch(url, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken.value}`, 'Content-Type': 'application/json' },
      body,
    })
    console.log('play response status:', res.status)
    if (res.status === 403) return 'premium_required'
    if (res.status === 404) return 'no_device'
    return 'ok'
  }

  async function pausePlayback() {
    await fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken.value}` },
    })
    isPlaying.value = false
  }

  async function resumePlayback() {
    await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken.value}` },
    })
    isPlaying.value = true
  }

  async function skipNext() {
    await fetch('https://api.spotify.com/v1/me/player/next', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken.value}` },
    })
  }

  async function skipPrevious() {
    await fetch('https://api.spotify.com/v1/me/player/previous', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken.value}` },
    })
  }

  function disconnect() {
    disconnectPlayer()
    accessToken.value = ''
    expiresAt.value = 0
    localStorage.removeItem('spotify_token')
    localStorage.removeItem('spotify_expires_at')
  }

  return {
    accessToken,
    isConnected,
    deviceId,
    playerReady,
    playerStatus,
    isPlaying,
    currentTrack,
    login,
    handleCallback,
    initPlayer,
    searchPlaylists,
    getMyPlaylists,
    playPlaylist,
    pausePlayback,
    resumePlayback,
    skipNext,
    skipPrevious,
    disconnect,
  }
})

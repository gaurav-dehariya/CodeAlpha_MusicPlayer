/**
 * Professional Music Player
 * A complete music player with playlist, autoplay, and responsive design
 */

class MusicPlayer {
    constructor() {
        // Audio elements and controls
        this.audioPlayer = document.getElementById('audioPlayer');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        // Progress and time elements
        this.progressBar = document.getElementById('progressBar');
        this.progress = document.getElementById('progress');
        this.currentTimeEl = document.getElementById('currentTime');
        this.totalTimeEl = document.getElementById('totalTime');
        
        // Volume and playlist elements
        this.volumeSlider = document.getElementById('volumeSlider');
        this.playlistToggle = document.getElementById('playlistToggle');
        this.playlistItems = document.getElementById('playlistItems');
        this.autoplayToggle = document.getElementById('autoplayToggle');
        
        // Player state
        this.isPlaying = false;
        this.currentSongIndex = 0;
        this.isPlaylistVisible = false;
        this.autoplayEnabled = false;
        
        // Sample playlist - Replace with your actual audio files
        this.playlist = [
            {
                title: "Sunset Dreams",
                artist: "Ambient Waves",
                duration: "3:45",
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
            },
            {
                title: "Digital Harmony",
                artist: "Tech Beats",
                duration: "4:20",
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
            },
            {
                title: "Ocean Breeze",
                artist: "Nature Sounds",
                duration: "2:58",
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
            },
            {
                title: "City Lights",
                artist: "Urban Vibes",
                duration: "3:32",
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
            },
            {
                title: "Mountain Echo",
                artist: "Acoustic Folk",
                duration: "4:15",
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
            }
        ];
        
        // Initialize the player
        this.init();
    }
    
    /**
     * Initialize the music player
     */
    init() {
        this.loadSong(this.currentSongIndex);
        this.createPlaylist();
        this.attachEventListeners();
        this.audioPlayer.volume = 0.5;
    }
    
    /**
     * Attach all event listeners
     */
    attachEventListeners() {
        // Play/Pause button
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        
        // Previous/Next buttons
        this.prevBtn.addEventListener('click', () => this.previousSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        
        // Progress bar click
        this.progressBar.addEventListener('click', (e) => this.setProgress(e));
        
        // Volume control
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e));
        
        // Playlist toggle
        this.playlistToggle.addEventListener('click', () => this.togglePlaylist());
        
        // Autoplay toggle
        this.autoplayToggle.addEventListener('click', () => this.toggleAutoplay());
        
        // Audio events
        this.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
        this.audioPlayer.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audioPlayer.addEventListener('ended', () => this.handleSongEnd());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    /**
     * Load a song by index
     * @param {number} index - The index of the song in the playlist
     */
    loadSong(index) {
        const song = this.playlist[index];
        document.querySelector('.song-title').textContent = song.title;
        document.querySelector('.artist-name').textContent = song.artist;
        this.audioPlayer.src = song.src;
        this.updateActivePlaylistItem();
    }
    
    /**
     * Toggle play/pause state
     */
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    /**
     * Play the current song
     */
    play() {
        this.audioPlayer.play()
            .then(() => {
                this.isPlaying = true;
                this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                document.querySelector('.album-art').style.animationPlayState = 'running';
            })
            .catch((error) => {
                console.error('Error playing audio:', error);
            });
    }
    
    /**
     * Pause the current song
     */
    pause() {
        this.audioPlayer.pause();
        this.isPlaying = false;
        this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        document.querySelector('.album-art').style.animationPlayState = 'paused';
    }
    
    /**
     * Play the previous song
     */
    previousSong() {
        this.currentSongIndex = this.currentSongIndex > 0 
            ? this.currentSongIndex - 1 
            : this.playlist.length - 1;
        this.loadSong(this.currentSongIndex);
        if (this.isPlaying) {
            this.play();
        }
    }
    
    /**
     * Play the next song
     */
    nextSong() {
        this.currentSongIndex = this.currentSongIndex < this.playlist.length - 1 
            ? this.currentSongIndex + 1 
            : 0;
        this.loadSong(this.currentSongIndex);
        if (this.isPlaying) {
            this.play();
        }
    }
    
    /**
     * Set progress by clicking on progress bar
     * @param {Event} e - The click event
     */
    setProgress(e) {
        const width = this.progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audioPlayer.duration;
        
        if (duration) {
            this.audioPlayer.currentTime = (clickX / width) * duration;
        }
    }
    
    /**
     * Set volume from slider
     * @param {Event} e - The input event
     */
    setVolume(e) {
        this.audioPlayer.volume = e.target.value / 100;
        
        // Update volume icon based on level
        const volumeIcons = document.querySelectorAll('.volume-container i');
        const volumeLevel = e.target.value;
        
        if (volumeLevel == 0) {
            volumeIcons[0].className = 'fas fa-volume-mute';
        } else if (volumeLevel < 50) {
            volumeIcons[0].className = 'fas fa-volume-down';
        } else {
            volumeIcons[0].className = 'fas fa-volume-up';
        }
    }
    
    /**
     * Update progress bar and time display
     */
    updateProgress() {
        const { duration, currentTime } = this.audioPlayer;
        
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            this.progress.style.width = `${progressPercent}%`;
        }
        
        this.currentTimeEl.textContent = this.formatTime(currentTime);
    }
    
    /**
     * Update total duration display
     */
    updateDuration() {
        this.totalTimeEl.textContent = this.formatTime(this.audioPlayer.duration);
    }
    
    /**
     * Format time in MM:SS format
     * @param {number} time - Time in seconds
     * @returns {string} Formatted time string
     */
    formatTime(time) {
        if (isNaN(time)) return '0:00';
        
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    /**
     * Create playlist UI
     */
    createPlaylist() {
        this.playlistItems.innerHTML = '';
        
        this.playlist.forEach((song, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.innerHTML = `
                <div class="playlist-item-info">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
                <div class="playlist-item-duration">${song.duration}</div>
            `;
            
            item.addEventListener('click', () => this.selectSong(index));
            this.playlistItems.appendChild(item);
        });
        
        this.updateActivePlaylistItem();
    }
    
    /**
     * Select a song from playlist
     * @param {number} index - The index of the selected song
     */
    selectSong(index) {
        this.currentSongIndex = index;
        this.loadSong(index);
        if (this.isPlaying) {
            this.play();
        }
    }
    
    /**
     * Update active playlist item styling
     */
    updateActivePlaylistItem() {
        const items = this.playlistItems.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentSongIndex);
        });
    }
    
    /**
     * Toggle playlist visibility
     */
    togglePlaylist() {
        this.isPlaylistVisible = !this.isPlaylistVisible;
        this.playlistItems.classList.toggle('show', this.isPlaylistVisible);
        this.playlistToggle.textContent = this.isPlaylistVisible ? 'Hide' : 'Show';
    }
    
    /**
     * Toggle autoplay feature
     */
    toggleAutoplay() {
        this.autoplayEnabled = !this.autoplayEnabled;
        this.autoplayToggle.classList.toggle('active', this.autoplayEnabled);
    }
    
    /**
     * Handle song end event
     */
    handleSongEnd() {
        if (this.autoplayEnabled) {
            this.nextSong();
        } else {
            this.pause();
        }
    }
    
    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} e - The keyboard event
     */
    handleKeyboard(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.previousSong();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSong();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.adjustVolume(10);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.adjustVolume(-10);
                break;
        }
    }
    
    /**
     * Adjust volume by a certain amount
     * @param {number} change - The amount to change volume by
     */
    adjustVolume(change) {
        const currentVolume = this.audioPlayer.volume * 100;
        const newVolume = Math.max(0, Math.min(100, currentVolume + change));
        
        this.volumeSlider.value = newVolume;
        this.audioPlayer.volume = newVolume / 100;
        
        // Trigger volume change event to update icon
        this.volumeSlider.dispatchEvent(new Event('input'));
    }
    
    /**
     * Shuffle playlist
     */
    shufflePlaylist() {
        for (let i = this.playlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.playlist[i], this.playlist[j]] = [this.playlist[j], this.playlist[i]];
        }
        this.createPlaylist();
        this.currentSongIndex = 0;
        this.loadSong(this.currentSongIndex);
    }
    
    /**
     * Add a new song to playlist
     * @param {Object} song - Song object with title, artist, duration, and src
     */
    addSongToPlaylist(song) {
        this.playlist.push(song);
        this.createPlaylist();
    }
    
    /**
     * Remove a song from playlist
     * @param {number} index - Index of song to remove
     */
    removeSongFromPlaylist(index) {
        if (index >= 0 && index < this.playlist.length) {
            this.playlist.splice(index, 1);
            
            // Adjust current song index if necessary
            if (this.currentSongIndex >= index) {
                this.currentSongIndex = Math.max(0, this.currentSongIndex - 1);
            }
            
            this.createPlaylist();
            
            // Load new current song if playlist is not empty
            if (this.playlist.length > 0) {
                this.loadSong(this.currentSongIndex);
            }
        }
    }
}

// Initialize the music player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global instance
    window.musicPlayer = new MusicPlayer();
    
    console.log('🎵 Music Player Loaded Successfully!');
    console.log('⌨️  Keyboard Shortcuts:');
    console.log('   Space: Play/Pause');
    console.log('   ←→: Previous/Next Song');
    console.log('   ↑↓: Volume Up/Down');
});
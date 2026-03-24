/**
 * © 2026 神思庭艺术智能工作室 (AIS) | 著作权人：金威
 * 版权所有，未经授权禁止商业使用 | shensist.top
 */
class GenesisAUI {
    constructor() {
        this.database = window.ShensistDatabase;
        this.currentActor = this.database.actors[0]; // Default: Nine-tailed Fox
        this.isListening = false;
        this.speechSupported = false;
        this.recognition = null;
        this.audioPlayer = new Audio();
        this.currentTrackIndex = 0;
        this.hasInteracted = false;
        
        this.init();
    }

    init() {
        console.log("🌌 Genesis AUI Initializing...");
        this.setupElements();
        this.setupSpeechRecognition();
        this.populatePlaylist(); 
        this.renderActors();
        this.switchActor(this.currentActor.id);
        this.bindEvents();
        
        // Initial tab check
        this.switchTab('lyrics');
    }

    populatePlaylist() {
        this.renderMusicList();
    }

    renderMusicList() {
        const musicList = document.getElementById('music-list');
        if (!musicList) return;
        
        musicList.innerHTML = '';
        this.database.playlist.forEach((track, index) => {
            const item = document.createElement('div');
            item.className = 'music-item';
            if (index === this.currentTrackIndex) item.classList.add('active');
            
            item.innerHTML = `
                <div class="music-item-info">
                    <div class="music-item-name">${track.name}</div>
                    <div class="music-item-meta">神思庭 · AIS</div>
                </div>
                <div class="music-item-status">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
            `;
            
            item.onclick = () => {
                this.hasInteracted = true;
                this.switchTrack(index);
            };
            musicList.appendChild(item);
        });
    }

    setupElements() {
        this.listenBtn = document.getElementById('listen-btn');
        this.agentName = document.getElementById('agent-name');
        this.agentText = document.getElementById('agent-text');
        this.statusText = document.getElementById('agent-status-text');
        this.actorList = document.getElementById('actor-list');
        this.bgVideo = document.getElementById('bg-video');
        this.mvAudio = document.getElementById('mv-audio');
        this.actorPortrait = document.getElementById('actor-portrait');
        this.archivesPanel = document.getElementById('archives-panel');
        this.archivesToggle = document.getElementById('toggle-archives'); // Main toggle button
        this.archivesClose = document.getElementById('close-archives');
        this.archivesOpenerIcon = document.getElementById('toggle-archives-btn'); // Internal toggle button
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.contentLyrics = document.getElementById('content-lyrics');
        this.contentNovel = document.getElementById('content-novel');
        this.contentMusic = document.getElementById('content-music');
        this.contentVideo = document.getElementById('content-video');
        
        // Music Player Controls (New Compact Layout)
        this.musicPlayBtn = document.getElementById('music-play');
        this.musicPauseBtn = document.getElementById('music-pause');
        this.musicStopBtn = document.getElementById('music-stop');
        this.musicNextBtn = document.getElementById('music-next');
        this.musicProgress = document.getElementById('music-progress');
        this.currentTimeLabel = document.getElementById('current-time');
        this.totalTimeLabel = document.getElementById('total-time');
        this.toggleFullscreenBtn = document.getElementById('toggle-fullscreen');
    }

    setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'zh-CN';
            this.recognition.interimResults = false;
            this.recognition.maxAlternatives = 1;

            this.recognition.onstart = () => {
                this.isListening = true;
                this.listenBtn.classList.add('listening');
                this.updateStatus("正在监听频率...");
                
                // Mute all audio/video while listening
                this.mvAudio.pause();
                this.bgVideo.pause();
                this.audioPlayer.pause();
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                console.log("Captured:", transcript);
                this.handleUserInput(transcript);
            };

            this.recognition.onerror = (event) => {
                console.error("Recognition error:", event.error);
                this.stopListening();
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.listenBtn.classList.remove('listening');
                this.updateStatus();
            };
            this.speechSupported = true;
        } else {
            console.warn("Speech Recognition not supported in this browser.");
            this.speechSupported = false;
            this.statusText.innerText = "建议使用 Chrome/Safari 开启全息语音";
        }
    }

    updateStatus(message) {
        if (message) {
            this.statusText.innerText = message;
            return;
        }

        if (this.speechSupported) {
            this.statusText.innerText = `${this.currentActor.name} 已就绪`;
        } else {
            this.statusText.innerText = "建议使用 Chrome/Safari 开启全息语音";
        }
    }

    bindEvents() {
        this.listenBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.hasInteracted = true;
            this.toggleListening();
        });
        
        // Music Player Controls
        if (this.musicPlayBtn) this.musicPlayBtn.addEventListener('click', () => {
            this.hasInteracted = true;
            this.playAudio();
        });
        if (this.musicPauseBtn) this.musicPauseBtn.addEventListener('click', () => this.pauseAudio());
        if (this.musicStopBtn) this.musicStopBtn.addEventListener('click', () => this.stopAudio());
        if (this.musicNextBtn) this.musicNextBtn.addEventListener('click', () => this.playNextTrack());
        
        // Archives Panel Controls
        if (this.archivesToggle) {
            this.archivesToggle.addEventListener('click', () => this.toggleArchives(!this.archivesPanel.classList.contains('open')));
        }
        if (this.archivesOpenerIcon) {
            this.archivesOpenerIcon.addEventListener('click', () => this.toggleArchives(!this.archivesPanel.classList.contains('open')));
        }
        if (this.archivesClose) {
            this.archivesClose.addEventListener('click', () => this.toggleArchives(false));
        }
        if (this.toggleFullscreenBtn) {
            this.toggleFullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }
        
        // Progress control
        this.mvAudio.addEventListener('timeupdate', () => this.updateProgress());
        this.mvAudio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.musicProgress.addEventListener('input', (e) => this.seek(e.target.value));

        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
    }

    toggleArchives(show) {
        console.log("📂 Toggling Archives:", show);
        if (show) {
            this.archivesPanel.classList.add('open');
            document.body.classList.add('archives-open');
            this.loadArchiveContent();
            
            // Ensure first tab is active
            if (!document.querySelector('.tab-btn.active')) {
                this.switchTab('lyrics');
            }
        } else {
            this.archivesPanel.classList.remove('open');
            document.body.classList.remove('archives-open');
        }
    }

    switchTab(tab) {
        console.log("📑 Switching to Tab:", tab);
        this.tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
        document.querySelectorAll('.content-view').forEach(view => {
            const isActive = view.id === `content-${tab}`;
            view.classList.toggle('active', isActive);
            if (isActive) console.log(`✅ Activated view: ${view.id}`);
        });
    }

    async loadArchiveContent() {
        console.log("📥 Attempting to load archive content...");
        
        // Load Lyrics
        try {
            const lyricsRes = await fetch('assets/shensist_genesis_lyrics.txt?v=' + Date.now());
            if (lyricsRes.ok) {
                const text = await lyricsRes.text();
                this.contentLyrics.innerText = text;
                console.log("✅ Lyrics loaded (" + text.length + " bytes)");
            } else {
                console.warn("❌ Failed to load lyrics:", lyricsRes.status);
                this.contentLyrics.innerText = "暂时无法加载歌词频率。";
            }
        } catch (e) {
            console.error("❌ Error loading lyrics:", e);
        }

        // Load Novel
        try {
            const novelRes = await fetch('assets/shensist_genesis_novel.txt?v=' + Date.now());
            if (novelRes.ok) {
                const text = await novelRes.text();
                this.contentNovel.innerText = text;
                console.log("✅ Novel loaded (" + text.length + " bytes)");
            } else {
                console.warn("❌ Failed to load novel:", novelRes.status);
                this.contentNovel.innerText = "暂时无法读取山海经脉。";
            }
        } catch (e) {
            console.error("❌ Error loading novel:", e);
        }

        // Load Theater (Videos) - Don't use fetch, use database
        try {
            if (this.contentVideo.children.length <= 1) { // 1 if placeholder exists
                this.contentVideo.innerHTML = ""; // Clear placeholder
                const videos = this.database.videos || [];
                console.log("🎬 Rendering " + videos.length + " theater items...");
                videos.forEach(video => {
                    const item = document.createElement('div');
                    item.className = 'theater-item';
                    item.innerHTML = `
                        <h4>${video.name}</h4>
                        <iframe class="video-frame" src="${video.url}" frameborder="0" allowfullscreen loading="lazy"></iframe>
                    `;
                    this.contentVideo.appendChild(item);
                });
            }
        } catch (e) {
            console.error("❌ Error rendering theater:", e);
        }
    }

    switchTrack(index) {
        console.log(`🎵 Switching to track ${index}`);
        this.currentTrackIndex = parseInt(index);
        const track = this.database.playlist[this.currentTrackIndex];
        this.mvAudio.src = track.src;
        this.playAudio();
        
        // Update list active state
        document.querySelectorAll('.music-item').forEach((el, idx) => {
            el.classList.toggle('active', idx === this.currentTrackIndex);
        });
    }

    toggleListening() {
        if (!this.recognition) {
            this.statusText.innerText = "语音技术未由当前浏览器同步";
            return;
        }
        
        if (this.isListening) {
            this.recognition.stop();
        } else {
            console.log("🎙️ Starting Speech Recognition...");
            try {
                this.recognition.start();
            } catch (e) {
                console.error("Speech recognition start failed:", e);
                this.statusText.innerText = "语音初始化失败，请在浏览器中允许麦克风权限";
            }
        }
    }

    playAudio() {
        console.log("▶️ Playing Audio");
        this.mvAudio.play().catch(e => console.warn("Play blocked:", e));
        if (this.musicPlayBtn) this.musicPlayBtn.style.display = 'none';
        if (this.musicPauseBtn) this.musicPauseBtn.style.display = 'flex';
    }

    pauseAudio() {
        console.log("⏸️ Pausing Audio");
        this.mvAudio.pause();
        if (this.musicPlayBtn) this.musicPlayBtn.style.display = 'flex';
        if (this.musicPauseBtn) this.musicPauseBtn.style.display = 'none';
    }

    stopAudio() {
        console.log("⏹️ Stopping Audio");
        this.mvAudio.pause();
        this.mvAudio.currentTime = 0;
        if (this.musicPlayBtn) this.musicPlayBtn.style.display = 'flex';
        if (this.musicPauseBtn) this.musicPauseBtn.style.display = 'none';
    }

    playNextTrack() {
        const next = (this.currentTrackIndex + 1) % this.database.playlist.length;
        this.switchTrack(next);
    }

    updateProgress() {
        const cur = this.mvAudio.currentTime;
        const dur = this.mvAudio.duration || 0;
        this.musicProgress.value = (cur / dur) * 100 || 0;
        this.currentTimeLabel.innerText = this.formatTime(cur);
    }

    updateDuration() {
        this.totalTimeLabel.innerText = this.formatTime(this.mvAudio.duration);
    }

    seek(percent) {
        const dur = this.mvAudio.duration || 0;
        this.mvAudio.currentTime = (percent / 100) * dur;
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return "00:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    toggleFullscreen() {
        this.archivesPanel.classList.toggle('fullscreen');
        const isFS = this.archivesPanel.classList.contains('fullscreen');
        this.toggleFullscreenBtn.title = isFS ? "退出全屏" : "全屏查看";
    }

    toggleMusic(force) {
        const shouldPlay = force !== undefined ? force : this.mvAudio.paused;
        if (shouldPlay) {
            this.playAudio();
        } else {
            this.pauseAudio();
        }
    }

    toggleVideo(force) {
        const shouldPlay = force !== undefined ? force : this.bgVideo.paused;
        if (shouldPlay) {
            this.bgVideo.play();
            this.videoToggle.classList.remove('off');
            this.videoToggle.title = "关闭背景视频";
            this.bgVideo.style.opacity = "1";
        } else {
            this.bgVideo.pause();
            this.videoToggle.classList.add('off');
            this.videoToggle.title = "开启背景视频";
            this.bgVideo.style.opacity = "0.2"; 
        }
    }

    renderActors() {
        this.actorList.innerHTML = '';
        this.database.actors.forEach(actor => {
            const item = document.createElement('div');
            item.className = 'actor-item';
            item.dataset.id = actor.id;
            item.innerHTML = `
                <span class="actor-name">${actor.name}</span>
                <span class="actor-trait">${actor.traits.join(' · ')}</span>
            `;
            item.onclick = () => {
                this.hasInteracted = true;
                this.switchActor(actor.id);
            };
            this.actorList.appendChild(item);
        });
    }

    switchActor(id) {
        const actor = this.database.actors.find(a => a.id === id);
        if (!actor) return;

        this.currentActor = actor;
        this.agentName.innerText = actor.name;
        this.agentText.innerText = actor.greeting;
        
        // Update Portrait
        if (actor.image) {
            this.actorPortrait.src = actor.image;
            // Apply custom positioning if available, default to center
            this.actorPortrait.style.objectPosition = actor.objectPosition || 'center';
        }
        
        // Update active state in UI
        document.querySelectorAll('.actor-item').forEach(el => {
            el.classList.toggle('active', el.dataset.id === id);
        });

        this.updateStatus();
        
        // Only auto-speak if it's not the initial setup (user clicked)
        if (id !== this.database.actors[0].id || this.hasInteracted) {
            this.speak(actor.greeting);
        }
    }

    async handleUserInput(text) {
        this.agentText.innerText = `“${text}”`;
        this.statusText.innerText = "正在穿越算法海洋...";

        // Precise Archive Navigation (Immediate Feedback)
        if (text.includes("歌词")) {
            this.switchTab('lyrics');
            this.toggleArchives(true);
        } else if (text.includes("小说")) {
            this.switchTab('novel');
            this.toggleArchives(true);
        } else if (text.includes("音乐") || text.includes("歌") || text.includes("曲")) {
            this.switchTab('music');
            this.toggleArchives(true);
        } else if (text.includes("视频") || text.includes("剧场") || text.includes("看片")) {
            this.switchTab('video');
            this.toggleArchives(true);
        } else if (text.includes("档案") || text.includes("库")) {
            this.toggleArchives(true);
        }

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: text, 
                    character_id: this.currentActor.id 
                })
            });
            const data = await response.json();
            this.displayResponse(data.message);
            
            // Handle Media Instructions
            const lowerText = text.toLowerCase();
            if (lowerText.includes("播放音乐") || lowerText.includes("开启音乐")) {
                this.toggleMusic(true);
            } else if (lowerText.includes("停止音乐") || lowerText.includes("关闭音乐")) {
                this.toggleMusic(false);
            } else if (lowerText.includes("开启视频") || lowerText.includes("播放视频")) {
                this.toggleVideo(true);
            } else if (lowerText.includes("关闭视频") || lowerText.includes("停止视频")) {
                this.toggleVideo(false);
            }

        } catch (error) {
            console.error("Chat error:", error);
            this.displayResponse("信号受到干扰，请重新连接。");
        }
    }

    displayResponse(text) {
        this.agentText.innerText = text;
        this.statusText.innerText = `${this.currentActor.name} 正在回应`;
        this.speak(text);
    }

    async speak(text) {
        if (!text) return;

        try {
            const response = await fetch('/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    text: text, 
                    character_id: this.currentActor.id,
                    voice: this.currentActor.voice 
                })
            });
            const data = await response.json();
            if (data.audio_url) {
                this.audioPlayer.src = data.audio_url + "?t=" + Date.now();
                this.audioPlayer.play().catch(e => {
                    console.log("Autoplay blocked, click button to hear voice.");
                });
            }
        } catch (error) {
            console.error("TTS error:", error);
        }
    }

    stopListening() {
        this.isListening = false;
        this.listenBtn.classList.remove('listening');
        if (this.statusText.innerText === "正在监听频率...") {
           this.statusText.innerText = `${this.currentActor.name} 等待唤醒`;
        }
    }
}

// Start Genesis
window.onload = () => {
    window.GenesisAgent = new GenesisAUI();
};

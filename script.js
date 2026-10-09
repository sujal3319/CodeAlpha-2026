const songs = [
    {
        title: "Song One",
        artist: "Artist One",
        src: "assets/music/song1.mp3",
        cover: "assets/images/song1.jpg"
    },

    {
        title: "Song Two",
        artist: "Artist Two",
        src: "assets/music/song2.mp3",
        cover: "assets/images/song2.jpg"
    },

    {
        title: "Song Three",
        artist: "Artist Three",
        src: "assets/music/song3.mp3",
        cover: "assets/images/song3.jpg"
    },
    {
        title: "Song Four",
        artist: "Artist Four",
        src: "assets/music/song4.mp3",
        cover: "assets/images/song4.jpg"
    },
    {
        title: "Song Five",
        artist: "Artist Five",
        src: "assets/music/song5.mp3",
        cover: "assets/images/song5.jpg"
    }
];

const audio = document.getElementById("audio");

const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");

const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

const progress = document.getElementById("progress");

const currentTime = document.getElementById("current-time");
const duration = document.getElementById("duration");

const volume = document.getElementById("volume");

const playlist = document.getElementById("playlist");

let currentSongIndex = 0;

function loadSong(index) {

    const song = songs[index];

    title.textContent = song.title;
    artist.textContent = song.artist;

    cover.src = song.cover;

    audio.src = song.src;

    // Force browser to load the new audio
    audio.load();

    // Reset progress
    progress.value = 0;

    currentTime.textContent = "0:00";
    duration.textContent = "0:00";

    // Update active playlist item
    updateActiveSong();

}


// ==========================================
// PLAY SONG
// ==========================================

function playSong() {

    audio.play()
        .then(() => {

            playBtn.textContent = "⏸";

        })
        .catch((error) => {

            console.error(
                "Unable to play audio:",
                error
            );

        });

}


// ==========================================
// PAUSE SONG
// ==========================================

function pauseSong() {

    audio.pause();

    playBtn.textContent = "▶";

}


// ==========================================
// PLAY / PAUSE
// ==========================================

playBtn.addEventListener("click", () => {

    if (audio.paused) {

        playSong();

    } else {

        pauseSong();

    }

});


// ==========================================
// NEXT SONG
// ==========================================

function nextSong() {

    currentSongIndex++;

    if (currentSongIndex >= songs.length) {

        currentSongIndex = 0;

    }

    loadSong(currentSongIndex);

    playSong();

}


// ==========================================
// PREVIOUS SONG
// ==========================================

function previousSong() {

    currentSongIndex--;

    if (currentSongIndex < 0) {

        currentSongIndex = songs.length - 1;

    }

    loadSong(currentSongIndex);

    playSong();

}


// ==========================================
// NEXT / PREVIOUS BUTTONS
// ==========================================

nextBtn.addEventListener(
    "click",
    nextSong
);

prevBtn.addEventListener(
    "click",
    previousSong
);


// ==========================================
// UPDATE PROGRESS BAR
// ==========================================

audio.addEventListener("timeupdate", () => {

    if (
        !isNaN(audio.duration) &&
        audio.duration > 0
    ) {

        const progressPercent =
            (audio.currentTime / audio.duration) * 100;

        progress.value = progressPercent;

        currentTime.textContent =
            formatTime(audio.currentTime);

    }

});


// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(time) {

    if (isNaN(time)) {

        return "0:00";

    }

    const minutes =
        Math.floor(time / 60);

    const seconds =
        Math.floor(time % 60);

    return `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;

}


// ==========================================
// SEEK SONG
// ==========================================

progress.addEventListener(
    "input",
    () => {

        if (
            !isNaN(audio.duration) &&
            audio.duration > 0
        ) {

            audio.currentTime =
                (progress.value / 100) *
                audio.duration;

        }

    }
);


// ==========================================
// SHOW DURATION
// ==========================================

audio.addEventListener(
    "loadedmetadata",
    () => {

        duration.textContent =
            formatTime(audio.duration);

    }
);


// ==========================================
// VOLUME CONTROL
// ==========================================

volume.addEventListener(
    "input",
    () => {

        audio.volume =
            Number(volume.value);

    }
);


// ==========================================
// CREATE PLAYLIST
// ==========================================

function createPlaylist() {

    playlist.innerHTML = "";

    songs.forEach((song, index) => {

        const li =
            document.createElement("li");

        li.textContent =
            `${song.title} - ${song.artist}`;

        li.addEventListener(
            "click",
            () => {

                currentSongIndex = index;

                loadSong(currentSongIndex);

                playSong();

            }
        );

        playlist.appendChild(li);

    });

}


// ==========================================
// UPDATE ACTIVE PLAYLIST SONG
// ==========================================

function updateActiveSong() {

    const playlistItems =
        playlist.querySelectorAll("li");

    playlistItems.forEach(
        (item, index) => {

            if (
                index === currentSongIndex
            ) {

                item.classList.add("active");

            } else {

                item.classList.remove("active");

            }

        }
    );

}


// ==========================================
// AUTOPLAY NEXT SONG
// ==========================================

audio.addEventListener(
    "ended",
    () => {

        nextSong();

    }
);


// ==========================================
// AUDIO ERROR DETECTION
// ==========================================

audio.addEventListener(
    "error",
    () => {

        console.error(
            "❌ Audio could not be loaded."
        );

        console.error(
            "Audio source:",
            audio.src
        );

    }
);


// ==========================================
// IMAGE ERROR DETECTION
// ==========================================

cover.addEventListener(
    "error",
    () => {

        console.error(
            "❌ Cover image could not be loaded."
        );

        console.error(
            "Image source:",
            cover.src
        );

    }
);


// ==========================================
// INITIALIZE PLAYER
// ==========================================

createPlaylist();

loadSong(currentSongIndex);


// ==========================================
// DEFAULT VOLUME
// ==========================================

audio.volume =
    Number(volume.value);
const $ = document.querySelector.bind(document);

const dashboardSongTitle = $(".dashboard .song-title");
const dashboardSongArtist = $(".dashboard .song-artist");
const dashboardImg = $(".dashboard .song-img");
const dashboardAudio = $(".dashboard audio");

const playBtn = $(".btn-toggle-play");
const ctrlBtns = $(".control-btns");
const progressBar = $(".progress");

const nextBtn = $(".fa-step-forward");
const previousBtn = $(".fa-step-backward");
const repeatBtn = $(".fa-redo");
const shuffleBtn = $(".fa-shuffle");

// main
function iosPolyfill(e) {
  var val =
      (e.pageX - progressBar.getBoundingClientRect().left) /
      (progressBar.getBoundingClientRect().right -
        progressBar.getBoundingClientRect().left),
    max = progressBar.getAttribute("max"),
    segment = 1 / (max - 1),
    segmentArr = [];

  max++;

  for (var i = 0; i < max; i++) {
    segmentArr.push(segment * i);
  }

  var segCopy = segmentArr.slice(),
    ind = segmentArr.sort((a, b) => Math.abs(val - a) - Math.abs(val - b))[0];

  progressBar.value = segCopy.indexOf(ind) + 1;

  dashboardAudio.currentTime =
    (progressBar.value / 100) * dashboardAudio.duration;
}

if (!!navigator.platform.match(/iPhone|iPod|iPad/)) {
  progressBar.addEventListener("touchend", iosPolyfill, { passive: true });
}

const app = {
  songs: [
    {
      title: "Digital love",
      artist: "Daft Punk",
      path: "./assets/songs/song0.mp3",
      img: "./assets/imgs/song0.jfif"
    },
    {
      title: "Something about us",
      artist: "Daft Punk",
      path: "./assets/songs/song1.mp3",
      img: "./assets/imgs/song1.jpg"
    },
    {
      title: "Thức giấc",
      artist: "Da Lab",
      path: "./assets/songs/song2.mp3",
      img: "./assets/imgs/song2.jfif"
    },
    {
      title: "Daddy",
      artist: "Coldplay",
      path: "./assets/songs/song3.mp3",
      img: "./assets/imgs/song3.jfif"
    },
    {
      title: "Higher power",
      artist: "Coldplay",
      path: "./assets/songs/song4.mp3",
      img: "./assets/imgs/song4.jpg"
    },
    {
      title: "Bao nhiêu",
      artist: "Chillies",
      path: "./assets/songs/song5.mp3",
      img: "./assets/imgs/song5.jpg"
    },
    {
      title: "Save your tears",
      artist: "The Weeknd",
      path: "./assets/songs/song6.mp3",
      img: "./assets/imgs/song6.jfif"
    },
    {
      title: "Cứ chill thôi",
      artist: "Chillies",
      path: "./assets/songs/song7.mp3",
      img: "./assets/imgs/song7.jfif"
    },
    {
      title: "Dù cho mai về sau (Lofi ver.)",
      artist: "buitruonglinh x Freak D",
      path: "./assets/songs/song8.mp3",
      img: "./assets/imgs/song8.jfif"
    },
    {
      title: "Starry starry night (Loving Vincent OST)",
      artist: "Lianne La Havas",
      path: "./assets/songs/song9.mp3",
      img: "./assets/imgs/song9.jpg"
    }
  ],

  manualDefineProps: function () {
    Object.defineProperty(this, "currentIndex", {
      writable: true,
      value: Math.floor(Math.random() * app.songs.length)
    });

    Object.defineProperty(this, "isShuffled", {
      writable: true,
      value: false
    });

    Object.defineProperty(this, "isRepeated", {
      writable: true,
      value: false
    });

    Object.defineProperty(this, "getCurrentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      }
    });
  },

  loadCurrentSong: function () {
    dashboardSongTitle.innerText = this.getCurrentSong.title;
    dashboardSongArtist.innerText = this.getCurrentSong.artist;
    dashboardImg.style.backgroundImage = `url(${this.getCurrentSong.img})`;
    dashboardAudio.src = this.getCurrentSong.path;
    document.querySelector(
      "title"
    ).innerText = `${this.getCurrentSong.title} - ${this.getCurrentSong.artist}`;
  },

  scollSrceenEvent: function (oldWidth) {
    const scrollOrdinate = document.documentElement.scrollTop || window.scrollY;
    const newWidth =
      oldWidth - scrollOrdinate > 10 ? oldWidth - scrollOrdinate : 0;
    $(".cd").style.width = newWidth + "px";
    $(".cd").style.opacity = newWidth / oldWidth;
  },

  playBtnClicked: function () {
    ctrlBtns.classList.toggle("playing");
  
    if (!ctrlBtns.classList.contains("playing")) { 
      dashboardAudio.pause();
    } else {    
      dashboardAudio.play();
    
    }
  },

  audioTimeUpdate: function () {
    if (dashboardAudio.duration) {
      const progressPercent =
        (dashboardAudio.currentTime / dashboardAudio.duration) * 100;
      progressBar.value = progressPercent;
      progressBar.style.background =
        "linear-gradient(to right, #44bec7 0%, #44bec7 " +
        progressBar.value +
        "%, #d3d3d3 " +
        progressBar.value +
        "%, #d3d3d3 100%)";
    }
  },

  progressChange: function () {
    dashboardAudio.currentTime =
      (progressBar.value / 100) * dashboardAudio.duration;
  },

  nextBtnClicked: function () {
    if (app.isShuffled) {
      do {
        var newIndex = Math.floor(Math.random() * app.songs.length);
      
      } while (
        newIndex === app.currentIndex + 1 ||
        newIndex === app.currentIndex
      );
      app.currentIndex = newIndex;
    }
  
    else ++app.currentIndex;
    if (app.currentIndex === app.songs.length) app.currentIndex = 0;
  
    app.loadCurrentSong();
    app.onChangeSong();
  
  
    app.renderPlaylist();
    app.playingSongInCenter();
  },

  previousBtnClicked: function () {
    if (app.isShuffled) {
      do {
        var newIndex = Math.floor(Math.random() * app.songs.length);
      
      } while (
        newIndex === app.currentIndex - 1 ||
        newIndex === app.currentIndex
      );
      app.currentIndex = newIndex;
    }  
    else --app.currentIndex;

    if (app.currentIndex === -1) app.currentIndex = app.songs.length - 1;
    app.loadCurrentSong();
    app.onChangeSong();
    app.renderPlaylist();
    app.playingSongInCenter();
  },

  onChangeSong: function () {
    ctrlBtns.classList.add("playing");
    dashboardAudio.play();
    dashboardAudio.currentTime = 0;
  },


  play: function () {
    dashboardAudio.play();
  },

  handleSongEnd: function () {
    if (app.isRepeated) {
    
      dashboardAudio.play();
    }
    else {
      app.nextBtnClicked();
    }
  },

  handleShuffleClicked: function () {
    app.isShuffled = !app.isShuffled;
    this.classList.toggle("btn-active");
  },

  handleRepeatClicked: function () {
    app.isRepeated = !app.isRepeated;
  
    this.classList.toggle("btn-active");
  },

  playingSongInCenter: function () {
    setTimeout(() => {
      $(".song-playing").scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 300);
  },

  handleEvents: function () {  
    const oldWidth = $(".cd").offsetWidth;
    document.onscroll = function () {
    
      app.scollSrceenEvent(oldWidth);
    };
  
    playBtn.onclick = this.playBtnClicked;
    dashboardAudio.ontimeupdate = this.audioTimeUpdate;
    dashboardAudio.onended = this.handleSongEnd;
    progressBar.onchange = this.progressChange;
    progressBar.oninput = this.progressChange;
    nextBtn.onclick = this.nextBtnClicked;
    previousBtn.onclick = this.previousBtnClicked;
    repeatBtn.onclick = this.handleRepeatClicked;
    shuffleBtn.onclick = this.handleShuffleClicked;
  },


  renderPlaylist: function () {  
    let playList = $(".play-list");
    playList.innerHTML = "";
  
    this.songs.forEach((song, index) => {
      const songCard = document.createElement("div");
      songCard.classList.add("song-card");
      if (index === app.currentIndex) songCard.classList.add("song-playing");

      songCard.innerHTML = `
        <img
          src=${song.img}
          class="next-song-img"
        />
        <div class="song-body">
          <h3 class="song-title">${song.title}</h3>
          <p class="song-artist">${song.artist}</p>
        </div>
        <i class="song-options fas fa-ellipsis-h"></i>
      `;
      songCard.onclick = function () {
      
        app.currentIndex = index;
        app.loadCurrentSong();
        app.onChangeSong();
        app.renderPlaylist();
      };
      playList.appendChild(songCard);
    });
  },

  start: function () {  
    this.manualDefineProps();
  
    this.loadCurrentSong();  

    this.renderPlaylist();
    this.playingSongInCenter();

    this.handleEvents();  
  }
};

app.start();


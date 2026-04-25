"use strict";

var Music = (function () {
  var audio = null;
  var playing = false;
  var currentEl = null;
  var durationEl = null;
  var fillEl = null;
  var timer = null;

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    var whole = Math.floor(seconds);
    var minutes = Math.floor(whole / 60);
    var rest = String(whole % 60).padStart(2, "0");
    return minutes + ":" + rest;
  }

  function init(songName, basePath, songTitle) {
    audio = document.getElementById("audio");
    currentEl = document.getElementById("song-current");
    durationEl = document.getElementById("song-duration");
    fillEl = document.getElementById("song-fill");

    var titleEl = document.querySelector("#song-pill .song-title");
    if (titleEl && songTitle) titleEl.textContent = songTitle;

    if (!songName) return;
    var src = document.createElement("source");
    src.src = (basePath || "assets/music/") + songName + ".mp3";
    src.type = "audio/mpeg";
    audio.innerHTML = "";
    audio.appendChild(src);
    audio.volume = 0.02;
    audio.loop = true;
    audio.preload = "auto";
    audio.addEventListener("loadedmetadata", function () {
      if (durationEl) durationEl.textContent = formatTime(audio.duration);
    });
    audio.addEventListener("timeupdate", function () {
      if (currentEl) currentEl.textContent = formatTime(audio.currentTime);
      if (fillEl && isFinite(audio.duration) && audio.duration > 0) {
        fillEl.style.width = Math.max(0, Math.min(100, (audio.currentTime / audio.duration) * 100)) + "%";
      }
    });
    audio.addEventListener("play", function () {
      playing = true;
      if (timer) clearInterval(timer);
      timer = setInterval(function () {
        if (currentEl) currentEl.textContent = formatTime(audio.currentTime);
      }, 1000);
    });
    audio.addEventListener("pause", function () {
      playing = false;
      if (timer) clearInterval(timer);
      timer = null;
    });
  }

  function play() {
    if (audio) audio.play().catch(function () {});
  }

  return { init: init, play: play };
})();

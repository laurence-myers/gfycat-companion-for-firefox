// fixme: namespace

function onPlayPauseClick() {
  var playPauseButton = getPlayPauseButtonEl();
  var videoEl = getVideoEl();
  if (videoEl.paused) {
    videoEl.play();
  } else {
    videoEl.pause();
  }
}

function onPlay() {
  var playPauseButton = getPlayPauseButtonEl();
  playPauseButton.classList.add("fa-pause");
  playPauseButton.classList.remove("fa-play");
}

function onPause() {
  var playPauseButton = getPlayPauseButtonEl();
  playPauseButton.classList.add("fa-play");
  playPauseButton.classList.remove("fa-pause");
}

function onFullScreenClick() {
  var videoEl = getVideoEl();
  Helper.requestFullscreen(videoEl);
}

function onDecreaseSpeedClick() {
  var videoEl = getVideoEl();
  videoEl.play();
  if (videoEl.playbackRate > 0.1) {
    videoEl.playbackRate -= 0.1;
    updateCurrentSpeedDisplay();
  }
}

function onIncreaseSpeedClick() {
  var videoEl = getVideoEl();
  videoEl.play();
  if (videoEl.playbackRate < 5) {
    videoEl.playbackRate += 0.1;
    updateCurrentSpeedDisplay();
  }
}

function onTimeUpdate(json) {
  var videoEl = getVideoEl();
  var currentTime = videoEl.currentTime;
  var currentTimeElem = getCurrentTimeEl();
  var currentFrameElem = getCurrentFrameEl();

  currentTimeElem.textContent = currentTime.toFixed(2) + " / " + videoEl.duration.toFixed(2);
  currentFrameElem.textContent = Math.round((currentTime * json.frameRate).toPrecision(6));
  updateCurrentSpeedDisplay();
}

function navigateToFrame(direction, json) {
  var videoEl = getVideoEl();
  if (!videoEl.paused) {
    videoEl.pause();
  }
  var time;
  if (direction == "next") {
    time = videoEl.currentTime + (json.frameRate / 1000);
  } else if (direction == "previous") {
    time = videoEl.currentTime - (json.frameRate / 1000);
  }
  videoEl.currentTime = time;
}

function toggleResizePanel(event) {
  var resizeButton = event.target;
  var panel = getResizePanelEl();
  var style = panel.style;
  if (style.display == "block") {
    panel.style.display = "none";
  } else {
    panel.style.display = "block";
  }

  style.top = (resizeButton.offsetTop + resizeButton.offsetHeight) + "px";
  style.left = resizeButton.offsetLeft + "px";
}

function initResizer(json) {
  var resizerEl = getResizerEl();
  var videoEl = getVideoEl();

  resizerEl.removeAttribute("disabled");
  resizerEl.setAttribute("min", json.gifWidth / 2);
  resizerEl.setAttribute("max", json.gifWidth * 2);
  resizerEl.setAttribute("step", "1");
  resizerEl.setAttribute("value", json.gifWidth);
  resizerEl.addEventListener("input", function() {
    videoEl.setAttribute("width", resizerEl.value);
  });

  function triggerInputEvent() {
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("input", false, true);
    resizerEl.dispatchEvent(evt);
  }

  document.addEventListener("click", function(event) {
    if (!DomHelper.findParentBySelector(event.target, "#controls")) {
      getResizePanelEl().style.display = "none";
    }
  });

  document.addEventListener("DOMMouseScroll", function(event) {
    var target = event.target;
    if (DomHelper.findParentBySelector(target, "#screenshots-bar")) {
      return;
    }

    var up = event.detail < 0;
    var currentValue = parseInt(resizerEl.value, 10);
    var step = 25;
    resizerEl.value = (up ? currentValue + step : currentValue - step);

    triggerInputEvent();
  });

  getResetResizeButtonEl().addEventListener("click", function() {
    resizerEl.value = json.gifWidth;
    triggerInputEvent();
  });
}

function updateCurrentSpeedDisplay() {
  var videoEl = getVideoEl();
  getCurrentSpeedEl().textContent = videoEl.playbackRate.toFixed(1);
}

function initVideoControls(json) {
  var controlsEl = getControlsEl();
  var videoEl = getVideoEl();
  var playPauseButton = getPlayPauseButtonEl();
  var fullscreenButton = getFullscreenButtonEl();
  var increaseSpeedButton = getIncreaseSpeedButtonEl();
  var decreaseSpeedButton = getDecreaseSpeedButtonEl();
  var nextFrameButton = getNextFrameButtonEl();
  var previousFrameButton = getPreviousFrameButtonEl();
  var screenshotButton = getScreenshotButtonEl();
  var resizeButton = getResizeButtonEl();

  initResizer(json);

  videoEl.addEventListener("play", onPlay);
  videoEl.addEventListener("pause", onPause);
  videoEl.addEventListener("timeupdate", onTimeUpdate.bind(this, json));

  playPauseButton.addEventListener("click", onPlayPauseClick);
  fullscreenButton.addEventListener("click", onFullScreenClick);
  decreaseSpeedButton.addEventListener("click", onDecreaseSpeedClick);
  increaseSpeedButton.addEventListener("click", onIncreaseSpeedClick);
  previousFrameButton.addEventListener("click", navigateToFrame.bind(this, "previous", json));
  nextFrameButton.addEventListener("click", navigateToFrame.bind(this, "next", json));
  screenshotButton.addEventListener("click", Screenshot.create);
  resizeButton.addEventListener("click", toggleResizePanel);

  controlsEl.style.display = "block";
}
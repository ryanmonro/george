var george = new Tone.Players().toMaster();
var audioNow;
var toneLoop;
var noAudio = true;
var toneOffset = 0;
var soundNames = ['thirdstroke', 'seconds', 'precisely', 'and', 'oclock', 'stroke', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 30, 40, 50];

function visualLoop(){
  setInterval(function(){
    var now = new Date();
    displayTime(now);
  }, 1000);
}

function audioLoop(time){
    audioNow.setSeconds(audioNow.getSeconds() + 1);
    if (george.loaded && (audioNow.getSeconds() % 10 == 0 || noAudio == true)) {
      scheduleSounds(time);
    }
  }

function start(){
  loadAudio();
  document.getElementById('start').textContent = "Loading...";
  document.getElementById('start').disabled = "true";
  setTimeout(visualLoop, offsetMillis());
  audioNow = new Date();
  toneOffset = offsetMillis() / 1000;
  toneLoop = new Tone.Loop(audioLoop, 1);
  toneLoop.start(0);
  Tone.Transport.start();
}

function displayTime(now){
  if (noAudio == false) {
    var timeElement = document.getElementById('time');
    timeElement.textContent = "The time is " + pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
  }
}

function scheduleSounds(time){
  var backtrack = audioNow.getSeconds() % 10;
  noAudio = false;
  var nextNow = new Date(audioNow.getTime());
  nextNow.setSeconds(nextNow.getSeconds() + 10 - backtrack);
  scheduleSound('stroke', 10 - backtrack + toneOffset, time);
  scheduleSound('stroke', 9 - backtrack + toneOffset, time);
  scheduleSound('stroke', 8 - backtrack + toneOffset, time);
  var seconds = nextNow.getSeconds();
  var minutes = nextNow.getMinutes();
  var hours = nextNow.getHours();
  var offset = 8 - backtrack + toneOffset;
  if (seconds == 0) {
    offset = scheduleSound('precisely', offset, time);
  } else {
    offset = scheduleSound('seconds', offset, time);
    offset = scheduleSound(seconds, offset, time);
    offset = scheduleSound('and', offset, time);
  }
  // minutes
  if (minutes == 0) {
    offset = scheduleSound('oclock', offset, time);
  }
  if (minutes > 10 && minutes < 20) {
    offset = scheduleSound(minutes, offset, time);
  } else {
    if (minutes % 10 !== 0) {
      offset = scheduleSound(minutes % 10, offset, time);
    }
    if (minutes >= 10) {
      offset = scheduleSound(minutes - (minutes % 10), offset, time);
    }
  }
  // hours
  if (hours == 0) {
    hours = 12;
  }
  if (hours > 12) {
    hours = hours % 12;
  }
  offset = scheduleSound(hours, offset, time);

  offset = scheduleSound('thirdstroke', offset, time);
}

function scheduleSound(index, offset, transportTime){
  var file = george.get(index);
  var newOffset = offset - (file.buffer.duration);
  if(newOffset > 0) {
    file.start(newOffset + transportTime);
  }
  return newOffset;
}

function loadAudio(){
  soundNames.forEach(function(prefix){
    george.add(prefix, 'audio/m4a/' + prefix + '.aif.m4a');
  })
}

function pad(number){
  return ("0" + number.toString()).slice(-2);
}

function offsetMillis(){
  // returns milliseconds until the next whole second is reached
  return (1000 - (new Date()).getMilliseconds());
}
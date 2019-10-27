var george = new Tone.Players().toMaster();
var audioNow;
var noAudio = true;
var toneLoop;

function clockLoop(){
  setInterval(function(){
    var now = new Date();
    console.log("display ms", now.getMilliseconds())
    displayTime(now);
  }, 1000);
}

function start(){
  loadAudio();
  document.getElementById('start').textContent = "Loading...";
  document.getElementById('start').disabled = "true";
  var start = new Date();
  var offset = 1000 - start.getMilliseconds();
  setTimeout(function(){
    clockLoop();
  }, offset);
  audioNow = new Date();
  toneLoop = new Tone.Loop(function(time){
    audioNow.setSeconds(audioNow.getSeconds() + 1);
    if (george.loaded && (audioNow.getSeconds() % 10 == 0 || noAudio == true)) {
      scheduleSounds(time, offset / 1000);
    }
  }, 1);
  toneLoop.start(0);
  Tone.Transport.start();
}

function displayTime(now){
  if (noAudio == false) {
    var timeElement = document.getElementById('time');
    timeElement.textContent = "The time is " + pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
  }
}

function scheduleSounds(time, offset){
  var backtrack = audioNow.getSeconds() % 10;
  noAudio = false;
  time = time - backtrack + offset;
  var nextNow = new Date(audioNow.getTime());
  nextNow.setSeconds(nextNow.getSeconds() + 10 - backtrack);
  scheduleSound('stroke', 10, time);
  scheduleSound('stroke', 9, time);
  scheduleSound('stroke', 8, time);
  var seconds = nextNow.getSeconds();
  var minutes = nextNow.getMinutes();
  var hours = nextNow.getHours();
  var offset = 8;
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

function scheduleSound(index, time, transportTime){
  var file = george.get(index);
  var newTime = time - (file.buffer.duration);
  if(newTime + transportTime > 0) {
    file.start(newTime + transportTime);
  }
  return newTime;
}

function pad(number){
  return ("0" + number.toString()).slice(-2);
}

function loadAudio(){
  ['thirdstroke', 'seconds', 'precisely', 'and', 'oclock', 'stroke', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 30, 40, 50].forEach(function(prefix){
    george.add(prefix, 'audio/m4a/' + prefix + '.aif.m4a');
  })
}
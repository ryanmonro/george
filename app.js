var george = {};

function start(){
  loadAudio();
  document.getElementById('start').disabled = "true";
  var start = new Date();
  setTimeout(loop, 1000 - start.getMilliseconds());
}

function displayTime(now){
  var timeElement = document.getElementById('time');
  timeElement.textContent = "The time is " + pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
}

function loop(){
  setInterval(function(){
    var now = new Date()
    displayTime(now);
    var seconds = now.getSeconds()
    if (seconds % 10 >= 8 || seconds % 10 == 0) {
      george.stroke.play();
    }
    if (seconds % 10 == 0) {
      now.setSeconds(seconds + 10);
      seconds = now.getSeconds();
      var start = 8000;
      var minutes = now.getMinutes();
      var hours = now.getHours();
      if (seconds == 0) {
        start = scheduleBy(george.precisely, start);
      } else {
        start = scheduleBy(george.seconds, start);
        start = scheduleBy(george[seconds], start);
        start = scheduleBy(george.and, start);
      }
      // minutes
      if (minutes == 0) {
        start = scheduleBy(george.oclock, start);
      }
      if (minutes > 10 && minutes < 20) {
        start = scheduleBy(george[minutes], start);
      } else {
        if (minutes % 10 !== 0) {
          start = scheduleBy(george[minutes % 10], start);
        }
        if (minutes >= 10) {
          start = scheduleBy(george[minutes - (minutes % 10)], start);
        }
      }
      // hours
      if (hours == 0) {
        hours = 12;
      }
      if (hours > 12) {
        hours = hours % 12;
      }
      start = scheduleBy(george[hours], start);
      start = scheduleBy(george.thirdstroke, start);

    }
  }, 1000)
}

function schedule(file, time){
  setTimeout(function(){
    file.play();
  }, time);
}

function scheduleBy(file, time){
  var newTime = time - (file.duration * 1000);
  schedule(file, newTime);
  return newTime;
}

function pad(number){
  return ("0" + number.toString()).slice (-2);
}

function loadAudio(){
  ['thirdstroke', 'seconds', 'precisely', 'and', 'oclock', 'stroke', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 30, 40, 50].forEach(function(prefix){
    george[prefix] = new Audio('audio/m4a/' + prefix + '.aif.m4a');
  })
}
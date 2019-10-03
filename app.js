var george = {};
loadAudio();
var start = new Date();
setTimeout(function(){
  setInterval(function(){
    var now = new Date();
    var timeElement = document.getElementById('time');
    var seconds = now.getSeconds()
    time.textContent = now.toString();
    if (seconds % 10 > 7 || seconds % 10 == 0) {
      george.stroke.play();
    }
    if (seconds % 10 == 0) {
      // schedule other audio for the next 10 seconds here
      // schedule(george.thirdstroke, 5000);
      var start = 8000;
      var minutes = now.getMinutes();
      var hours = now.getHours();
      if (seconds == 50) {
        start = scheduleBy(george.precisely, start);
      } else {
        start = scheduleBy(george.seconds, start);
        start = scheduleBy(george[seconds + 10], start);
        start = scheduleBy(george.and, start);
      }
      start = scheduleBy(george[minutes % 10], start);
      start = scheduleBy(george[minutes - (minutes % 10)], start);
      start = scheduleBy(george[hours % 12], start);
      start = scheduleBy(george.thirdstroke, start);

    }
  }, 1000)
}, 1000 - start.getMilliseconds())

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

function loadAudio(){
  ['thirdstroke', 'seconds', 'precisely', 'and', 'oclock', 'stroke', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 30, 40, 50].forEach(function(prefix){
    george[prefix] = new Audio('audio/' + prefix + '.ogg');
  })

}
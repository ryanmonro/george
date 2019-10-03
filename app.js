var stroke = new Audio('audio/stroke.ogg');
var start = new Date();
setTimeout(function(){
  setInterval(function(){
    var now = new Date();
    var timeElement = document.getElementById('time');
    var seconds = now.getSeconds()
    time.textContent = now.toString();
    if (seconds % 10 > 7 || seconds % 10 == 0) {
      stroke.play();
    }
    if (seconds % 10 == 0) {
      // schedule other audio for the next 10 seconds here
      schedule(stroke, 5000);
    }
  }, 1000)
}, 1000 - start.getMilliseconds())

function schedule(file, time){
  setTimeout(function(){
    file.play();
  }, time);
}
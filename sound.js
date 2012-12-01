var onError = function(){
  console.error(arguments);
};

var audioContext;
var WebAudio = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

// Try/Catch incase it doesn't exist (FF/IE)

try {
  audioContext = new WebAudio();
} catch(e) {
  alert('Web Audio API is not supported in this browser');
}

var soundBuffers = {};

var loadSound = function(name, url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  // Web Audio is binary (not text) - we need an arraybuffer
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    if(audioContext){
      audioContext.decodeAudioData(
        request.response, function(buffer){
          soundBuffers[name] = buffer;
        }, onError);
    }
  }
  request.send();
};

var playSound = function(name) {
  if(audioContext){
    // creates a sound source
    var soundSource = audioContext.createBufferSource();
    // tell the source which sound to play
    soundSource.buffer = soundBuffers[name];
    // connect the source to the context's destination
    soundSource.connect(audioContext.destination);
    // play the source now
    soundSource.noteOn(0);
  }
};

window.addEventListener('load', function(e){
  loadSound('yipee', 'sound/yippee.wav');

  document.getElementById('playWee').addEventListener('click', function(e){
    playSound('wee');
  });
  document.getElementById('playYipee').addEventListener('click', function(e){
    playSound('yipee');
  });
  document.getElementById('playYahoo').addEventListener('click', function(e){
    playSound('yahoo');
  });
  document.getElementById('playPop').addEventListener('click', function(e){
    playSound('pop');
  });
  document.getElementById('playAll').addEventListener('click', function(e){
    playSound('yipee');
  });
});

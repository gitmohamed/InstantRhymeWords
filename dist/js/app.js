(function(){
    /*@@@
    @ @ @ Version: 0.0.1
    @@ @@ Author: Mohamed Hassan
    @ @ @ license: MIT
    @@@*/

  // Main client code
  if (!(window.webkitSpeechRecognition) && !(window.speechRecognition)) {
    upgrade();
  } else {
    var speech = new webkitSpeechRecognition() || speechRecognition();

    var transcription = document.getElementById('final_span');
    var interim_span = document.getElementById('interim_span');
    var wordIndex = [];
    var final_transcript;
    var recognizing;
    var spck = document.getElementById('speaking');
    var $rhymes = $('#rhymeCont');
    var search = document.getElementById('search');

    speech.interimResults = true;
    speech.continuous = true;
    speech.lang = 'en-US';

    speech.onstart = function() {
      spck.style.display = 'block';
    }

    speech.onresult = function(event) {
      transcription.innerHTML = '';
      interim_span.innerHTML = '';
      if (typeof(event.results) == 'undefined') {
        speech.onend = null;
        speech.stop();
        upgrade();
        return;
      }
      for (var i = event.resultIndex; i < event.results.length; i++) {
        search.textContent = 'Searching...';
        if (event.results[i].isFinal) {
          var recent = event.results[i][0].transcript;
          transcription.innerHTML += recent + '. ';
          console.log('Confidence: ' + event.results[i][0].confidence);
          getLiveRhymes(recent);
        } else {
          interim_span.innerHTML += event.results[i][0].transcript;
        }
        // final_transcript = capitalize(final_transcript);
        // interim_span.innerHTML = interim_transcript;
        // transcription.innerHTML = final_transcript;
      };
    }

    speech.onend = function() {
      speech.stop();
      search.textContent = '';
      spck.style.display = 'none';
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
        var range = document.createRange();
        range.selectNode(document.getElementById('final_span'));
        window.getSelection().addRange(range);
      }
      reset();
    }

    speech.onerror = function(event) {};

    speech.onnomatch = function(event) {
      alert('No word match!');
    }


    document.body.addEventListener('click', function(){
      toggleSpeech();
    });

    // document.body.addEventListener('keydown', function(e) {
    //   if (e.keyCode == 39) {
    //     transcription.value = '';
    //   } else if (e.keyCode == 32) {
    //     toggleSpeech();
    //   }
    // });

  var rhymes;
  var url;
  var singleWord, i, r, a, rCont = document.getElementById('rhymeCont');
  function getLiveRhymes(words) {
    var individualWords = words.split(' ');
    singleWord = individualWords.pop();
    // console.log(singleWord);

    function hasWhiteSpace(s) {
      return s.indexOf(' ') >= 0;
    }

      for (var i = 0; i < singleWord.length; i++) {
        var lastLetter = singleWord[i].slice(-1);

        if (lastLetter == 'e') {
          url = 'https://api.datamuse.com/words?rel_rhy='+singleWord.toLowerCase();
        } else {
          url = 'https://api.datamuse.com/words?rel_rhy='+singleWord.toLowerCase() + '&sp=*' + lastLetter;
        }

        $.ajax({
          method: 'GET',
          url: url,
          context: document.body
        }).done(function(data) {
          search.textContent = '';
          rhymes = $.map(data, function(value, index) { return [value] });
            for (i = 0, r, a; i < rhymes.length; i++) {
              r = rhymes[i].word;
                if (!hasWhiteSpace(r)) {
                  console.log(r);
                  a = document.createElement('a');
                  a.innerHTML = r;
                  prependChild(rCont, a);
                } else {
                  console.log(r + ' is two words!!');
                }
            }
        });
      };
      // return rhymes;
    }

  function prependChild(parent, newChild) {
    parent.insertBefore(newChild, parent.firstChild);
  }

  function toggleSpeech() {
    if (recognizing) {
      speech.stop();
      reset();
    } else {
      speech.start();
      recognizing = true;
    }
  }

  function reset() {
    recognizing = false;
    $rhymes.html('');
    interim_span.innerHTML = '';
    transcription.innerHTML = '';
  }

  var first_char = /\S/;
  function capitalize(s) {
    return s.replace(first_char, function(m) { return m.toUpperCase(); });
  }

  function upgrade() {
    alert("Please use Google Chrome for the best possible experience.");
  }
}

})();

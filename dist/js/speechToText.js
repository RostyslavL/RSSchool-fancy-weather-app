var speechRecognition = window.webkitSpeechRecognition

var recognition = new speechRecognition()

var textbox = $('#searchBar__text')

var microphoneButton = $('microphone__button')

var content = ''

recognition.continuous = true

// recognition started:

recognition.onstart = function(){
    alert('Voice recognition is On')
}

recognition.onspeechend = function(){
    alert('Voice recognition is On')
}

recognition.onerror = function(){
    alert('Error, try again')
}

recognition.onresult = function(event){
    var current = event.resultIndex

    var transcript = event.results[current][0].transcript

    content += transcript

    textbox.val(content)
    console.log(content)
}

$('#microphone__button').click(function(event){
    if(content.length){
        content += ''
    }
    recognition.start()
})

textbox.on('input', function(){
    content = $(this).val()
})
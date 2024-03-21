import React, { useState } from 'react';

const SpeechToText = () => {
  const [transcription, setTranscription] = useState('');
  
  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition(); // For Chrome
    // const recognition = new window.SpeechRecognition(); // For non-Chrome browsers
    
    recognition.lang = 'en-US'; // Set language
    recognition.interimResults = false; // Get results continuously or only at the end
    
    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript;
      setTranscription(transcript);
    };
    
    recognition.start();
  };

  return (
    <div>
      <button onClick={startListening}>Start Listening</button>
      <p>Transcription: {transcription}</p>
    </div>
  );
};

export default SpeechToText;
import React, { useEffect, useState } from 'react';

const SpeechToText = (props) => {
  
  let recognition = null
  
  const startListening = () => {
    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript;
      props.setTranscription(transcript);
    };
    
    recognition.start();
  };

  useEffect(() => {
    //startListening()
  }, [props.micActive]);

  useEffect(() => {
    recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US'; // Set language
    recognition.interimResults = true; 
    console.log('Recognition:', recognition);
    recognition.onstart = () => {
      console.log('Recognition is ready and listening has started.');
    };
  }, []);

  return (
    <></>
  );
};

export default SpeechToText;

{/*
   <div>
      <button onClick={startListening}>Start Listening</button>
      <p>Transcription: {transcription}</p>
    </div>
*/}
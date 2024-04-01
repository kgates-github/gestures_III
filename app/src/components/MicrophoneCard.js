import React, { useEffect, useState, useContext } from 'react';
//import GestureTarget from './GestureTarget';
import { motion } from "framer-motion"
import { LogContext } from './LogContext';
import MicrophoneIcon from './MicrophoneIcon';

let recognition = new window.webkitSpeechRecognition();
recognition.lang = 'en-US'; // Set language
recognition.interimResults = true; // Get interim results

function MicrophoneCard(props) {
  const log = useContext(LogContext);
  const [micActive, setMicActive] = useState(false);
  const [alignLeft, setAlignLeft] = useState(false);
  const [micAnimation, setMicAnimation] = useState('active');
  const [animationCardMain, setAnimationCardMain] = useState('inactive');
  
  const variantsCardMain = {
    active:    { 
      y: 0, 
      translateX: 0,
      scale: 1,
      opacity: 1, 
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    inactive: { 
      y: 0,
      translateX: 0,
      scale: 0.9,
      opacity: 0,
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    reset: { 
      y: 0,
      translateX: 0,  
      opacity: 0,
    },
    left: { 
      y: 0,
      translateX: -450,
      scale: 1,
      opacity: 1, 
      transition: { duration: 0.6, ease: 'anticipate' }
    },
    leftInactive: { 
      y: 0,
      translateX: -450,
      scale: 0.9,
      opacity: 0,
      transition: { duration: 0.2, ease: 'easeOut' }
    },
  }

  const answerVariants = {
    active: { color: "#ff0000", transition: { duration: 0.3, ease: 'easeOut' } }, 
    inactive: { color: "#ffcc00" },
  }

  const getAnimation = () => {
    if (props.isExiting && props.isSelected && props.isActive) { 
      return "exitSlow"
    } 
    if (props.isExiting && !props.isSelected && !props.isActive) { 
      return "exitFast"
    }
    return props.isActive ? "active" : "inactive"
  }

  const formatTranscription = (transcription) => {
    const words = transcription.split(' ');
    
    return words.map((word, index) => {
      return (
        <span 
          className='word'
          style={{color:"#999"}} 
          key={index}>{word} </span>
      );
    });
  }

  const queryLLM = () => {
    const spans = document.getElementById('transcription').querySelectorAll('.word');
   
    setMicActive(false);
    spans.forEach((span, index) => {
      setTimeout(() => {
        span.style.color = "#333";
      }, index * 120);
    });
  
    setTimeout(() => {
      setAlignLeft(true);
    }, (spans.length + 3) * 120);
  }

  recognition.onstart = () => {
    console.log('Recognition is ready and listening has started.');
  };

  recognition.onend = () => {
    recognition.stop();
    if (props.transcription.length < 1) {
      props.setIsActive(false);
      setMicActive(false);
    } else {
      props.setTranscription(props.transcription);
      setMicActive(false);
      queryLLM();
    }
  };
  
  recognition.onresult = event => {
    const transcript = event.results[0][0].transcript;
    props.setTranscription(transcript.charAt(0).toUpperCase() + transcript.slice(1));
  };
  
  useEffect(() => {
    setAlignLeft(false);
    props.setShowCoachTip(null);
    if (props.transcription.length < 1) {
      if (alignLeft) {
        setAnimationCardMain(props.showCard ? "active" : "leftInactive");
      } else {
        setAnimationCardMain(props.showCard ? "active" : "inactive");
      }
    }
  }, [props.showCard]);

  useEffect(() => {
    recognition.stop();

    if (props.isActive) {
      recognition.start();
      setMicActive(true);
      setAlignLeft(false);
      
    } else {
      recognition.stop();
    }
  }, [props.isActive]);

  useEffect(() => {
    if (alignLeft) {
      setAnimationCardMain("left");
    } 
  }, [alignLeft]);
  
  return (
    <>
    <motion.div 
      animate={animationCardMain}
      variants={variantsCardMain}
      onAnimationComplete={() => {
        console.log("**************");
        console.log("animationCardMain ", animationCardMain);
        console.log("props.showCard ", props.showCard);
        console.log("props.isActive ", props.isActive);
        console.log("micActive ", micActive);

        if (animationCardMain == "leftInactive" && !props.showCard && !props.isActive && !micActive) {
          console.log("!!resetting animationCardMain");
          setAnimationCardMain("reset");
        } else if (animationCardMain == "left" && props.showCard && props.isActive) {
          props.setShowResponseCards(true);
          props.setIsInSelectionMode(true);
        }
      }}
      initial="inactive"
      className="menu-card-outer"
      style={{display:"flex", flexDirection: "column", alignItems:"center", background:"none"}}
    >
      <motion.div className="menu-card" >
        <div
          id='transcription'
          style={{
            fontSize:"20px", 
            fontWeight:"300", textAlign: "left", 
            color: "#999",
            paddingLeft:"10px", paddingRight:"10px", lineHeight:"1.1em",
          }}
        >
          { (props.transcription.length > 0) ? 
            formatTranscription(props.transcription) 
            : 
            "What do you want to cook?" }<span className="material-icons" 
            style={{ 
              fontSize: "20px",
              fontWeight: "700", 
              color: "#009944", 
              position: 'relative',
              top: '3px',
              opacity: !micActive && props.transcription.length ? 1 : 0,
            }}>
            check
          </span>
        </div>
        <div style={{
          flex:1, display:"flex", justifyContent: "center", 
          background:"none", 
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center"
        }}>
           
        </div>
        <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
          <MicrophoneIcon micActive={micActive} />
        </div>
      </motion.div>
      
      {/*
        <GestureTarget 
          isActive={props.isActive} 
          isSelected={props.isSelected} 
          setIsExiting={props.setIsExiting}
        />
      */}
    </motion.div>
    </>
  );
}

export default MicrophoneCard;
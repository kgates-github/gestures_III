import React, { useEffect, useState, useContext, useRef } from 'react';
import { LogContext } from './LogContext';
import MicrophoneCard from './MicrophoneCard';
import CoachTip from './CoachTip';
import { motion, useMotionValue } from "framer-motion"
import LLMHandler from './LLMHandler';


function Assistant(props) {
  const log = useContext(LogContext);
  const [transcription, setTranscription] = useState(""); // "I want to make veggie burgers"
  const [isActive, setIsActive] = useState(false);
  const [showCoachTip, setShowCoachTip] = useState(null); // Whether to show coach tip
  const [userInput, setUserInput] = useState('');
  const [LLMIsLoaded, setLLMIsLoaded] = useState(false);

  const transcriptionRef = useRef(transcription);
  
  const handleOpenPalm = (e) => {
    log('handleOpenPalm ' + isActive + " " + e.detail.handedness);
    props.subscribe("No_Gesture", handleNoGesture);
    console.log('transcription: ' + transcription)
    setIsActive(true);
  }

  const handleNoGesture = (e) => {
    log('handleNoGesture');
    if (transcriptionRef.current.length < 1) {
      setIsActive(false);
    } else {
      setIsActive(false);
      setTimeout(() => {
        setTranscription('');
      }, 300);
    }
  }

  useEffect(() => {
    // Open coach tip
    setShowCoachTip("intro");
    setIsActive(false);
    
    // Open_Palm opens dialog, no gesture closes dialog 
    props.subscribe("Open_Palm", handleOpenPalm);
   
    return () => {
      props.unsubscribe("Open_Palm", handleOpenPalm);
      props.unsubscribe("No_Gesture", handleNoGesture);
    }
  }, []);

  useEffect(() => {
    if (!isActive) {
      setShowCoachTip("intro");
    }
  }, [isActive]);

  useEffect(() => {
    transcriptionRef.current = transcription;
  }, [transcription]);

  
  return (
    <>
      {/*<LLMHandler setLLMIsLoaded={setLLMIsLoaded} LLMIsLoaded={LLMIsLoaded} userInput={userInput} />*/}

      {/*<GestureShadowDot x={x} y={y} isInSelectionMode={isInSelectionMode && !selectionMade}/>*/}
      <CoachTip 
        image={"icon_palm_open"} 
        text1={'This app helps you find recipes.'}
        text2={'Raise your right hand and just say what you are cooking (e.g., "veggie burgers")'}
        showCoachTip={showCoachTip == "intro"}
      />
      <div className="outerContainer" style={{ 
        position: "fixed", 
        zIndex:10,
      }}>
        {/*
        <NotificationWindow 
          showNotification={showNotification} 
          setShowNotification={setShowNotification} 
          setShowCoachTip={setShowCoachTip}
          animal={animal} 
        />
        */}
        <div id="innerContainer">
          {/*<CoachTip 
            image={"icon_palm_open"} 
            text={"Raise your right hand..."}
            showCoachTip={showCoachTip == "intro"}
          />*/}
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop:"140px"}}>
            <motion.div
              className="dialog"
              style={{display: 'flex', flexDirection: 'row', alignItems: 'center', zIndex: 90}}
            >
              <MicrophoneCard 
                showCard={isActive}
                isActive={isActive}
                setIsActive={setIsActive}
                subscribe={props.subscribe} 
                unsubscribe={props.unsubscribe}
                transcription={transcription} 
                setTranscription={setTranscription}
                setShowCoachTip={setShowCoachTip}
              />
            </motion.div>
          </div>
          
        </div>
      </div>
    </>
  );
}

export default Assistant;

            
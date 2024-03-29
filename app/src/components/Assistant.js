import React, { useEffect, useState, useContext, useRef } from 'react';
import { LogContext } from './LogContext';
import MicrophoneCard from './MicrophoneCard';
import ResponseCard from './ResponseCard';
import CoachTip from './CoachTip';
import { motion, useMotionValue } from "framer-motion"
import LLMHandler from './LLMHandler';


function Assistant(props) {
  const log = useContext(LogContext);
  const [transcription, setTranscription] = useState(""); // "I want to make veggie burgers"
  const [isActive, setIsActive] = useState(false);
  const [showCoachTip, setShowCoachTip] = useState(null); // Whether to show coach tip
  const [showResponseCards, setShowResponseCards] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [LLMIsLoaded, setLLMIsLoaded] = useState(false);

  const transcriptionRef = useRef(transcription);

  const fakeResponseData = [
    {
      name: "Veggie Burgers", 
      description:"These responses are generic because the LLM model I tried to use said strange things.", 
      type: "Main Course", 
      time: "30 min", 
      difficulty: "Easy", 
    },
    {
      name: "Sweet Potato Fries", 
      description: "Easy and delicious sweet potato fries with fresh herbs and spices.",
      type: "Side Dish", 
      time: "40 min", 
      difficulty: "Easy", 
    },
    {
      name: "Tiramisu", 
      description: "A classic Italian dessert made with coffee-soaked ladyfingers and mascarpone cream.",
      type: "Dessert", 
      time: "40 min", 
      difficulty: "Medium", 
    }
  ]

  const reset = () => {
    setTranscription('');
    setIsActive(false);
    setShowCoachTip("intro");
    setShowResponseCards(false);
  }

  /****************************************
    Gesture Handlers
  *****************************************/

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
    } else if (transcriptionRef.current.length > 0) {
      props.unsubscribe("No_Gesture", handleNoGesture);
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
    if (!isActive && transcription.length < 1) {
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
        text1={'This prototype can find recipes and complimantary dishes for you.'}
        text2={'Raise your hand and tell it what you want to cook...'}
        showCoachTip={showCoachTip == "intro"}
      />
      <CoachTip 
        image={"icon_point_up"} 
        text1={''}
        text2={'Point your index finger up'}
        showCoachTip={showCoachTip == "point"}
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
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop:"40px"}}>
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
            handleNoGesture={handleNoGesture}
            setShowResponseCards={setShowResponseCards}
            />
          </motion.div>
          <div style={{
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            position: 'absolute', 
            zIndex: 80,
          }}>
            {
              fakeResponseData.map((item, index) => (
                <ResponseCard 
                  key={index}
                  data={item}
                  translateX={-210 + index * -350}
                  isActive={showResponseCards}
                />
              ))
            }
          </div>
        </div>
          
        </div>
      </div>
      <button onClick={() => reset()} style={{position: "fixed", right:"0px", zIndex:20002}}>Reset</button>
    </>
  );
}

export default Assistant;


import React, { useEffect, useState, useContext, useRef } from 'react';
import { LogContext } from './LogContext';
import MicrophoneCard from './MicrophoneCard';
import ResponseCard from './ResponseCard';
import CoachTip from './CoachTip';
import GestureShadowDot from './GestureShadowDot';
import CheckConfirm from './CheckConfirm';
import { motion, useMotionValue } from "framer-motion"

const initialFakeResponseData = [
  {
    id: "card_0",
    name: "Krabby Patty",
    description:"Krabby Patties are the best-known food at the Krusty Krab, and the most famous burger in Bikini Bottom.",
    type: "Main Course",
    time: "30 min",
    difficulty: "Easy",
    isSelected: false,
  },
  {
    id: "card_1",
    name: "White Russian",
    description: "Kahlua, vodka, and cream served over ice. It's the perfect drink for unwinding after league play.",
    type: "Cocktail",
    time: "10 min",
    difficulty: "Easy",
    isSelected: false,
  },
  {
    id: "card_2",
    name: "Toaster Strudel",
    description: "Toaster Strudel is a delicious, versitile pastry that is quick and easy to make. Dip slices in a white Russian for a decadent treat.",
    type: "Dessert",
    time: "3 min",
    difficulty: "Easy",
    isSelected: false,
  }
]

function Assistant(props) {
  // Context
  const log = useContext(LogContext);

  // States
  const [fakeResponseData, setFakeResponseData] = useState(initialFakeResponseData);
  const [transcription, setTranscription] = useState(""); // "I want to make veggie burgers"
  const [isActive, setIsActive] = useState(false);
  const [showCoachTip, setShowCoachTip] = useState(null); // Whether to show coach tip
  const [showResponseCards, setShowResponseCards] = useState(false);
  const [isInSelectionMode, setIsInSelectionMode] = useState(false);
  const [inHoverStateCard, setInHoverStateCard] = useState(null);
  const [inGripStateCard, setInGripStateCard] = useState(null);
  const [grabCardShown,   setGrabCardShown] = useState(false);
  const [showShadowDot, setShowShadowDot] = useState(false);
  const [showCheckConfirm, setShowCheckConfirm] = useState(false);

  // Refs
  const transcriptionRef = useRef(transcription);
  const xCoords = useRef({});
  const cardBounds = useRef({x0: 0, x1: 0});

  const reset = () => {
    setTranscription('');
    setFakeResponseData(initialFakeResponseData);
    setShowShadowDot(false);
    setIsActive(false);
    setShowCoachTip("intro");
    setShowResponseCards(false);
    setIsInSelectionMode(false);
    setInHoverStateCard(null);
    setInGripStateCard(null);
  }

  /****************************************
    Set Selected Card
  *****************************************/

  const setSelectedCard = (id) => {
    //console.log('setSelectedCard')
    const newFakeResponseData = fakeResponseData.map((item) => {   
      if (item.id == id) {  
        item.isSelected = true;
      }
      return item;
    });
    setFakeResponseData(newFakeResponseData);
    setShowCoachTip(null)
  }  
  
  const unsetSelectedCard = (id) => {
    //console.log('unsetSelectedCard')
    const newFakeResponseData = fakeResponseData.map((item) => {   
      if (item.id == id) {  
        item.isSelected = false;
      }
      return item;
    });
    //setFakeResponseData(newFakeResponseData);
  }  

  /****************************************
    GestureShadowDot
  *****************************************/

  const x = useMotionValue(-100);
  const y = useMotionValue(0);
  const anchor_x = useRef(-1000);
  const anchor_y = useRef(0);
  let new_x = 0;

  const registerCardXCoords = (id, x, width) => {   
    xCoords.current[id] = { x0: x, x1: (x + width) }
    const minX0 = Math.min(...Object.entries(xCoords.current).map(([id, coords]) => coords.x0));
    const maxX1 = Math.max(...Object.entries(xCoords.current).map(([id, coords]) => coords.x1));
    cardBounds.current = { x0: minX0, x1: maxX1 }
  }

  /****************************************
    Gesture Handlers
  *****************************************/

  const handleOpenPalm = (e) => {
    //console.log('handleOpenPalm ' + isActive + " " + e.detail.handedness);
    props.subscribe("No_Gesture", handleNoGesture);

    // Reset grip state
    setInGripStateCard(null);
    setShowShadowDot(true);
    y.set(window.innerHeight / 2 - 80); // Reset y when engaging cards

    if (isInSelectionMode) { 
      props.subscribe("Hand_Coords",  (e) => handleGestureXY(e, inGripStateCard));
    }
    
    // Anchor the x position for x calculations if not already set
    if (anchor_x.current < -100) anchor_x.current = e.detail.x;
    setIsActive(true);
  }

  const handleNoGesture = (e) => {
    setShowShadowDot(false);
    setInHoverStateCard(null);

    anchor_x.current = -1000;
    props.unsubscribe("Hand_Coords", handleGestureXY);
    props.unsubscribe("Closed_Fist", (e) => handleClosedFist(e, inHoverStateCard));

    if (transcriptionRef.current.length < 1) {
      setIsActive(false);
    } else if (transcriptionRef.current.length > 0) {
      //props.unsubscribe("No_Gesture", handleNoGesture);
    } else {
      setIsActive(false);
      setTimeout(() => {
        setTranscription('');
      }, 300);
    }
  }

  const handleClosedFist = (e, inHoverStateCard) => {
    //console.log('handleClosedFist');

    anchor_y.current = e.detail.y;
    if (inHoverStateCard != null) {
      setInGripStateCard(inHoverStateCard);
    }
  }

  const handleGestureXY = (e, inGripStateCard) => {
    // Handle x movement
    new_x = window.innerWidth / 2 - (window.innerWidth * (e.detail.x - anchor_x.current)) * 3;
    x.set(new_x);

    // Detect if new_x is not over a card
    if (new_x < cardBounds.current.x0 || new_x > cardBounds.current.x1) {
      setInHoverStateCard(null);
      //console.log('handleGestureXY no card hit');
    } else {
      // Detect card hit
      Object.entries(xCoords.current).forEach(([id, item]) => {
        if (new_x > item.x0 && new_x < item.x1) {
          if (inHoverStateCard != id) setInHoverStateCard(id);
          //log('handleGestureXY card hit');
        }
      });
    }
  }

  /****************************************
    useEffects
  *****************************************/
    
  useEffect(() => {
    if (isInSelectionMode) {
      x.set(-100); // Efftectively hide the shadow dot
      props.subscribe("Hand_Coords", (e) => handleGestureXY(e, inGripStateCard)); 
      props.subscribe("Closed_Fist", (e) => handleClosedFist(e, inHoverStateCard));
    }
  }, [isInSelectionMode, inHoverStateCard, inGripStateCard]);

  useEffect(() => {
    const newXCoords = {};
    initialFakeResponseData.forEach((item, index) => {
      newXCoords[item.id] = { x0: 0, x1: 0 }
    });

    xCoords.current = newXCoords; 

    // Open coach tip
    setShowCoachTip("intro");
    setIsActive(false);
    
    // Open_Palm opens dialog, no gesture closes dialog 
    props.subscribe("Open_Palm", handleOpenPalm);
    
    return () => {
      //props.unsubscribe("Open_Palm", handleOpenPalm);
      //props.unsubscribe("No_Gesture", handleNoGesture);
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

  useEffect(() => {
    //console.log('useEffect inGripStateCard', inGripStateCard)
  }, [inGripStateCard]);

  useEffect(() => {
    if (inHoverStateCard != null && !grabCardShown) {
      setGrabCardShown(true);
      setShowCoachTip("grab_card");
    } 
  }, [inHoverStateCard]);


  return (
    <>
      <GestureShadowDot x={x} y={y} showShadowDot={showShadowDot} />
      
      <CoachTip 
        image={"icon_palm_open"} 
        text1={''}
        text2={'This prototype can help you find recipes. Raise your hand to start...'}
        showCoachTip={showCoachTip == "intro"}
      />
      <CoachTip 
        image={"palm_and_move"} 
        text2={"Move your hand"}
        showCoachTip={showCoachTip == "palm_and_move"}
      />
      <CoachTip 
        image={"palm_to_grip"} 
        text2={"Grab and release to select / unselect"}
        showCoachTip={showCoachTip == "grab_card"}
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
                showCoachTip={showCoachTip}
                handleNoGesture={handleNoGesture}
                setShowResponseCards={setShowResponseCards}
                setIsInSelectionMode={setIsInSelectionMode}
                setShowCheckConfirm={setShowCheckConfirm}
              />
            </motion.div>
            <div 
              id='cards-container'
              style={{
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                position: 'absolute', 
                zIndex: 80,
                background: "none",
              }}
            >
              {
                fakeResponseData.map((item, index) => (
                  <ResponseCard 
                    key={item.id}
                    data={item}
                    translateX={-210 + index * -350}
                    isActive={showResponseCards}
                    registerCardXCoords={registerCardXCoords}
                    inHoverState={inHoverStateCard == item.id}
                    inGripState={inGripStateCard == item.id}
                    readyForSelection={inHoverStateCard == item.id && inGripStateCard == item.id}
                    setSelectedCard={setSelectedCard}
                    unsetSelectedCard={unsetSelectedCard}
                    setShowCoachTip={setShowCoachTip}
                  />
                ))
              }
               <CheckConfirm 
                  isActive={showCheckConfirm} 
                  isSelected={false} 
                  text={"Done?"}
                  //setIsExiting={false}
                />
            </div>
           
          </div>
         
        </div>
      </div>
      <button onClick={() => reset()} style={{position: "fixed", right:"0px", zIndex:20002}}>Reset</button>
    </>
  );
}

export default Assistant;
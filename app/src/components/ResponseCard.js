import React, { useEffect, useState, useContext } from 'react';
import { motion } from "framer-motion"
import { LogContext } from './LogContext';

function ReponseCard(props) {
  const log = useContext(LogContext);
  const [isUnfurled, setIsUnfurled] = useState(false);
  const [inSelectedState, setInselectedState] = useState(false);
  const [readyForSelection, setReadyForSelection] = useState(false);
  
  const variantsCardMain = {
    active: { 
      y: 0, 
      translateX: -140,
      scale: 1,
      opacity: 1, 
      transition: { duration: 0.4, ease: 'backOut' }
    },
    inactive: { 
      y: 0,
      translateX: props.translateX,
      opacity: 1, 
      transition: { duration: 0.4, ease: 'easeOut' }
    },
  }

  const variantsCardInner = {
    highlight: { 
      y: -274, 
      transition: { duration: 0.4, ease: 'backOut' }
    },
    dormant: { 
      y: -274, 
      transition: { duration: 0.4, ease: 'backOut' }
    },
    isSelectedFalse: { 
      y: -274,
      transition: { duration: 0.2, ease: 'backOut' }
    },
    isSelectedTrue: {
      y: -332,
      transition: { duration: 0.2, ease: 'backOut',}
    },
    isGrippedSelectedFalse: {
      rotate: 2,
      y: -264,
      transition: { duration: 0.3, ease: 'backOut' }
    },
    isGrippedSelectedTrue: {
      rotate: 2,
      y: -332,
      transition: { duration: 0.3, ease: 'backOut' }
    },
  }

  const variantsCardHint = {
    activeDown: { 
      y: 220,
      opacity: 0,
      transition: { duration: 0.4, ease: 'backOut' }
    },
    activeUp: { 
      y: 278,
      opacity: 0,
      transition: { duration: 0.4, ease: 'backOut' }
    },
    inactiveUp: { 
      y: 220,
      opacity: 0,
      transition: { duration: 0.4, ease: 'backOut' }
    },
    inactiveDown: { 
      y: 278,
      opacity: 0,
      transition: { duration: 0.4, ease: 'backOut' }
    },
  }

  const variantsHintArrow = {
    activeDown: { 
      y: -230,
      opacity: 1,
      transition: { duration: 0.4, ease: 'backOut' }
    },
    inactiveDown: { 
      y: -190,
      opacity: 0,
      transition: { duration: 0.4, ease: 'backOut' }
    },
    inactiveUp: { 
      y: 142,
      opacity: 0,
      transition: { duration: 0.4, ease: 'backOut' }
    },
    activeUp: { 
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'backOut' }
    },
    isChecked: {
      opacity: 0,
      transition: { duration: 0.3, ease: 'backOut' }
    }
  }

  const checkVariants = {
    inactive: { 
      pathLength: 0, 
      transition: { duration: 0, }
    },
    active: { 
      pathLength: 1,
      transition: { duration: 0.2, ease: 'linear', delay: 0.4 }
    }
  };

  const bannerColors = {
    "Main Course": "#007BFF",
    "Side Dish": "#ee6600",
    "Dessert": "#7C6D67",
    "Appetizer": "#007BFF",
    "Mammal": "#007BFF",
    "Cocktail": "#ee6600",
    "Ave": "#7C6D67",
    "Appetizer": "#007BFF",
  }

  const difficultyColors = {
    "Easy": "#00cc66",
    "Medium": "#ffcc00",
    "Hard": "#cc6600",
    "Very Hard": "#cc0000",
  }

  useEffect(() => {
    if (isUnfurled) {
      // Register the x-coordinates of the card
      const element = document.querySelector('#' + props.data.id);
      const rect = element.getBoundingClientRect();
      props.registerCardXCoords(props.data.id, rect.left, rect.width)
    } else {
      props.registerCardXCoords(props.data.id, 100, 100)
    }
  }, [isUnfurled]);

/*  
  useEffect(() => {
    if (props.isChecked && props.isActive) {
      props.setSelectedCard(props.data.id)
      setInselectedState(true);
    } else if (!props.isChecked && props.isActive) {
      props.unsetSelectedCard(props.data.id)
      setInselectedState(true);
    }
  }, [props.isChecked, props.isActived, props.data]);
*/

  useEffect(() => {
    props.setShowCoachTip(null)
  }, [props.data, setInselectedState, inSelectedState]);

  useEffect(() => {
    
    if (props.readyForSelection && !readyForSelection && props.inGripState) {
      // If card is not ready for selection, but is gripped and in hover state, set ready for selection
      // When user releases grip and is in hover state, select the card
      setReadyForSelection(true)
    } else if (readyForSelection && !props.inGripState && !props.data.isSelected) {
      // If card is ready for selection, but is not gripped and in hover state, select the card
      // This captures the user releasing the  grip
      props.setSelectedCard(props.data.id)
      setReadyForSelection(false)
    } else if (readyForSelection && !props.inGripState && props.data.isSelected) {
      // Card is already selected, grip released, unselect card
      props.unsetSelectedCard(props.data.id)
      setReadyForSelection(false)
    }
  }, [props.inGripState, props.data.isSelected]);


  return (
    <>
    <motion.div 
      animate={props.isActive ? "active" : "inactive"}
      variants={variantsCardMain}
      initial="inactive"
      onAnimationComplete={() => {
        setIsUnfurled(true);
      }}
      className="menu-card-outer"
      id={props.data.id}
      style={{
        display: props.isActive ? "flex" : "none", 
        flexDirection: "column", 
        alignItems:"center",
        position:"relative",
        left: "0px",
      }}
    >
      <motion.div 
        className="response_card_hint"
        animate={() => {
          if (!props.data.isSelected) {
            return props.inHoverState ? "activeDown" : "inactiveDown";
          } else {
            return props.inHoverState ? "activeUp" : "inactiveUp";
          }
        }}
        variants={variantsCardHint}
        initial="inactive"
        style={{
          flexDirection: "column", 
          alignItems:"flexStart", 
          justifyContent:"flexStart",
          backgroundColor: "none",
          zIndex: "-300",
          opacity: "0",
        }}
      >
      </motion.div>
      <motion.div 
        animate={() => {
          if (!props.data.isSelected ) {
            return props.inHoverState ? "activeDown" : "inactiveDown";
          } else {
            return props.inHoverState ? "activeUp" : "inactiveUp";
          }
        }}
        variants={variantsHintArrow}
        initial="active"
        onAnimationComplete={() => {
          
        }}
        style={{
          width:"100%", 
          backgroundColor:"none", 
          display:"flex", 
          justifyContent:"center",
        }}
        >
          <img src={process.env.PUBLIC_URL + '/svg/icon_arrow_hint.svg'} 
            alt="open hand" 
            style={{width:'auto', height:'90px',}}
          />
      </motion.div>
      <motion.div 
        className="response_card" 
        animate={() => {
          if (props.data.isSelected) {
            if (props.inHoverState && props.inGripState) {
              return "isGrippedSelectedTrue"
            }
            return "isSelectedTrue"
          } else {
            if (props.inHoverState && props.inGripState) {
              return "isGrippedSelectedFalse"
            }
            return "isSelectedFalse"
          }
          return props.isActive ? "active" : "inactive";
        }}
        variants={variantsCardInner}
        initial="inactive"
        onAnimationComplete={() => {
          
        }}
      >
        <div style={{ 
          display: 'flex', justifyContent: 'flex-end', 
          paddingTop:"2px", position: "relative", left:"10px"
        }}>
          <svg style={{ background:"none", height:"28px", width:"28px" }}>
            <motion.path
              d="M15 29L25 38L40 19"
              fill="transparent"
              strokeWidth="6"
              stroke="#0FD446"
              variants={checkVariants}
              initial="inactive"
              transform="scale(0.6) translate(-10, -10)"
              animate={props.data.isSelected ? 'active' : 'inactive'}
              onAnimationComplete={() => {
                
              }}
            />
          </svg>
        </div>
        <div style={{
          fontSize:"12px", 
          fontWeight:"700", 
          textAlign: "center",
          borderRadius: "12px",
          paddingTop:"8px",
          paddingBottom:"5px",
          backgroundColor: bannerColors[props.data.type],
          color: "#fff",
          textTransform: "uppercase",
          marginBottom:"16px",
          zIndex: "20",
        }}>
          {props.data.type}
        </div>
        <div style={{
          fontSize:"16px", 
          fontWeight:"700", 
          textAlign: "center", 
          color: "#444",
          padding:"10px",
        }}>
          {props.data.name}
        </div>
        <div style={{
          fontSize:"16px", 
          fontWeight:"400", 
          textAlign: "center", 
          color: "#666",
          padding:"10px",
          lineHeight:"1.3em",
          flex:1
        }}>
          {props.data.description}
        </div>
        <div style={{
          display:"flex",
          flexDirection:"row",
          justifyContent:"center",
        }}>
          <div style={{ display: "flex", justifyContent:"center", alignItems:"center", textAlign: "center" }}>
            <span className="material-icons" style={{ fontSize: "20px", color: "#777" }}>
              timer
            </span> 
            <div style={{marginLeft:"4px", paddingTop:"2px"}}>
              {props.data.time}
            </div>
          </div>
          <div style={{flex:1}}></div>
          <div style={{ display: "flex", justifyContent:"center", alignItems:"center", textAlign: "center" }}>
            <div style={{ borderRadius: "50%", 
              backgroundColor: difficultyColors[props.data.difficulty], 
              width: "13px", height: "13px" }}/>
            <div style={{marginLeft:"8px", paddingTop:"2px"}}>
              {props.data.difficulty}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
    </>
  );
}

export default ReponseCard;
import React, { useEffect, useState, useContext } from 'react';
import { motion } from "framer-motion"
import { LogContext } from './LogContext';

function ReponseCard(props) {
  const log = useContext(LogContext);
  const [isUnfurled, setIsUnfurled] = useState(false);
  
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
    active: { 
      y: -184, 
      transition: { duration: 0.4, ease: 'backOut' }
    },
    inactive: { 
      y: -184,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
    isSelected: {
      y: -160,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  }

  const variantsCardHint = {
    active: { 
      y: 240,
      transition: { duration: 0.4, ease: 'backOut' }
    },
    inactive: { 
      y: 272,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
  }

  const variantsHand = {
    active: { 
      y: -712,
      opacity: 1,
      transition: { duration: 0.6, ease: 'backOut' }
    },
    inactive: { 
      y: -660,
      opacity: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
  }

  const checkVariants = {
    inactive: { pathLength: 0, },
    active: { pathLength: 1,}
  };

  const bannerColors = {
    "Main Course": "#007BFF",
    "Side Dish": "#ee6600",
    "Dessert": "#7C6D67",
    "Appetizer": "#007BFF",
    "Mammal": "#007BFF",
    "Amphibian": "#ee6600",
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
      const element = document.querySelector('#' + props.data.id);
      const rect = element.getBoundingClientRect();
      props.registerCardXCoords(props.data.id, rect.left, rect.width)
    } else {
      props.registerCardXCoords(props.data.id, 100, 100)
    }
  }, [isUnfurled]);

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
        animate={props.inHoverState ? "active" : "inactive"}
        variants={variantsCardHint}
        initial="inactive"
        style={{
          flexDirection: "column", 
          alignItems:"flexStart", 
          justifyContent:"flexStart",
          backgroundColor: "none",
          zIndex: "-300",
        }}
      >
      </motion.div>
      <motion.div 
        className="response_card" 
        animate={() => {
          return props.isActive ? "active" : "inactive"
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
              //animate={props.isChecked ? 'active' : 'inactive'}
              transition={{ duration: 0.2, ease: 'easeOut', delay: 0.4 }} 
              //onAnimationComplete={() => {
              //  props.setIsExiting(true)
              //}
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
          backgroundColor: props.isChecked ? "black" : bannerColors[props.data.type],
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
      
      <motion.div 
          animate={props.inHoverState ? "active" : "inactive"}
          variants={variantsHand}
          initial="active"
          style={{
            width:"100%", 
            backgroundColor:"none", 
            display:"flex", 
            justifyContent:"center",
          }}>
            <img src={process.env.PUBLIC_URL + '/svg/icon_palm_open_up.svg'} 
              alt="open hand" 
              style={{width:'auto', height:'90px',}}
            />
        </motion.div>
    </motion.div>
    </>
  );
}

export default ReponseCard;
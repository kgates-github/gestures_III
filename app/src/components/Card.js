import React, { useEffect, useState, useContext } from 'react';
import GestureTarget from './GestureTarget';
import { motion } from "framer-motion"
import { LogContext } from './LogContext';


function MicrophoneCard(props) {
  const log = useContext(LogContext);
  const [animation, setAnimation] = useState('inactive');
  const [animationOuter, setAnimationOuter] = useState('inactive');

  const variants = {
    active: { 
      y: -40, 
      opacity: 1, 
      border: "8px solid #0098fd", 
      scale: 1.06,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    inactive: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      border: "4px solid #999",
      transition: { duration: 0.3, ease: 'easeOut' }
    },
  }

  const variantsOuter = {
    active:    { 
      y: 0, 
      scale: 1,
      opacity: 1, 
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    inactive: { 
      y: -50,
      scale: 0.9,
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
  }

  /*
  useEffect(() => {
    if (props.isExiting && props.isSelected && props.isActive) { 
      //props.setAnimal(props.title);
    } 
  }, [props.isExiting]);
  */

  const getAnimation = () => {
    if (props.isExiting && props.isSelected && props.isActive) { 
      return "exitSlow"
    } 
    if (props.isExiting && !props.isSelected && !props.isActive) { 
      return "exitFast"
    }
    return props.isActive ? "active" : "inactive"
  }

  useEffect(() => {
    setAnimation(getAnimation());
  }, [props.isExiting, props.isSelected, props.isActive]);


  useEffect(() => {
    setAnimationOuter(props.showCard ? "active" : "inactive");
  }, [props.showCard]);
 

  return (
    <motion.div 
      animate={animationOuter}
      variants={variantsOuter}
      initial="inactive"
      className="menu-card-outer" 
      style={{display:"flex", flexDirection: "column", alignItems:"center"}}
    >
      <motion.div className="menu-card"
        animate={animation}
        variants={variants}
        initial="inactive"
        onAnimationComplete={() => {
          if (props.isExiting && props.isSelected && props.isActive) {
            props.selectAndClose(props.title)
          }
        }}
      >
        <div style={{fontSize:"16px", fontWeight:"700"}}>{props.title}</div>
        {props.text}
      </motion.div>
      
      {
        <GestureTarget 
          isActive={props.isActive} 
          isSelected={props.isSelected} 
          setIsExiting={props.setIsExiting}
        />
      }
    </motion.div>
  );
}

export default MicrophoneCard;
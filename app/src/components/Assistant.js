import React, { useEffect, useState, useContext } from 'react';
import { LogContext } from './LogContext';
//import { motion, useMotionValue } from "framer-motion"


function Assistant(props) {
  const log = useContext(LogContext);
  const [isActive, setIsActive] = useState(false); // Menu is open/closed
  
  const handleOpenPalm = (e) => {
    log('handleOpenPalm ' + isActive + " " + e.detail.handedness);
    alert('handleOpenPalm ' + isActive + " " + e.detail.handedness);
  }

  useEffect(() => {
    // Open coach tip
    setIsActive(false);

    // Open_Palm opens dialog, no gesture closes dialog 
    props.subscribe("Open_Palm", handleOpenPalm);
   
    return () => {
      props.unsubscribe("Open_Palm", handleOpenPalm);
    }
  }, []);

  
  return (
    <>
      This is an assistant
    </>
  );
}

export default Assistant;

            
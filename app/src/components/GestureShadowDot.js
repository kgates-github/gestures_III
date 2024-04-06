import React, { useContext, useEffect } from 'react';
import { motion } from "framer-motion"
import { LogContext } from './LogContext';


function GestureShadowDot(props) {
  const log = useContext(LogContext);

  useEffect(() => {
    console.log('GestureShadowDot props.showShadowDot:', props.showShadowDot);
  }, [props.showShadowDot]);
  
  return (
    <motion.div
      style={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        background: "#000",
        opacity: props.showShadowDot ? 0.3 : 0,
        filter: 'blur(10px)',
        position: "absolute",
        x: props.x,
        y: props.y,
        zIndex: 100,
        display: 'block',
      }}
    />
  );
}

export default GestureShadowDot;

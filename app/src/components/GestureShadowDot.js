import React, { useEffect, useState, useContext } from 'react';
import { motion } from "framer-motion"
import { LogContext } from './LogContext';


function GestureShadowDot(props) {
  const log = useContext(LogContext);

  return (
    <motion.div
      style={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        background: "#000",
        opacity: 0.3,
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

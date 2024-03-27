import React, { useEffect, useContext } from 'react';
import { motion } from "framer-motion"
import { LogContext } from './LogContext';

function MicrophoneIcon(props) {
  const log = useContext(LogContext);
  
  
  const variants = {
    active:    { 
      r: [30, 80],
      stroke: ["#fff", "#ccc", "#fff"],
      transition: { repeat: Infinity, duration: 1.5, delay: 0 }
    },
    inactive: { 
      r: 30,
      stroke: "#fff",
    },
  }

  const variants2 = {
    active:    { 
      r: [30, 80],
      stroke: ["#fff", "#ccc", "#fff"],
      transition: { repeat: Infinity, duration: 1.5, delay: 0.75 }
    },
    inactive: { 
      r: 30,
      stroke: "#fff",
    },
  }

  useEffect(() => {
    if (props.micActive) {
      
    } else {
      
    }
  }, [props.micActive]);
  
  return (
    <div style={{position:"relative", top:"50px"}}>
      <motion.svg height="160" width="160" style={{position:"absolute", background:"none"}}>
        <motion.circle 
          cx="80" 
          cy="80" 
          r="20" 
          stroke="#555" 
          strokeWidth="2" 
          fill="none" 
          animate={props.micActive ? "active" : "inactive"} 
          variants={variants}
        />
        <motion.circle 
          cx="80" 
          cy="80" 
          r="20" 
          stroke="#555" 
          strokeWidth="2" 
          fill="none" 
          animate={props.micActive ? "active" : "inactive"} 
          variants={variants2}
        />
        
      </motion.svg>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "160px",
          height: "160px",
          borderRadius: "50%", 
          backgroundColor: "none", 
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "60px",
            height: "60px",
            borderRadius: "50%", 
            backgroundColor: "#666", 
          }}
        >
          <span className="material-icons" style={{ fontSize: "36px", color: "#fff" }}>
            mic
          </span>
        </div>
      </div>

      
    </div>
  );
}

export default MicrophoneIcon;



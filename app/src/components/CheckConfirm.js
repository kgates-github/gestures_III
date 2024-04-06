import React, { useContext } from 'react';
import { motion } from "framer-motion"
import { LogContext } from './LogContext';


function CheckConfirm(props) {
  const log = useContext(LogContext);

  const variantsConfirm = {
    active: { 
      opacity: 1, 
      y: -30,
      x:-130,
      transition: { duration: 0.4, ease: 'easeOut', delay: 0.8 }
    },
    inactive: { 
      opacity: 0, 
      y: -30,
      x:-160,
      transition: { duration: 0.4, ease: 'easeOut', delay: 0.8 }
    },
  }

  const circleVariants = {
    inactive: { pathLength: 0, },
    active: { pathLength: 1,}
  };

  const checkVariants = {
    inactive: { pathLength: 0, },
    active: { pathLength: 1,}
  };

  return (
    <motion.div
      animate={(props.isActive) ? 'active' : 'inactive'}
      variants={variantsConfirm}
      initial="inactive"
      style={{
        display:"flex", 
        flexDirection:"column",
        justifyContent:"center", 
        alignItems:"center", 
        background: "none",
      }}
    >
      <div style={{
        position:"relative", 
        top:"74px", 
        width:"62px", 
        height:"62px",
        background: "white",
        borderRadius: "50%",
        zIndex: -100,
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.4)",
      }}></div>
      
      <svg width="82" height="82">
        <motion.path
          d="M 43, 43 m -28.5, 0 a 28.5,28.5 0 1,0 57,0 a 28.5,28.5 0 1,0 -57,0"
          fill="transparent"
          strokeWidth="8"
          stroke="#999" 
        />  
        <motion.path
          d="M 43, 43 m -28.5, 0 a 28.5,28.5 0 1,0 57,0 a 28.5,28.5 0 1,0 -57,0"
          fill="transparent"
          strokeWidth="6"
          stroke="#0FD446"
          variants={circleVariants}
          initial="inactive"
          animate={props.isSelected ? 'active' : 'inactive'}
          transition={{ duration: 0.5, ease: 'easeOut' }} 
        />
        <motion.path
          d="M15 29L25 38L40 19"
          fill="transparent"
          strokeWidth="6"
          stroke="#0FD446"
          variants={checkVariants}
          initial="inactive"
          transform="translate(15, 15.5)"
          animate={props.isSelected ? 'active' : 'inactive'}
          transition={{ duration: 0.2, ease: 'easeOut', delay: 0.4 }} 
          onAnimationComplete={() => {
            //props.setIsExiting(true)
          }}
        />
      </svg>
        
      <motion.img 
        src={process.env.PUBLIC_URL + '/svg/icon_thumb_up_alt.svg'} 
        style={{
          position:"relative", top:"-74px", left:"2px",
          width:'50px', height:'50px', marginTop:'8px', marginLeft:'2px'
        }}
        initial={{ opacity: 1 }}
        animate={props.isSelected ? { opacity: 0 } : { opacity: 1 }}
        transition={{ delay: 0, duration: 0.4 }}
      />

      <div style={{
        position:"relative", top:"-50px", 
        fontSize:"14px", fontWeight:"300", 
        textTransform:"uppercase",
        color:"#999", textAlign:"center",
        padding: "2px 20px",
        background:"#fff",
        color:"#222",
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.4)",
      }}>
        {props.text}
      </div>
      
    </motion.div>
  );
}
export default CheckConfirm;


import React, { useContext, useEffect } from 'react';
import { motion } from "framer-motion"
import { LogContext } from './LogContext';


function CheckConfirm(props) {
  const log = useContext(LogContext);

  const variantsConfirm = {
    active: { 
      opacity: 1, 
      y: -30,
      x:-145,
      transition: { duration: 0.2, ease: 'easeOut', delay: 0 }
    },
    inactive: { 
      opacity: 0, 
      y: -30,
      x:-145,
      transition: { duration: 0.2, ease: 'easeOut', delay: 0 }
    },
    exit: {
      opacity: 0, 
      y: -30,
      x:-145,
      transition: { duration: 0.2, ease: 'easeOut' }
    }
  }

  const circleVariants = {
    inactive: { 
      pathLength: 0, 
      transition: { duration: 0.2, ease: 'easeOut', delay: 0.6 }
    },
    active: { 
      pathLength: 1,
      transition: { duration: 0.2, ease: 'easeOut', delay: 0.6 }
    }
  };

  const checkVariants = {
    inactive: { pathLength: 0,
    transition: { duration: 0.2, ease: 'easeOut', delay: 0.6 }
    },
    active: { 
      pathLength: 1,
      transition: { duration: 0.2, ease: 'easeOut', delay: 0.6 }
    }
  };

  useEffect(() => {
    if (props.isDone) {
      props.setDialogAnimation('pre_exit')
      props.setShowCoachTip(null)
    }
  }, [props.isDone]);

  

  return (
    <motion.div
      animate={props.isDone ? 'active' : 'inactive'}
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
      <svg width="300" height="300">
        <motion.path
          d="M15 29L25 38L40 19"
          fill="transparent"
          strokeWidth="6"
          stroke="#25C02B"
          variants={checkVariants}
          initial="inactive"
          transform="translate(90, 50), scale(3)"
          animate={props.isDone ? 'active' : 'inactive'}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.6 }} 
          onAnimationComplete={() => {
            props.setDialogAnimation('exit')
          }}
        />
      </svg>
      
    </motion.div>
  );
}
export default CheckConfirm;

 {/*
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
          strokeWidth="8"
          stroke="#00aa44"
          variants={circleVariants}
          initial="inactive"
          animate={props.isDone ? 'active' : 'inactive'}
          transition={{ duration: 0.5, ease: 'easeOut' }} 
        />
        <motion.path
          d="M15 29L25 38L40 19"
          fill="transparent"
          strokeWidth="8"
          stroke="#00aa44"
          variants={checkVariants}
          initial="inactive"
          transform="translate(15, 15.5)"
          animate={props.isDone ? 'active' : 'inactive'}
          transition={{ duration: 0.2, ease: 'easeOut', delay: 0.4 }} 
          onAnimationComplete={() => {
            props.setDialogAnimation('exit')
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
        animate={props.isDone ? { opacity: 0 } : { opacity: 1 }}
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
    </div>*/}
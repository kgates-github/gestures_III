import React, { useEffect, useState, useContext } from 'react';
//import GestureTarget from './GestureTarget';
import { motion } from "framer-motion"
import { LogContext } from './LogContext';

function ReponseCard(props) {
  const log = useContext(LogContext);
  //const [animationCardMain, setAnimationCardMain] = useState('inactive');
  
  
  const variantsCardMain = {
    active:    { 
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

  const bannerColors = {
    "Main Course": "#007BFF",
    "Side Dish": "#ee6600",
    "Dessert": "#7C6D67",
    "Appetizer": "#007BFF",
  }

  const difficultyColors = {
    "Easy": "#00cc66",
    "Medium": "#ffcc00",
    "Hard": "#cc6600",
    "Very Hard": "#cc0000",
  }

  useEffect(() => {
   
  }, [props.data]);
  
  return (
    <>
    <motion.div 
      animate={props.isActive ? "active" : "inactive"}
      variants={variantsCardMain}
      initial="inactive"
      onAnimationComplete={() => {
        
      }}
      className="menu-card-outer"
      style={{
        display: props.isActive ? "flex" : "none", 
        flexDirection: "column", 
        alignItems:"center",
        position:"relative",
        left: "0px",
      }}
    >
      <motion.div className="response_card" >
        <div style={{
          fontSize:"12px", 
          fontWeight:"400", 
          textAlign: "center",
          borderRadius: "12px",
          paddingTop:"8px",
          paddingBottom:"5px",
          backgroundColor: bannerColors[props.data.type],
          color: "#fff",
          textTransform: "uppercase",
          marginBottom:"16px",
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
      
      {/*
        <GestureTarget 
          isActive={props.isActive} 
          isSelected={props.isSelected} 
          setIsExiting={props.setIsExiting}
        />
      */}
    </motion.div>
    </>
  );
}

export default ReponseCard;
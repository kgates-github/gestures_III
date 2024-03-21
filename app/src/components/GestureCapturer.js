import React, { useEffect, useRef, useState, useContext } from 'react';
import { GestureRecognizer, FilesetResolver } from '@mediapipe/tasks-vision';
import { LogContext } from './LogContext';

function GestureCapturer(props) {
  const log = useContext(LogContext);
  const [introOneDisplay, setIntroOneDisplay] = useState('flex');
  const [introTwoDisplay, setIntroTwoDisplay] = useState('none');
  const [introThreeDisplay, setIntroThreeDisplay] = useState('none');
  
  const [webcamRunning, setWebcamRunning] = useState(false);
  let gestureRecognizer;
  const videoRef = useRef(null);
  //const canvasRef = useRef(null);
  const enableWebcamButtonRef = useRef(null);
  const runningMode = "worker";
  let lastVideoTime = null;
  let results;
  let gestureName = '';
  let lastGesture = null;
  let handedness = '';
  let frameCount = 0;
  const xs = [0, 0, 0];

  
  useEffect(() => {
    const video = videoRef.current;
    //const canvas = canvasRef.current;
    const enableWebcamButton = enableWebcamButtonRef.current;
    
    const createGestureRecognizer = async () => {
      const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
      gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
          delegate: "GPU"
        },
        runningMode: runningMode,
      });
      setIntroOneDisplay('none');
      setIntroTwoDisplay('flex');
      
      // Check if webcam access is supported.
      function hasGetUserMedia() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      }
      
      if (hasGetUserMedia()) {
        enableWebcamButton.addEventListener("click", enableCam);
      } else {
        console.warn("getUserMedia() is not supported by your browser");
      }

      // Enable the live webcam view and start detection.
      function enableCam(event) {
        setIntroTwoDisplay('none');
        setIntroThreeDisplay('flex');
        
        // getUsermedia parameters.
        const constraints = { video: true };

        // Activate the webcam stream.
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
          video.srcObject = stream;
          video.addEventListener("loadeddata", initPredictWebcam);
        });
      }

      const initPredictWebcam = () => {
        setWebcamRunning(true);
        setIntroThreeDisplay('none');
        //props.setIntroDisplay('flex');
        predictWebcam()
        props.setIsLoaded(true);
      }

      async function predictWebcam() {
       
        if (runningMode === "IMAGE") {
          runningMode = "VIDEO";
          await gestureRecognizer.setOptions({ runningMode: "VIDEO", numHands: 1 });
        }

        frameCount++;

        let nowInMs = Date.now();
        if (video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime;
          results = gestureRecognizer.recognizeForVideo(video, nowInMs);
        }

        if (results.gestures.length > 0) {
          if (lastGesture != results.gestures[0][0].categoryName && results.gestures[0][0].categoryName != 'None') {
            gestureName = results.gestures[0][0].categoryName;
            handedness = results.handedness[0][0].categoryName;
            //console.log('Detected gesture: ' + gestureName + ' ' + handedness);

            xs[0] = results.landmarks[0][0].x;
            xs[1] = results.landmarks[0][0].x;
            xs[2] = results.landmarks[0][0].x;

            props.publish(
              gestureName, 
              { 
                handedness: handedness,
                x: results.landmarks[0][0].x,
                y: results.landmarks[0][0].y,
                z: results.landmarks[0][0].z
              }
            );
            lastGesture = gestureName;
          } else if (frameCount % 10 === 0 && 
            lastGesture == results.gestures[0][0].categoryName && 
            lastGesture != "No_Gesture") {
              // If the same gesture is detected, publish x, y, z coordinates every 30 frames
              
              props.publish(
                "Hand_Coords", 
                {
                  handedness: handedness,
                  x: results.landmarks[0][0].x, //xs.slice(1).concat(results.landmarks[0][0].x).reduce((a, b) => a + b, 0) / xs.length,
                  y: results.landmarks[0][0].y,
                  z: results.landmarks[0][0].z
                }
              );
          }
        } else if (lastGesture != "No_Gesture") {
          // In "no_gesture" mode. Wait until we get other gesture to reset
          props.publish("No_Gesture", {});
          lastGesture = "No_Gesture";
        }
        // Call this function again to keep predicting when the browser is ready.
        if (true) {
          window.requestAnimationFrame(predictWebcam);
        }
      }
    };
    createGestureRecognizer();
  }, []);

  return (
    <>
    
      <div className="outerContainer" style={{ display: introOneDisplay, position: "absolute", zIndex:10 }}>
        <div id="innerContainer">
          Loading...
        </div>
      </div>
      <div className="outerContainer" style={{ display: introTwoDisplay, position: "absolute", zIndex:10 }}>
        <div id="innerContainer">
          <div className="annotations">This prototype uses your webcam to recognize hand gestures.</div>
          <div ref={enableWebcamButtonRef}  id="webcamButton">
            <span className="">Enable Webcam</span>
          </div> 
          <div style={{height:"100px"}}></div>
        </div>
      </div>
      <div className="outerContainer" style={{ display: introThreeDisplay, position: "absolute", zIndex:10 }}>
        <div id="innerContainer">
          Staring camera...
        </div>
      </div>
      {/*
      <div
        className="outerContainer" 
        style={{ display: props.introDisplay, position: "absolute", zIndex:10 }}
      >
        <div id="innerContainer">
          <img src={process.env.PUBLIC_URL + '/svg/icon_palm_open.svg'} 
            alt="open hand" 
            style={{width:'60px', height:'60px'}}
          /> 
          <div style={{marginTop:"12px", paddingLeft:"2px"}}>Raise your right hand...</div>
        </div>
      </div>
      */}
      <div style={{ position: "absolute", zIndex:10 }}>
        <video ref={videoRef}
          style={{ 
            position: "absolute", 
            display: "hidden", 
            left: "0px", top: "0px", 
            width: "100%", 
            height: "100%" }} autoPlay playsInline></video>
        
      </div>
      
    </>
  );
}

export default GestureCapturer;


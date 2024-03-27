import React, { useEffect, useState } from 'react';
import {FilesetResolver, LlmInference} from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai';
const modelFileName = 'gemma-2b-it-gpu-int4.bin'; /* Update the file name */


const LLMHandler = (props) => {
  let answerString = '';
  let llmInference;
  const [isRunning, setIsRunning] = useState(false);

  const consumeStream = (partialResults, complete) => {
    answerString += partialResults; 
    
    if (complete) {
      setIsRunning(false);
      if (!answerString) {
        answerString = 'Result is empty';
      } else {
        console.log(answerString);
      }
    }
  }

  const test = () => {
    answerString=''
    const testInput = `<start_of_turn>user
    Who is Stevie Wonter<end_of_turn>
    <start_of_turn>model"`;
    console.log("test llmInference ", llmInference)
    //llmInference.generateResponse(testInput, consumeStream);
  }

  useEffect(() => {
    if (!isRunning && props.LLMIsLoaded) {
      setIsRunning(true);
      answerString = '';
      //llmInference.generateResponse(props.userInput, consumeStream);
    }
  }, [props.userInput]);

  useEffect(() => {
    async function runDemo() {
      console.log("LlmInference ", LlmInference)

      const genaiFileset = await FilesetResolver.forGenAiTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai/wasm');
    
      await LlmInference.createFromOptions(genaiFileset, {
        baseOptions: {
            modelAssetPath: 'gemma-2b-it-gpu-int4.bin'
        },
        maxTokens: 1000,
        topK: 40,
        temperature: 0.8,
        randomSeed: 101
        }).then(llm => {
          llmInference = llm;
          props.setLLMIsLoaded(true);
          console.log('LLMHandler initialized', llmInference.generateResponse);
        }).catch((e) =>{
          console.log('Failed to initialize the task.');
          console.log(e);
        });
      
      /*
      LlmInference
        .createFromModelPath(genaiFileset, modelFileName)
        .then(llm => {
          llmInference = llm;
          props.setLLMIsLoaded(true);
          console.log('LLMHandler initialized');
        }).catch((e) =>{
          console.log('Failed to initialize the task.');
          console.log(e);
        });
      */
    }
    
    runDemo();
  }, []);

  return (
    <div style={{position:"absolute", right:"100px", zIndex:"200000"}}>
      <button id="test" onClick={() => test()}>Test</button>
    </div>
  );
};

export default LLMHandler;


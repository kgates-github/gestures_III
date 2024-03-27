
// Copyright 2024 The MediaPipe Authors.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//      http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// ---------------------------------------------------------------------------------------- //

import {FilesetResolver, LlmInference} from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai';

const input = document.getElementById('input');
const output = document.getElementById('output');
const output2 = document.getElementById('output2');
const tempText = document.getElementById('tempText');
const submit = document.getElementById('submit');

const basePrompt = `You are an editor who can take texts and rewrite them more concisely. 

You must format your answer in JSON or I will pet a cat backwards against the natural direction of its fur. The JSON should be formatted like this: 

[
  '<text/>'
] 

QUESTION: Shorten this paragraph by 20 words: 

`;

const testText = `
Richard Buckminster Fuller was a visionary inventor, designer, and philosopher who dedicated his life to developing sustainable solutions that addressed human shelter, education, and resource use. His most renowned invention is the geodesic dome, a revolutionary lightweight and cost-effective structure that could cover large areas without internal supports. Fuller's philosophy of 'doing more with less' led to groundbreaking contributions in design, engineering, and architecture, encapsulating his philosophy of 'doing more with less.' Fuller's ideas continue to inspire sustainability and environmental efforts around the world, underscoring his role as a pioneer in promoting a harmonious balance between nature and technology.
`

const testText2 = `Richard Buckminster Fuller was a visionary inventor, designer, and philosopher who dedicated his life to developing sustainable solutions that addressed human shelter, education, and resource use. His most renowned invention is the geodesic dome, a revolutionary lightweight and cost-effective structure that could cover large areas without internal supports. Fuller's philosophy of 'doing more with less' led to groundbreaking contributions in design, engineering, and architecture, encapsulating his philosophy of 'doing more with less.' Fuller's ideas continue to inspire sustainability and environmental efforts around the world, underscoring his role as a pioneer in promoting a harmonious balance between nature and technology.`

let prompt = '';
let prompt_count = 0

const modelFileName = 'gemma-2b-it-gpu-int4.bin'; /* Update the file name */
let llmInference;
let isValid = false;
let wordCount = 0;
let strOutput = '';

/**
 * Display newly generated partial results to the output text box.
 */
function displayPartialResults(partialResults, complete) {
  /*if (partialResults.indexOf('[') !== -1 || isValid) {
    isValid = true;
    output.textContent += partialResults.replace(/[\[\]\"\`\n]/g, '');
    
  }*/
  output.textContent += partialResults

  if (complete) {
    if (!output.textContent) {
      output.textContent = 'Result is empty';
    }
    //alert(output.textContent)
    submit.disabled = false;
  }
}

function displayPartialResults2(partialResults, complete) {
  output2.textContent += partialResults;
  //output2.textContent += 'hello world'
  
  /*
  if (partialResults.indexOf('[') !== -1 || isValid) {
    isValid = true;
    output2.textContent += partialResults2.replace(/[\[\]\"\`\n]/g, '');
  }
  */
  
  if (complete) {
    isValid = false;
    //wordCount = output2.textContent.trim().split(/\s+/).length;
    //output2.textContent += `\n\nWord count: ${wordCount}`;
    if (!output.textContent) {
      output2.textContent = 'Result is empty';
    }
    submit.disabled = false;
  }
}



/**
 * Main function to run LLM Inference.
 */
async function runDemo() {
  const genaiFileset = await FilesetResolver.forGenAiTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai/wasm');
  
  // Change this to reset everything
  submit.onclick = () => {
    
    output.textContent = '';
    submit.disabled = true;
    console.log(input.value)
    llmInference.generateResponse(input.value, displayPartialResults);
  };

  document.addEventListener('keydown', (event) => {
    // Check if the right arrow key was pressed
    if (event.key === 'ArrowRight') {
      prompt_count += 1;
      console.log(prompt_count)
      if (prompt_count == 1) {
        output.textContent = '';
        output2.textContent = '';
        submit.disabled = true;
        prompt = basePrompt + ' ' + input.value;
        llmInference.generateResponse(prompt, displayPartialResults);
      } else if (prompt_count == 2) {
        output2.textContent = 'STARTING... ';
        submit.disabled = true;
        
        prompt = basePrompt + ' ' + output.textContent;
        tempText.textContent = prompt
        llmInference.generateResponse(prompt, displayPartialResults2);
        prompt_count = 0;
      }
    }
  });

  submit.value = 'Loading the model...'
  LlmInference
      .createFromModelPath(genaiFileset, modelFileName)
      .then(llm => {
        llmInference = llm;
        submit.disabled = false;
        submit.value = 'Get Response'
      }).catch(() =>{
        alert('Failed to initialize the task.');
      });
  /*
  llmInference = await LlmInference.createFromOptions(genaiFileset, {
    baseOptions: {
        modelAssetPath: 'gemma-2b-it-gpu-int4.bin'
    },
    maxTokens: 1000,
    topK: 40,
    temperature: 0.8,
    randomSeed: 101
    }).then(llm => {
      llmInference = llm;
      submit.disabled = false;
      //submit.value = 'Get Response'
    }).catch(() =>{
      alert('Failed to initialize the task.');
    });
  */
}

runDemo();

/*
You are an editor who can take texts and rewrite them more concisely. 

You must format your answer in JSON or I will pet a cat backwards against the natural direction of its fur. The JSON should be formatted like this: 

[
  '<text/>'
] 

QUESTION: Shorten this paragraph by 20 words: 

Richard Buckminster Fuller was a visionary inventor, designer, and philosopher who dedicated his life to developing sustainable solutions that addressed human shelter, education, and resource use. His most renowned invention is the geodesic dome, a revolutionary lightweight and cost-effective structure that could cover large areas without internal supports. Fuller's philosophy of 'doing more with less' led to groundbreaking contributions in design, engineering, and architecture, encapsulating his philosophy of 'doing more with less.' Fuller's ideas continue to inspire sustainability and environmental efforts around the world, underscoring his role as a pioneer in promoting a harmonious balance between nature and technology.
 */

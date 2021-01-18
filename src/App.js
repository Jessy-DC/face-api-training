import './App.css';
import React, {useEffect, useState} from 'react';
import * as faceapi from "face-api.js";
import {startVideo} from "./video/video";
import {ThemeProvider} from "styled-components";
import { GlobalStyles} from "./style/GlobalStyles";
import { lightMode, darkMode } from "./style/Theme"
import Switch from "react-switch";

function App() {
    const [theme, setTheme] = useState('light');
    const [checked, setChecked] = useState(false);

    const themeToggler = () => {
        theme === 'light' ? setTheme('dark') : setTheme('light')
        checked === true ? setChecked(false) : setChecked(true)
    }

    useEffect(() => {
        const video = document.getElementById("inputVideo")
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]).then(startVideo(video))

        video.addEventListener('play', () => {
            const canvas = faceapi.createCanvasFromMedia(video)
            document.body.append(canvas)
            const displaySize = {width: video.width, height: video.height}
            faceapi.matchDimensions(canvas, displaySize)

            setInterval(async () => {
                const detections = await faceapi.detectAllFaces(video,
                    new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
                    .withFaceExpressions()
                const resizedDetections = faceapi.resizeResults(detections,
                    displaySize)

                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
                faceapi.draw.drawDetections(canvas, resizedDetections)
                faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
            }, 100)
        })
    }, []);

  return (
      <ThemeProvider theme={theme === 'light' ? lightMode : darkMode}>
          <GlobalStyles/>
          <div className="App">
               <h1 id="HelloWorld">Hello World !</h1>
               <video id="inputVideo" width={720} height={560} controls={true} autoPlay muted >MyVideo</video>
          </div>
          <div>
              <label>
                  <span>Switch to {theme === 'light' ? 'dark' : 'light'} mode</span>
                  <Switch onChange={themeToggler} checked={checked} />
              </label>
          </div>
      </ThemeProvider>
  );
}

export default App;

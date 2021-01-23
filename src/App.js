import './App.css';
import React, {useEffect, useState} from 'react';
import * as faceapi from "face-api.js";
import {startVideo} from "./video/video";
import {ThemeProvider} from "styled-components";
import { GlobalStyles} from "./style/GlobalStyles";
import { lightMode, darkMode } from "./style/Theme"
import Switch from "react-switch";
import './style/navbar.css'

function App() {
    const [theme, setTheme] = useState('dark');
    const [checked, setChecked] = useState(true);

    const themeToggler = () => {
        theme === 'light' ? setTheme('dark') : setTheme('light')
        checked === false ? setChecked(true) : setChecked(false)
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
      <ThemeProvider theme={theme === 'dark' ? darkMode : lightMode}>
          <GlobalStyles/>
          <div className="Navbar">
              <div className="header">
                  <header>My navbar</header>
                  <span>{theme === 'dark' ? 'Light' : 'Dark'} mode</span>
                  <Switch onChange={themeToggler} checked={checked} />
              </div>
              <div className="App content">
                  <h1 id="HelloWorld">Hello World !</h1>
                  <video id="inputVideo" width={720} height={560} controls={true} muted >MyVideo</video>
              </div>
          </div>

      </ThemeProvider>
  );
}

export default App;

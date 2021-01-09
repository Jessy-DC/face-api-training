import './App.css';
import React, {useEffect} from 'react';
import * as faceapi from "face-api.js";

function startVideo(video) {
    navigator.getUserMedia(
        {video : {}},
        stream => video.srcObject = stream,
        error => console.log(error)
    )
}

function App() {
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
            })
        })
    }, []);

  return (
    <div className="App">
        <h1>Hello World !</h1>
        <video id="inputVideo" width={720} height={560} autoPlay muted>MyVideo</video>
    </div>
  );
}

export default App;

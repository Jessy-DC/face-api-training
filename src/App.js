import './App.css';
import React, {useEffect} from 'react';
import * as faceapi from "face-api.js";
import ted from './ted.jpg'

function App() {
    async function test() {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models')
        await faceapi.nets.ageGenderNet.loadFromUri('/models')

        const input = document.getElementById('myImg')
        const detectionsWithAgeAndGender = await faceapi.detectAllFaces(input).withFaceLandmarks().withAgeAndGender()
        console.log(detectionsWithAgeAndGender);
    }

    useEffect(() => {
        test();
    }, []);

  return (
    <div className="App">
        <h1>Hello World !</h1>
        <img id="myImg" src={ted} alt="test" />
    </div>
  );
}

export default App;

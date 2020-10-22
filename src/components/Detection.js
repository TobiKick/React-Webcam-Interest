import React, { useState, useEffect } from "react";

import { Typography, Box, Button, TextField, Divider, Slider, Container, Grid, Paper } from "@material-ui/core";
import { sizing } from '@material-ui/system';

import * as cocoSsd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import Prediction from "./Prediction";
import {CSVLink, CSVDownload} from 'react-csv';


function Detection () {
  const [model, setModel] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [specificClass, setSpecificClass] = useState("");
  var val = 0

  const videoConstraints = {
    width: 250,
    height: 250,
    facingMode: "user"
  };

/*
  const WebcamCapture = () => {
    const webcamRef = React.useRef(null);

    const capture = React.useCallback(() => {
      setImageSrc(webcamRef.current.getScreenshot());
    }, [webcamRef]);

    return (
      <>
        <Webcam
          audio={false}
          height={250}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={250}
          videoConstraints={videoConstraints}
          id={"webcamFeed"}
        />
        <br />
        <Button onClick={capture}>Capture photo</Button>
      </>
    );
  };
*/

  const WebcamCapture = () => {
    const webcamRef = React.useRef(null);
    const mediaRecorderRef = React.useRef(null);
    const [capturing, setCapturing] = React.useState(false);
    const [recordedChunks, setRecordedChunks] = React.useState([]);
    const [recordedInterest, setRecordedInterest] = React.useState("");

    const handleStartCaptureClick = React.useCallback(() => {
      setCapturing(true);
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: "video/webm"
      });
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current.start();

      var vid = document.getElementById("myVideo");
      vid.play()

    }, [webcamRef, setCapturing, mediaRecorderRef]);

    const handleDataAvailable = React.useCallback(
      ({ data }) => {
        if (data.size > 0) {
          setRecordedChunks((prev) => prev.concat(data));
        }
      },
      [setRecordedChunks]
    );

    const handleStopCaptureClick = React.useCallback(() => {
      mediaRecorderRef.current.stop();
      setCapturing(false);

      var vid = document.getElementById("myVideo");
      vid.pause()

    }, [mediaRecorderRef, webcamRef, setCapturing]);

    const handleDownload = React.useCallback(() => {
      if (recordedChunks.length) {
        const blob = new Blob(recordedChunks, {
          type: "video/webm"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = "react-webcam-stream-capture.webm";
        a.click();
        window.URL.revokeObjectURL(url);
        setRecordedChunks([]);
      }



/*
      const csvData =[
        ['firstname', 'lastname', 'email'] ,
        ['John', 'Doe' , 'john.doe@xyz.com'] ,
        ['Jane', 'Doe' , 'jane.doe@xyz.com']
      ];
      <CSVLink data={csvData} >Download me</CSVLink>
      // or



      const url = URL.createObjectURL(recordedInterest);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "interest.csv";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedInterest([]);
*/
    }, [recordedChunks, recordedInterest]);


    const handleInterestSlider = React.useCallback((value) => {
        console.log("Interest value saved")
        console.log(value)
        setRecordedInterest((prev) => prev.concat((value.toString()) + ","))
        console.log(recordedInterest)
    }, [recordedInterest]);


    return (
      <React.Fragment>
        <Grid container spacing={3} justify="center">
          <Grid item xs={8}>
            <video id="myVideo" src="content/movie.mp4" height="100%" width="100%"></video>
          </Grid>
          <Grid item xs={3}>
              <Grid item xs={12}>
                <Webcam audio={false} ref={webcamRef} height="100%" width="100%" videoConstraints={videoConstraints}/>
              </Grid>
              <br/>
              <Grid item xs={12}>
                {capturing ? (
                      <Button color="primary" variant="contained" style={{ height: "56px", marginLeft: "20px" }} onClick={handleStopCaptureClick}>Stop Capture</Button>
                    ) : (
                      <Button color="primary" variant="contained" style={{ height: "56px", marginLeft: "20px" }} onClick={handleStartCaptureClick}>Start Capture</Button>
                    )}
                    {recordedChunks.length > 0 && (
                      <CSVLink data={recordedInterest} filename={"results_interest.csv"} separator={","}><Button color="primary" variant="contained" style={{ height: "56px", marginLeft: "20px" }} onClick={handleDownload}>Download</Button></CSVLink>
                    )}
              </Grid>
           </Grid>
           <Grid item xs={8}>
             <Typography id="discrete-slider-always" gutterBottom>
               Current level of interest
             </Typography>
             <Slider
               onChange={ (e, value) => val = value}
               onChangeCommitted={ (e, value) => handleInterestSlider(val)}
               defaultValue={0}
               // getAriaValueText={"Interest"}
               aria-labelledby="discrete-slider-always"
               min={-5}
               max={+5}
               step={1}
               valueLabelDisplay="on"
             />
           </Grid>
        </Grid>


      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
        <WebcamCapture />
    </React.Fragment>
  )

};

export default Detection;


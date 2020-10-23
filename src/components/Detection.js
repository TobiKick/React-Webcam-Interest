import React, { useState, useEffect } from "react";

import { Typography, Button, TextField, Slider, Grid } from "@material-ui/core";
import { sizing } from '@material-ui/system';

import * as cocoSsd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import Prediction from "./Prediction";
import {CSVLink} from 'react-csv';


function Detection () {
  var val = 0

  const videoConstraints = {
    width: 250,
    height: 250,
    facingMode: "user"
  };

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

    }, [mediaRecorderRef, setCapturing]);

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
    }, [recordedChunks]);


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
            <iframe title="Experiment Video" width="560" height="315" src="https://www.youtube.com/embed/KD_zVo2wUMo?controls=0&amp;start=527" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </Grid>
          <Grid item xs={3}>
              <Grid item xs={12}>
                <Webcam audio={false} ref={webcamRef} height="80%" width="80%" videoConstraints={videoConstraints}/>
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


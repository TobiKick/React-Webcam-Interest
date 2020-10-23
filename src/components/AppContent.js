import React, { useState, useEffect } from "react";
import { Typography, Button, Slider, Grid } from "@material-ui/core";
import Webcam from "react-webcam";
import {CSVLink} from 'react-csv';
import YouTube from "react-youtube";

/*import * as cocoSsd from "@tensorflow-models/coco-ssd";
import YoutubeContainer from "./YoutubeContainer";
import Prediction from "./Prediction"; */
var cElement = null;

function Video (props) {
  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      controls: 0,
      disablekb: 1
    }
  };

  useEffect(() => {
    if (cElement) {
      console.log("isPaused: " + props.isPaused)
      props.isPaused
        ? cElement.target.pauseVideo()
        : cElement.target.playVideo();
    }
  }, [props.isPaused]);

  const _onReady = event => {
    console.log("_onReady");
    cElement = event;
    // event.target.playVideo();
  };

  return (
    <YouTube
      videoId={"Yq79ibIx2sc"}
      opts={opts}
      onReady={_onReady}
    />
  );
}

function AppContent () {
    const webcamRef = React.useRef(null);
    const mediaRecorderRef = React.useRef(null);
    const [recordedChunks, setRecordedChunks] = React.useState([]);
    const [recordedInterest, setRecordedInterest] = React.useState("");
    const [isPaused, setIsPaused] = useState(true);
    const [capturing, setCapturing] = React.useState(false);

    var val = 0
    const videoConstraints = {
        width: 250,
        height: 250,
        facingMode: "user"
    };

    const handleDataAvailable = React.useCallback(
      ({ data }) => {
        if (data.size > 0) {
          setRecordedChunks((prev) => prev.concat(data));
        }
      },
      [setRecordedChunks]
    );

    const handleStartCaptureClick = React.useCallback(() => {
      setCapturing(true);
      setIsPaused(false);
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: "video/webm"
      });
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current.start();
    }, [webcamRef, setCapturing, setIsPaused, mediaRecorderRef, handleDataAvailable]);

    const handleStopCaptureClick = React.useCallback(() => {
      mediaRecorderRef.current.stop();
      setCapturing(false);
      setIsPaused(true);
    }, [mediaRecorderRef, setCapturing, setIsPaused]);

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
        setRecordedInterest((prev) => prev.concat((value.toString()) + ","))
        console.log(recordedInterest)
    }, [recordedInterest]);


    return (
      <React.Fragment>
        <Grid container spacing={3} justify="center">
          <Grid item xs={9}>
            <Video isPaused={isPaused}/>
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



export default AppContent;


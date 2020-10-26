import React, { useState } from "react";
import { Typography, Button, Slider, Grid } from "@material-ui/core";
import Webcam from "react-webcam";
import {CSVLink} from 'react-csv';


/*import * as cocoSsd from "@tensorflow-models/coco-ssd";
import YoutubeContainer from "./YoutubeContainer";
import Prediction from "./Prediction"; */

import Video from "./Video";

function AppContent () {
    const webcamRef = React.useRef(null);
    const mediaRecorderRef = React.useRef(null);
    const [recordedChunks, setRecordedChunks] = React.useState([]);
    const [recordedInterest, setRecordedInterest] = React.useState("");
    const [isPaused, setIsPaused] = useState(true);
    const [isRestarted, setIsRestarted] = useState(false);
    const [capturing, setCapturing] = React.useState(false);
    const playerRef = React.createRef();

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
      setIsRestarted(false);

    }, [webcamRef, setCapturing, setIsPaused, mediaRecorderRef, handleDataAvailable, setIsRestarted]);

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
      }
    }, [recordedChunks]);

    async function getCurrentPlayerTime(value){
        var ctime = await playerRef.current.getInternalPlayer().getCurrentTime()
        setRecordedInterest((prev) => prev.concat((value.toString()) + ", " + ctime.toString() + "\n"));
    }

    const handleInterestSlider = React.useCallback((value) => {
        if(capturing){
            getCurrentPlayerTime(value);
            console.log(recordedInterest);
        }else{
            console.log("Not recording!");
            console.log(recordedInterest);
        }
    }, [setRecordedInterest, recordedInterest, capturing, getCurrentPlayerTime]);

    const handleRestartCaptureClick = React.useCallback((value) => {
        console.log("Restart");
        setIsRestarted(true);
        setRecordedChunks([]);

    }, [setRecordedChunks, setIsRestarted]);

    return (
      <React.Fragment>
        <Grid container spacing={3} justify="center" alignItems="flex-start">
          <Grid item xs={9}>
            <div style={{pointerEvents: "none"}}><Video ref={playerRef} isPaused={isPaused} isRestarted={isRestarted} setCapturing={setCapturing}/></div>
          </Grid>
          <Grid item xs={3}>
              <Grid container justify="center" alignItems="center">
                <Webcam audio={false} ref={webcamRef} height="80%" width="80%" videoConstraints={videoConstraints}/>
              </Grid>
              <br/>
              <Grid container justify="center" alignItems="center">

                {capturing === true ? (
                      <Button color="primary" variant="contained" style={{ height: "56px", marginLeft: "20px" }} onClick={handleStopCaptureClick}>Pause Capture</Button>
                    ) : recordedChunks.length > 0 ? (
                        <Grid container direction="column" justify="center" alignItems="center" spacing={1}>
                            <Grid item><Button color="primary" variant="contained" style={{ height: "56px", marginLeft: "20px" }} onClick={handleStartCaptureClick}>Resume Capture</Button>
                            </Grid><Grid item><CSVLink data={recordedInterest} filename={"results_interest.csv"} separator={","}><Button color="primary" variant="contained" style={{ height: "56px", marginLeft: "20px" }} onClick={handleDownload}>Download results</Button></CSVLink>
                            </Grid><Grid item><Button color="secondary" variant="contained" style={{ height: "56px", marginLeft: "20px" }} onClick={handleRestartCaptureClick}>Restart experiment</Button>
                            </Grid>
                        </Grid>
                    ) : (
                        <Button color="primary" variant="contained" style={{ height: "56px", marginLeft: "20px" }} onClick={handleStartCaptureClick}>Start Capture</Button>
                    )}
              </Grid>
           </Grid>
           <Grid item xs={5}>
           <br />
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
               marks={[
                        {
                          value: -5,
                          label: 'very uninteresting',
                        },
                        {
                          value: 0,
                          label: 'neutral'
                        },
                        {
                          value: +5,
                          label: 'very interesting',
                        }
                      ]}
               valueLabelDisplay="on"
             />
           </Grid>
        </Grid>
      </React.Fragment>
    );
  };



export default AppContent;

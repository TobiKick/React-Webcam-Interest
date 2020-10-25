import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";


var cElement = null;

const Video = (props, ref) => {
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

      if (props.isRestarted){
        cElement.target.seekTo(0)
      }
    }
  }, [props.isPaused, props.isRestarted]);

  const _onReady = event => {
    console.log("_onReady");
    cElement = event;
    cElement.target.seekTo(0);
    cElement.target.pauseVideo();
  };

  const _onEnd = event => {
    console.log("_onEnd");
    event.target.pauseVideo();
    props.setCapturing(false);
  }

  return (
    <YouTube
      ref={ref}
      videoId={"Yq79ibIx2sc"}
      opts={opts}
      onReady={_onReady}
      onEnd={_onEnd}
    />
  );
}

const forwardedRef = React.forwardRef(Video);
export default forwardedRef;


/*
player.nextVideo()

player.loadPlaylist({list:String,
                     listType:String,
                     index:Number,
                     startSeconds:Number}):Void
*/
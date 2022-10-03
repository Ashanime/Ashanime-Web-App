import React, { useEffect, useRef, useState } from "react";
import MoonLoader from "react-spinners/MoonLoader";
import {
  Player,
  Hls,
  Video,
  SettingsControl,
  Controls,
  DefaultUi,
  PlaybackControl,
  Control,
  Scrim,
  ScrubberControl,
  ControlSpacer,
  VolumeControl,
  FullscreenControl,
  CurrentTime,
  EndTime,
  ControlGroup,
  TimeProgress,
  PipControl,
  CaptionControl,
  Tooltip,
} from "@vime/react";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/solid";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import axios from "axios";
import {
  setSavedCurrentTime,
  setVideoLink,
} from "../../redux/videoState-slice";
import useWindowResize from "../../hooks/useWindowResize";

interface props {
  animeStatus?: string;
}

const VideoPlayer = (props: props) => {
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(false);

  const dispatch = useDispatch();

  const videoLink = useSelector(
    (state: RootState) => state.videoState.videoLink
  );
  const streamId = useSelector((state: RootState) => state.anime.streamId);

  const currentTime = useSelector(
    (state: RootState) => state.videoState.savedCurrentTime
  );

  const modalData = useSelector((state: RootState) => state.anime);

  const { windowDimension } = useWindowResize();
  const { winWidth } = windowDimension;

  const isMobile = () => {
    if (winWidth < 768) {
      return true;
    }
    if (winWidth >= 768) {
      return false;
    }
  };

  const videoplayer = useRef<HTMLVmPlayerElement>(null);

  // Workaround for keyboard shortcuts not working
  useEffect(() => {
    // focus on videoplayer by default
    if (videoplayer.current) {
      videoplayer.current.focus();

      // prevent default actions
      videoplayer.current.addEventListener("keydown", (e) => {
        e.preventDefault();
      });

      // Refocus on the videoplayer on fullscreen change
      videoplayer.current.onfullscreenchange = () => {
        if (videoplayer.current) {
          videoplayer.current.focus();
        }
      };

      // Enable fullscreen keyboard shortcuts in fullscreen
      document.addEventListener("keydown", (e) => {
        if (
          videoplayer.current?.isFullscreenActive &&
          e.target !== videoplayer.current
        ) {
          // Create a new keyboard event
          const keyboardEvent = new KeyboardEvent("keydown", {
            key: e.key,
            code: e.code,
            shiftKey: e.shiftKey,
            ctrlKey: e.ctrlKey,
            metaKey: e.metaKey,
          });

          // dispatch it to the videoplayer
          videoplayer.current.dispatchEvent(keyboardEvent);
        }
      });
    }
  }, [videoplayer, winWidth, modalData, videoLink, loading]);

  const onTimeUpdate = (event: CustomEvent<number>) => {
    dispatch(setSavedCurrentTime(event.detail));
  };

  const hlsConfig = {
    crossOrigin: "anonymous",
    enableWorker: false,
  };

  const getEpisodeStream = async () => {
    setLoading(true);
    await axios
      .get(`https://consumet-api.herokuapp.com/meta/anilist/watch/${streamId}`)
      .then((response) => {
        const { data } = response;
        dispatch(setVideoLink(data.sources[data.sources.length - 2].url));
        setLoading(false);
      })
      .catch((error) => {
        if (error) {
          console.log(error.response);
        }
        return;
      });
  };

  // if the user taps his phone screen, toggle hidden on the videoplayer

  useEffect(() => {
    const getData = async () => {
      await getEpisodeStream();
    };
    if (typeof streamId === "string" && streamId.length > 0) {
      getData();
    }
  }, [streamId]);

  useEffect(() => {
    return () => {
      dispatch(setVideoLink(""));
    };
  }, []);

  return (
    <div className="relative flex justify-center items-center w-full h-full bg-black">
      {loading ? (
        <div className="flex justify-center items-center w-full md:h-[20rem] h-[14rem]">
          <div className="sweet-loading">
            <MoonLoader color={"white"} loading={loading} size={60} />
          </div>
        </div>
      ) : (
        (!videoLink && (
          <div className="flex justify-center items-center w-full md:h-[20rem] h-[14rem]">
            <span className="text-white outfit-medium flex justify-start items-center h-full ">
              {/*if no video URL then display below message and if animeStatus is upcoming say that it is upcoming */}
              {props.animeStatus === "Upcoming"
                ? "This anime is yet to be released."
                : "Select an episode to watch!"}
            </span>
          </div>
        )) || (
          <div className="w-full">
            <Player
              currentTime={currentTime}
              onVmCurrentTimeChange={onTimeUpdate}
              ref={videoplayer}
              tabIndex={0}
            >
              {videoLink && videoLink.includes("m3u8") ? (
                <Hls version="latest" config={hlsConfig}>
                  <source data-src={videoLink} type="application/x-mpegURL" />
                </Hls>
              ) : (
                <Video>
                  <source data-src={videoLink} type="video/mp4" />
                </Video>
              )}
              <DefaultUi noControls>
                {/*Center Controls for play/pause and changing episode */}
                <Controls
                  align="center"
                  pin="center"
                  justify="space-evenly"
                  hideOnMouseLeave={true}
                  activeDuration={1000}
                >
                  <Control
                    onClick={() =>
                      dispatch(setSavedCurrentTime(currentTime - 15))
                    }
                    keys="p"
                    label="Rewind 15 seconds"
                  >
                    <ChevronDoubleLeftIcon className="w-9 text-white" />
                    <Tooltip>Rewind 15 seconds</Tooltip>
                  </Control>

                  <PlaybackControl hideTooltip keys="k/" />

                  <Control
                    onClick={() =>
                      // skip 15 seconds
                      dispatch(setSavedCurrentTime(currentTime + 15))
                    }
                    // }
                    keys="n"
                    label="Forward 15 seconds"
                  >
                    <ChevronDoubleRightIcon className="w-9 text-white" />
                    <Tooltip className="text-xs">Forward 15 seconds</Tooltip>
                  </Control>
                </Controls>

                {/* Default Controls */}
                <Scrim gradient="up" />

                {isMobile() && (
                  <Controls activeDuration={1000} pin="topLeft">
                    <ControlSpacer />
                    <VolumeControl />
                    <SettingsControl />
                  </Controls>
                )}

                <Controls
                  pin="bottomLeft"
                  direction={"column"}
                  activeDuration={1000}
                >
                  <ControlGroup>
                    <ScrubberControl />
                  </ControlGroup>
                  <ControlGroup space={isMobile() ? "none" : "top"}>
                    {!isMobile() && (
                      <>
                        <PlaybackControl keys="k/ " tooltipDirection="right" />
                        <VolumeControl />
                      </>
                    )}

                    {!isMobile() ? (
                      <>
                        <TimeProgress />
                        <ControlSpacer />
                      </>
                    ) : (
                      <>
                        <CurrentTime />
                        <ControlSpacer />
                        <EndTime />
                      </>
                    )}

                    {!isMobile() && (
                      <>
                        <CaptionControl />
                        <PipControl keys="i" />
                        <SettingsControl />
                      </>
                    )}
                    <FullscreenControl tooltipDirection="left" />
                  </ControlGroup>
                </Controls>
              </DefaultUi>
            </Player>
          </div>
        )
      )}
    </div>
  );
};

export default VideoPlayer;

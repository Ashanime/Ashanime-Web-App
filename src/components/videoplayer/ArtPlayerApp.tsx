import React, { useEffect, useState } from "react";
import Artplayer from "./ArtPlayer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import MoonLoader from "react-spinners/MoonLoader";
import axios from "axios";
import {
  setStreamEpisodeLinkObject,
  setVideoLink,
} from "../../redux/videoState-slice";
import useWindowResize from "../../hooks/useWindowResize";
import Hls from "hls.js";
// @ts-ignore
import subtitleIcon from "../../assets/subtitle.svg";

interface props {
  animeStatus?: string;
}

const ArtPlayer = (props: props) => {
  const [loading, setLoading] = useState(false);
  const [episodeObject, setEpisodeObject] = useState({
    intro: {
      start: 0,
      end: 0,
    },
    sources: [],
    subtitles: [],
  });

  const dispatch = useDispatch();

  const videoLink = useSelector(
    (state: RootState) => state.videoState.videoLink
  );
  const streamEpisode = useSelector(
    (state: RootState) => state.anime.streamEpisode
  );
  const provider = useSelector(
    (state: RootState) => state.videoState.streamProvider
  );
  const modalData = useSelector((state: RootState) => state.anime.modalData);

  const { windowDimension } = useWindowResize();
  const { winWidth } = windowDimension;

  const getEpisodeStream = async () => {
    setLoading(true);
    await axios
      .get(`https://api.consumet.org/meta/anilist/watch/${streamEpisode.id}`, {
        params: {
          ...(provider && { provider }),
        },
      })
      .then((response) => {
        const { data } = response;
        setEpisodeObject(data);
        dispatch(setStreamEpisodeLinkObject(data));
        dispatch(setVideoLink(data.sources[0].url));
        setLoading(false);
      })
      .catch((error) => {
        if (error) {
          console.log(error.response);
        }
        return;
      });
  };

  useEffect(() => {
    const getData = async () => {
      await getEpisodeStream();
    };
    if (typeof streamEpisode.id === "string" && streamEpisode.id.length > 0) {
      getData();
    }
    handleSubtitles();
  }, [streamEpisode, provider]);

  useEffect(() => {
    return () => {
      dispatch(setVideoLink(""));
    };
  }, []);

  // const handleVideoLink = (quality: string) => {
  //   episodeObject.sources.forEach((source: any) => {
  //     if (source.quality === quality) {
  //       dispatch(setVideoLink(source.url));
  //       return source.url;
  //     }
  //   });
  // };

  const handleVideoLink = () => {
    console.log(videoLink);
    return videoLink;
  };

  const handleEnglishSubtitle = () => {
    if (episodeObject.subtitles) {
      // find english subtitle
      const englishSubtitle = episodeObject.subtitles.find(
        (subtitle: any) => subtitle.lang === "English"
      );
      if (englishSubtitle) {
        //@ts-ignore
        return englishSubtitle?.url;
      }
    }
    return "";
  };

  const handleSubtitles = () => {
    if (episodeObject.subtitles) {
      return episodeObject.subtitles.map((subtitle: any) => {
        return {
          html: subtitle.lang,
          url: subtitle.url,
        };
      });
    }
  };

  const handleSubtitlePresentation = () => {
    if (episodeObject.subtitles) {
      return episodeObject.subtitles.map((subtitle: any) => {
        return {
          subtitle: {
            url: subtitle.url,
            type: "vtt",
            style: {
              color: "#fff",
              fontSize: "3em",
              marginBottom: "2rem",
            },
            encoding: "utf-8",
          },
        };
      });
    }
  };

  const handleSubtitleIcon = () => {
    return <img src={subtitleIcon} />;
  };

  // loop over episodeObject.sources and create an array of objects with the url and the video quality
  const handleVideoQualities = () => {
    return episodeObject.sources.map((source: any) => {
      if (source.quality === "1080p") {
        return {
          default: true,
          url: source.url,
          html: source.quality,
        };
      } else
        return {
          url: source.url,
          html: source.quality,
        };
    });
  };

  const handleFontSize = () => {
    if (winWidth < 1024) {
      return "1.5rem";
    }
    return "4rem";
  };

  const handleTimeStamps = () => {
    if (episodeObject.intro) {
      return {
        highlight: [
          {
            time: episodeObject.intro.start,
            text: "OP start",
          },
          {
            time: episodeObject.intro.end,
            text: "OP end",
          },
        ],
      };
    }
  };

  return (
    <div className="relative flex justify-center items-end w-full h-full  bg-black">
      {loading ? (
        <div className="flex justify-center items-center w-full h-full">
          <div className="sweet-loading">
            <MoonLoader color={"white"} loading={loading} size={60} />
          </div>
        </div>
      ) : (
        (!videoLink && (
          <div className="flex justify-center items-center w-full md:h-[25rem] h-[19rem]">
            <span className="text-white outfit-medium flex justify-start items-center h-full ">
              {/*if no video URL then display below message and if animeStatus is upcoming say that it is upcoming */}
              {props.animeStatus === "Upcoming"
                ? "This anime is yet to be released."
                : "Select an episode to watch!"}
            </span>
          </div>
        )) || (
          <div className="w-full h-full">
            <Artplayer
              option={{
                url: videoLink,
                customType: {
                  m3u8: function (video: HTMLMediaElement, url: string) {
                    if (Hls.isSupported()) {
                      const hls = new Hls();
                      hls.loadSource(url);
                      hls.attachMedia(video);
                    } else {
                      const canPlay = video.canPlayType(
                        "application/vnd.apple.mpegurl"
                      );
                      if (canPlay === "probably" || canPlay === "maybe") {
                        video.src = url;
                      }
                    }
                  },
                },
                autoSize: false,
                title: modalData.title.romaji,
                volume: 0.5,
                isLive: false,
                muted: false,
                autoplay: false,
                pip: true,
                autoMini: true,
                screenshot: true,
                setting: true,
                loop: true,
                flip: true,
                playbackRate: true,
                aspectRatio: true,
                fullscreen: true,
                fullscreenWeb: false,
                subtitleOffset: true,
                miniProgressBar: true,
                mutex: true,
                backdrop: true,
                playsInline: true,
                autoPlayback: true,
                airplay: true,
                theme: "#FC4747",
                lang: navigator.language.toLowerCase(),
                whitelist: ["*"],
                moreVideoAttr: {
                  crossOrigin: "anonymous",
                },
                settings: [
                  {
                    width: 200,
                    html: "Subtitle",
                    tooltip: "English",
                    icon: handleSubtitleIcon(),
                    selector: [
                      // {
                      //   html: "Display",
                      //   tooltip: "Show",
                      //   switch: true,
                      // },
                      // handleSubtitles(),
                      {
                        html: "English",
                        url: handleEnglishSubtitle(),
                      },
                    ],
                  },
                  // {
                  //   html: "Switcher",
                  //   icon: '<img width="22" heigth="22" src="/assets/img/state.svg">',
                  //   tooltip: "OFF",
                  //   switch: false,
                  //   onSwitch: function (item: any) {
                  //     item.tooltip = item.switch ? "OFF" : "ON";
                  //     console.info(
                  //       "You clicked on the custom switch",
                  //       item.switch
                  //     );
                  //     return !item.switch;
                  //   },
                  // },
                  // {
                  //   html: "Slider",
                  //   icon: '<img width="22" heigth="22" src="/assets/img/state.svg">',
                  //   tooltip: "5x",
                  //   // range: [5, 1, 10, 0.1],
                  //   onRange: function (item: any) {
                  //     return item.range + "x";
                  //   },
                  // },
                ],
                // contextmenu: [
                //   {
                //     html: "Custom menu",
                //     click: function (contextmenu: any) {
                //       console.info("You clicked on the custom menu");
                //       contextmenu.show = false;
                //     },
                //   },
                // ],

                quality: [handleVideoQualities()],
                thumbnails: {
                  url: "",
                  number: 60,
                  column: 10,
                },
                subtitle: {
                  url: handleEnglishSubtitle(),
                  type: "tts",
                  style: {
                    color: "#fff",
                    fontSize: handleFontSize(),
                    marginBottom: "2rem",
                  },
                  encoding: "utf-8",
                },
                icons: {
                  state: "",
                },
                handleTimeStamps,
                controls: [
                  // {
                  //   position: "right",
                  //   html: "Control",
                  //   tooltip: "Control Tooltip",
                  //   click: function () {
                  //     console.info("You clicked on the custom control");
                  //   },
                  // },
                ],
              }}
            />
          </div>
        )
      )}
    </div>
  );
};

export default ArtPlayer;

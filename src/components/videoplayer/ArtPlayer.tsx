import React, { useEffect, useRef, useState } from "react";
import Artplayer from "artplayer";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Hls from "hls.js";
import useWindowResize from "../../hooks/useWindowResize";
import { onValue, ref, set } from "firebase/database";
import { db } from "../../firebase/Firebase";
import { Buffer } from "buffer";

export default function Player({ option, getInstance }: any) {
  const [selectedSubtitle, setSelectedSubtitle] = useState("English");
  const artRef = useRef(null);
  const streamEpisodeLinkObject = useSelector(
    (state: RootState) => state.videoState.streamEpisodeLinkObject
  );
  const streamEpisodeObject = useSelector(
    (state: RootState) => state.videoState.streamEpisodeObject
  );
  const modalData = useSelector((state: RootState) => state.anime.modalData);
  const videoLink = useSelector(
    (state: RootState) => state.videoState.videoLink
  );

  const provider = useSelector(
    (state: RootState) => state.videoState.streamProvider
  );
  const uid = useSelector((state: any) => state.google.profileObject?.uid);

  const encodeBase64 = (data: string) => {
    if (!data) return "undefined";
    return Buffer.from(data).toString("base64");
  };

  const currentAnimeTitle = useSelector(
    (state: any) => state.anime.modalData.title.romaji
  );

  const currentAnimeTitleB64 = encodeBase64(currentAnimeTitle) as string;

  const { windowDimension } = useWindowResize();
  const { winWidth } = windowDimension;

  const showAndEpisodeName = `${modalData?.title.romaji} - ${streamEpisodeObject?.title}`;

  const handleSubtitleIcon = () => {
    return (
      <svg
        width="16"
        height="16"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
      >
        <path
          fill="white"
          d="M0 96C0 60.7 28.7 32 64 32H512c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM200 208c14.2 0 27 6.1 35.8 16c8.8 9.9 24 10.7 33.9 1.9s10.7-24 1.9-33.9c-17.5-19.6-43.1-32-71.5-32c-53 0-96 43-96 96s43 96 96 96c28.4 0 54-12.4 71.5-32c8.8-9.9 8-25-1.9-33.9s-25-8-33.9 1.9c-8.8 9.9-21.6 16-35.8 16c-26.5 0-48-21.5-48-48s21.5-48 48-48zm144 48c0-26.5 21.5-48 48-48c14.2 0 27 6.1 35.8 16c8.8 9.9 24 10.7 33.9 1.9s10.7-24 1.9-33.9c-17.5-19.6-43.1-32-71.5-32c-53 0-96 43-96 96s43 96 96 96c28.4 0 54-12.4 71.5-32c8.8-9.9 8-25-1.9-33.9s-25-8-33.9 1.9c-8.8 9.9-21.6 16-35.8 16c-26.5 0-48-21.5-48-48z"
        />
      </svg>
    );
  };

  // loop over episodeObject.sources and create an array of objects with the url and the video quality
  const handleVideoQualities = () => {
    return streamEpisodeLinkObject.sources.map((source: any) => {
      if (source.quality === "backup") {
        return {
          default: true,
          url: source.url,
          html: source.quality,
        };
      } else {
        if (source.quality)
          return {
            url: source.url,
            html: source.quality,
          };
        else
          return {
            url: source.url,
            html: "Adaptive",
          };
      }
    });
  };

  const handleFontSize = () => {
    if (winWidth <= 900) {
      return "2rem";
    }
    if (winWidth < 1024) {
      return "1.5rem";
    }
    return "3rem";
  };

  const handleTimeStamps = () => {
    if (streamEpisodeLinkObject.intro) {
      return {
        highlight: [
          {
            time: streamEpisodeLinkObject.intro.start,
            text: "OP start",
          },
          {
            time: streamEpisodeLinkObject.intro.end,
            text: "OP end",
          },
        ],
      };
    }
  };

  useEffect(() => {
    let subtitles: any = [];
    let sIndex = 0;

    if (provider === "zoro" || provider === "crunchyroll") {
      subtitles.push({
        html: "Show Subs",
        icon: "",
        switch: true,
        onSwitch: function (item: any) {
          art.subtitle.show = !item.switch;
          return !item.switch;
        },
      });
      for (let i = 0; i < streamEpisodeLinkObject.subtitles?.length; i++) {
        if (
          streamEpisodeLinkObject.subtitles[i].lang === "English" ||
          streamEpisodeLinkObject.subtitles[i].lang === "[en-US] English"
        ) {
          sIndex = i;
          subtitles.push({
            default: true,
            url: streamEpisodeLinkObject.subtitles[i].url,
            html: streamEpisodeLinkObject.subtitles[i].lang,
          });

          selectEnglish(subtitles[i]);
        } else if (streamEpisodeLinkObject.subtitles[i].lang === "Thumbnails") {
          // do nothing
        } else {
          subtitles.push({
            url: streamEpisodeLinkObject.subtitles[i].url,
            html: streamEpisodeLinkObject.subtitles[i].lang,
          });
        }
      }
    } else {
      subtitles.push({
        html: "English",
        default: true,
      });
    }

    const art = new Artplayer({
      ...option,
      layers: [
        {
          name: "intro",
          html: "SKIP OPENING",
          click: function () {
            art.seek = streamEpisodeLinkObject.intro.end;
          },
          style: {
            position: "absolute",
            bottom: "60px",
            right: "20px",
            opacity: "1.0",
            padding: "12px 20px",
            borderRadius: "8px",
            backgroundColor: "#FC4747",
            color: "white",
            fontWeight: "bold",
            zIndex: 100,
            transition: "0.3s all ease",
            display: "none",
          },
        },
        {
          name: "title",
          html: showAndEpisodeName,
          style: {
            position: "absolute",
            top: "50px",
            left: "10px",
            justifySelf: "center",
            alignSelf: "center",
            opacity: "1.0",
            padding: "12px 20px",
            borderRadius: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            fontWeight: "bold",
            zIndex: 100,
            transition: "0.3s all ease",
          },
        },
      ],
      container: artRef.current,

      url: videoLink,
      customType: {
        m3u8: function (video: HTMLMediaElement, url: string) {
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
          } else {
            const canPlay = video.canPlayType("application/vnd.apple.mpegurl");
            if (canPlay === "probably" || canPlay === "maybe") {
              video.src = url;
            }
          }
        },
      },
      autoSize: false,
      autoOrientation: true,
      title: modalData.title.romaji,
      volume: 0.5,
      isLive: false,
      muted: false,
      autoplay: false,
      pip: true,
      autoMini: true,
      screenshot: true,
      setting: true,
      loop: false,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: false,
      subtitleOffset: true,
      miniProgressBar: false,
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
          width: 300,
          html: "Subtitles",
          name: "Subs",
          tooltip: selectedSubtitle ? selectedSubtitle : "English",
          icon: handleSubtitleIcon(),
          selector: subtitles,
          onSelect: function (item: any) {
            art.subtitle.switch(item.url, {
              //@ts-ignore
              name: item.html,
            });
            setSelectedSubtitle(item.html);
            return item.html;
          },
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
        url: streamEpisodeLinkObject.subtitles
          ? streamEpisodeLinkObject.subtitles[sIndex].url
          : "",
        type: "vtt",
        encoding: "utf-8",
        style: {
          position: "absolute",
          transition: "0.3s all ease",
          bottom: "70px",
          color: "#ffffff",
          "font-size": handleFontSize(),
          "text-shadow":
            "rgb(0, 0, 0) 4px 0px 0px, rgb(0, 0, 0) 3.87565px 0.989616px 0px, rgb(0, 0, 0) 3.51033px 1.9177px 0px, rgb(0, 0, 0) 2.92676px 2.72656px 0px, rgb(0, 0, 0) 2.16121px 3.36588px 0px, rgb(0, 0, 0) 1.26129px 3.79594px 0px, rgb(0, 0, 0) 0.282949px 3.98998px 0px, rgb(0, 0, 0) -0.712984px 3.93594px 0px, rgb(0, 0, 0) -1.66459px 3.63719px 0px, rgb(0, 0, 0) -2.51269px 3.11229px 0px, rgb(0, 0, 0) -3.20457px 2.39389px 0px, rgb(0, 0, 0) -3.69721px 1.52664px 0px, rgb(0, 0, 0) -3.95997px 0.56448px 0px, rgb(0, 0, 0) -3.97652px -0.432781px 0px, rgb(0, 0, 0) -3.74583px -1.40313px 0px, rgb(0, 0, 0) -3.28224px -2.28625px 0px, rgb(0, 0, 0) -2.61457px -3.02721px 0px, rgb(0, 0, 0) -1.78435px -3.57996px 0px, rgb(0, 0, 0) -0.843183px -3.91012px 0px, rgb(0, 0, 0) 0.150409px -3.99717px 0px, rgb(0, 0, 0) 1.13465px -3.8357px 0px, rgb(0, 0, 0) 2.04834px -3.43574px 0px, rgb(0, 0, 0) 2.83468px -2.82216px 0px, rgb(0, 0, 0) 3.44477px -2.03312px 0px, rgb(0, 0, 0) 3.84068px -1.11766px 0px, rgb(0, 0, 0) 3.9978px -0.132717px 0px",
        },
      },
      icons: {
        state: "",
      },
      handleTimeStamps,
    });

    art.on("subtitleUpdate", (text: string) => {
      //art.template.$subtitle.innerHTML.replaceAll('<p>', '').replaceAll('</p>', ' ').replaceAll('&lt;i&gt;', '<i>').replaceAll('&lt;/i&gt;', '</i>').replaceAll('&lt;b&gt;', '<b>').replaceAll('&lt;/b&gt;', '</b>')
      art.template.$subtitle.innerHTML = text
        .replaceAll("<p>", "")
        .replaceAll("</p>", " ")
        .replaceAll("&lt;i&gt;", "<i>")
        .replaceAll("&lt;/i&gt;", "</i>")
        .replaceAll("&lt;b&gt;", "<b>")
        .replaceAll("&lt;/b&gt;", "</b>");
    });

    if (getInstance && typeof getInstance === "function") {
      getInstance(art);
    }

    // Make the skip intro button show between start and end of intro
    art.on("video:timeupdate", () => {
      art.layers.intro.style.display =
        art.currentTime >= streamEpisodeLinkObject.intro?.start &&
        art.currentTime <= streamEpisodeLinkObject.intro?.end
          ? "block"
          : "none";
    });

    if (provider === "zoro") {
      subtitles = [];
      subtitles.push({
        html: "Show Subs",
        icon: "",
        switch: true,
        onSwitch: function (item: any) {
          art.subtitle.show = !item.switch;
          return !item.switch;
        },
      });
      for (let i = 0; i < streamEpisodeLinkObject.subtitles?.length; i++) {
        if (streamEpisodeLinkObject.subtitles[i].lang === "English") {
          sIndex = i;
          subtitles.push({
            default: true,
            url: streamEpisodeLinkObject.subtitles[i].url,
            html: streamEpisodeLinkObject.subtitles[i].lang,
          });
          const selectEnglish = function (item: any) {
            if (item.html === "English") {
              //@ts-ignore
              art.subtitle.switch(item.url, {
                //@ts-ignore
                name: item.html,
              });
              return item.html;
            }
          };
          selectEnglish(subtitles[i]);
        } else if (streamEpisodeLinkObject.subtitles[i].lang === "Thumbnails") {
          // do nothing
        } else {
          subtitles.push({
            url: streamEpisodeLinkObject.subtitles[i].url,
            html: streamEpisodeLinkObject.subtitles[i].lang,
          });
        }
      }
    } else {
      subtitles = [];
      subtitles.push({
        html: "English",
        default: true,
      });
    }

    streamEpisodeLinkObject.sources.map((source: any) => {
      if (source.quality === "backup") {
        art.switchQuality(source.url);
      }
    });

    // fetch the episode current time from firebase realtime database
    const readEpisodeWatchTime = () => {
      onValue(
        ref(
          db,
          `users/${uid}/episodeWatchTime/${currentAnimeTitleB64}/${streamEpisodeObject.number}`
        ),
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            art.currentTime = data.episodeCurrentTime;
          }
        }
      );
    };

    // make the intro skip button only appear when video starts playing from 0
    art.on("ready", async () => {
      art.layers.intro.style.display = "none";
      const selectEnglish = function (item: any) {
        if (item.html === "English") {
          //@ts-ignore
          art.subtitle?.switch(item.url, {
            //@ts-ignore
            name: item.html,
          });
          return item.html;
        }
      };
      for (let i = 0; i < subtitles?.length; i++) {
        if (subtitles[i].html === "English") {
          selectEnglish(subtitles[i]);
        }
      }
      readEpisodeWatchTime();
      console.log(art.currentTime);
    });

    const writeEpisodeWatchTime = (currentTime: number) => {
      set(
        ref(
          db,
          `users/${uid}/episodeWatchTime/${currentAnimeTitleB64}/${streamEpisodeObject.number}`
        ),
        {
          episodeCurrentTime: currentTime,
        }
      );
    };

    art.on("pause", () => {
      // sync to firebase the current time of the video
      writeEpisodeWatchTime(art.currentTime);
    });

    art.on("ready", () => {
      art.seek = 300;
    });

    // art.on("fullscreen", () => {
    //   // change phone screen orientation to landscape if screen width is less than 1024px
    //   if (window.innerWidth < 1024) {
    //     // eslint-disable-next-line no-restricted-globals
    //     screen.orientation.lock("landscape");
    //   }
    // });

    function selectEnglish(item: any) {
      if (item.html === "English") {
        art.subtitle.switch(item.url, {
          name: item.html,
        });
        return item.html;
      }
    }

    art.on("pause", () => {
      art.layers.title.style.display = "block";
    });

    art.on("play", () => {
      art.layers.title.style.display = "none";
    });

    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="relative flex justify-center items-center w-full h-full"
      ref={artRef}
    ></div>
  );
}

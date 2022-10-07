import { useEffect, useRef, useState } from "react";
import Artplayer from "artplayer";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function Player({ option, getInstance }: any) {
  const artRef = useRef(null);
  const streamEpisodeLinkObject = useSelector(
    (state: RootState) => state.videoState.streamEpisodeLinkObject
  );
  const streamEpisode = useSelector(
    (state: RootState) => state.anime.streamEpisode
  );

  useEffect(() => {
    const art = new Artplayer({
      ...option,
      onSwitch: function (item: any) {
        item.tooltip = item.switch ? "Hide" : "Show";
        art.subtitle.show = !item.switch;
        return !item.switch;
      },
      onSelect: function (item: any) {
        art.subtitle.switch(item.url, {
          //@ts-ignore
          name: item.html,
        });
        return item.html;
      },
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
          },
        },
        // {
        //   name: "title",
        //   html: streamEpisode && streamEpisode.title,
        //   style: {
        //     position: "absolute",
        //     top: "20px",
        //     justifySelf: "center",
        //     alignSelf: "center",
        //     opacity: "1.0",
        //     padding: "12px 20px",
        //     borderRadius: "8px",
        //     backgroundColor: "#FC4747",
        //     color: "white",
        //     fontWeight: "bold",
        //     zIndex: 100,
        //     transition: "0.3s all ease",
        //   },
        // },
      ],
      container: artRef.current,
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

    // make the intro skip button only appear when video starts playing from 0
    art.on("ready", async () => {
      art.layers.intro.style.display = "none";
    });

    art.on("fullscreen", () => {
      // change phone screen orientation to landscape if screen width is less than 1024px
      if (window.innerWidth < 1024) {
        // eslint-disable-next-line no-restricted-globals
        screen.orientation.lock("landscape");
      }
    });

    // insert epsisode name and number into player absolute on top on pause
    // art.on("play", () => {
    //   art.layers.title.style.display = "none";
    // });
    //
    // art.on("pause", () => {
    //   art.layers.title.style.display = "block";
    // });

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

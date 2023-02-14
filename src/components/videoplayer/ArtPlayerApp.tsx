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

  const getEpisodeStream = async () => {
    setLoading(true);
    await axios
      .get(
        `https://ashanime-api.vercel.app/meta/anilist/watch/${streamEpisode.id}`,
        {
          params: {
            ...(provider && { provider }),
          },
        }
      )
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

  return (
    <div className="relative flex justify-center items-end w-full lg:h-full md:h-[21rem]  bg-black">
      {loading ? (
        <div className="flex justify-center items-center w-full h-full">
          <div className="sweet-loading">
            <MoonLoader color={"white"} loading={loading} size={60} />
          </div>
        </div>
      ) : (
        (!videoLink && (
          <div className="flex justify-center items-center w-full h-full">
            <span className="text-white outfit-medium flex justify-start items-center h-full ">
              {/*if no video URL then display below message and if animeStatus is upcoming say that it is upcoming */}
              {props.animeStatus === "Upcoming"
                ? "This anime is yet to be released."
                : "Select an episode to watch!"}
            </span>
          </div>
        )) || (
          <div className="w-full h-full">
            <Artplayer />
          </div>
        )
      )}
    </div>
  );
};

export default ArtPlayer;

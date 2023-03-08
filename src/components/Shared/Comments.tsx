import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
//@ts-ignore
import thumbsUp from "../../assets/thumbs-up.svg";
//@ts-ignore
import thumbsDown from "../../assets/thumbs-down.svg";

import PulseLoader from "react-spinners/PulseLoader";

const Comments = () => {
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<any>([]);

  const streamId = useSelector(
    (state: RootState) => state.anime.streamEpisode.id
  );

  const getComments = async () => {
    setLoading(true);
    await axios
      .get(` https://ashanime-api.vercel.app/thread/${streamId}`)
      .then((response) => {
        setComments(response.data.comments);
        setLoading(false);
      })
      .catch(() => {
        return;
      });
  };

  useEffect(() => {
    if (streamId) {
      getComments();
    }
  }, [streamId]);

  const handleDate = (date: any) => {
    //  subtract date from current date
    const currentDate = new Date();
    const commentDate = new Date(date);
    const diff = currentDate.getTime() - commentDate.getTime();
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else {
      return diffDays + " days ago";
    }
  };

  function stripHtml(html: string) {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  return (
    <section>
      {streamId ? (
        <div className="text-white">
          {/*comments section*/}
          <h1 className="lg:ml-8 xl:text-[24px] md:text-[18px] ml-4 text-redor outfit-medium my-4">
            Comments
          </h1>
          {loading ? (
            <div className="flex justify-center items-start w-full h-[64rem]">
              <div className="flex justify-center items-center lg:h-96 md:h-[25rem] w-full">
                <PulseLoader color={"white"} loading={loading} size={10} />
              </div>
            </div>
          ) : comments?.length > 0 ? (
            <div className="flex flex-col justify-start lg:px-4">
              {comments?.map((comment: any) => (
                <div className="pb-10 justify-start mx-5" key={comment.id}>
                  <div className="flex flex-col"></div>
                  <div className="flex gap-4">
                    <div className="w-12 h-10">
                      <img
                        alt="profile avatar"
                        className="rounded-full h-10 w-10"
                        src={comment.author.avatar.small.permalink}
                      />
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="flex gap-4">
                        <h3 className="outfit-medium">
                          {comment.author.username}
                        </h3>
                        <p className="outfit-light text-gray-500 ">
                          {handleDate(comment.createdAt)}
                        </p>
                      </div>
                      <p className="outfit-light text-white leading-5 mb-2 mt-2 text-[14px] ">
                        {stripHtml(comment.message)}
                      </p>
                      <div className="flex gap-8">
                        <div className="flex gap-4">
                          <img
                            alt="thumbs up"
                            className="w-4 h-4"
                            src={thumbsUp}
                          />
                          <p className="outfit-light text-gray-500 text-[14px] ">
                            {comment.likes}
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <img
                            alt="thumbs down"
                            className="w-4 h-4"
                            src={thumbsDown}
                          />{" "}
                          <p className="outfit-light text-gray-500 text-[14px] ">
                            {comment.dislikes}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center w-full h-full">
              <div className="flex justify-center items-center lg:h-96 md:h-[25rem] w-full">
                <PulseLoader color={"white"} loading={loading} size={10} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-whole-page h-4"></div>
      )}
    </section>
  );
};

export default Comments;

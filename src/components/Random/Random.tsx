import React, { useState } from "react";
import axios from "axios";
// @ts-ignore
import ModalStream from "../Shared/ModalStream";
import SheetStream from "../Shared/SheetStream";
import { setModalData } from "../../redux/search-slice";
import { useDispatch } from "react-redux";
import useWindowResize from "../../hooks/useWindowResize";
import { streamModal } from "../../types/type";

interface props {
  classes?: string;
}

const Random = (classes: props) => {
  const [modal, setModal] = useState<boolean>(false);
  const [sheet, setSheet] = useState<boolean>(false);
  const [modalId, setModalId] = useState<number>(0);

  const dispatch = useDispatch();

  const { windowDimension } = useWindowResize();
  const { winWidth } = windowDimension;

  const handleClick = (id: number) => {
    setModalId(id);

    if (winWidth >= 768) {
      setModal(true);
    }
    if (winWidth < 768) {
      setSheet(true);
    }
  };

  const getRandom = async () => {
    await axios
      .get(" https://ashanime-api.vercel.app/meta/anilist/random-anime")
      .then((res) => {
        const data = res.data;
        handleClick(data.id);
      })
      .catch((err) => {
        return console.log(err.status);
      });
  };

  return (
    <div>
      <div className="flex">
        <h3 onClick={getRandom} className={`${classes}`}>
          Random
        </h3>
      </div>

      <ModalStream
        modalId={modalId}
        setModalId={setModalId}
        setToggle={(boolean: boolean) => {
          if (!boolean) {
            dispatch(setModalData({} as streamModal));
          }
          setModal(boolean);
        }}
        toggle={modal}
      />
      <SheetStream
        setToggle={(boolean: boolean) => {
          if (!boolean) {
            dispatch(setModalData({} as streamModal));
          }
          setSheet(boolean);
        }}
        toggle={sheet}
        modalId={modalId}
        setModalId={setModalId}
      />
    </div>
  );
};

export default Random;

import React, { useEffect, useState } from "react";
import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from "@heroicons/react/solid";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import {
  searchLoadingAction,
  setPageLoadingAction,
} from "../../redux/search-slice";

interface props {
  currentPage: number;
  paginate: (page: number) => void;
  elementCount?: number;
}

const Pagination = ({ currentPage, paginate }: props) => {
  const [pageRange, setPageRange] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);
  const [prevPage, setPrevPage] = useState<number>(0);
  const [nextPage, setNextPage] = useState<number>(2);
  const [clickedNext, setClickedNext] = useState<boolean>(false);
  const [clickedPrev, setClickedPrev] = useState<boolean>(false);
  const [clickedNumber, setClickedNumber] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const windowLocation = window.location.pathname;

  const lastPageSelector = useSelector(
    (state: RootState) => state.anime.lastPage
  );

  const lastPage = lastPageSelector !== null ? lastPageSelector : ""; // check if lastPageSelector is not null

  useEffect(() => {
    if (currentPage % 10 === 1 && currentPage !== 1 && clickedNext) {
      setPageRange(
        pageRange.map((page: number) => {
          return page + 10;
        })
      );
    } else if (currentPage % 10 === 0 && clickedPrev) {
      setPageRange(
        pageRange.map((page: number) => {
          return page - 10;
        })
      );
    } else if (currentPage === 1) {
      setPageRange([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    }
    if (clickedNext || clickedPrev || clickedNumber) {
      document.getElementById("top-anime")!.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentPage, nextPage, prevPage, clickedNext, clickedPrev]);

  const hasNextPage = useSelector(
    (state: RootState) => state.anime.hasNextPage
  );

  const paginationHandler = (arg: string, page?: number) => {
    if (windowLocation === "/search-results" || windowLocation === "/genres") {
      dispatch(searchLoadingAction(true));
    }
    dispatch(setPageLoadingAction(true));
    switch (arg) {
      case "previous":
        currentPage > 1 && paginate(currentPage - 1);
        setNextPage(currentPage + 1);
        setPrevPage(currentPage - 1);
        setClickedNext(false);
        setClickedPrev(true);
        setClickedNumber(false);
        break;
      case "next":
        setNextPage(currentPage + 1);
        setPrevPage(currentPage - 1);
        setClickedNext(true);
        setClickedPrev(false);
        setClickedNumber(false);
        paginate(currentPage + 1);
        break;
      case "number":
        if (page && lastPage) {
          if (page <= lastPage) {
            paginate(page);
            setNextPage(currentPage + 1);
            setPrevPage(currentPage - 1);
            setClickedNext(false);
            setClickedPrev(false);
            setClickedNumber(true);
          }
        }
    }
  };

  return (
    <nav className="border-t border-redor px-4 mx-8 flex items-center justify-between sm:px-0">
      <div className="-mt-px w-0 flex-1 flex">
        <span
          onClick={() => paginationHandler("previous")}
          className={` ${
            currentPage > 1
              ? "cursor-pointer hover:text-redor hover:border-redor"
              : ""
          }   border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-white  transition-all ease-in-out`}
        >
          {currentPage > 1 ? (
            <ArrowNarrowLeftIcon className="mr-3 h-5 w-5" aria-hidden="true" />
          ) : (
            ""
          )}
          {currentPage > 1 ? "Previous" : "This is the first page"}
        </span>
      </div>
      <div className="hidden md:-mt-px md:flex">
        {pageRange.map((page: number) => {
          return (
            <span
              onClick={() => paginationHandler("number", page)}
              key={page}
              className={`${page === currentPage ? "text-redor" : ""} ${
                page <= lastPage
                  ? "cursor-pointer  hover:text-redor hover:border-redor"
                  : ""
              } border-transparent text-white  transition-all ease-in-out border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium`}
            >
              {page <= lastPage ? page : "..."}
            </span>
          );
        }, currentPage)}
      </div>
      <div className="-mt-px w-0 flex-1 flex justify-end">
        <span
          onClick={() => {
            if (!hasNextPage) {
              return alert("You are on the last page");
            }
            paginationHandler("next");
          }}
          className={` ${
            hasNextPage
              ? "cursor-pointer hover:text-redor hover:border-redor"
              : ""
          } border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-white transition-all ease-in-out`}
        >
          {hasNextPage ? "Next" : "This is the last page"}
          {hasNextPage ? (
            <ArrowNarrowRightIcon
              className="ml-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          ) : (
            ""
          )}
        </span>
      </div>
    </nav>
  );
};

export default Pagination;

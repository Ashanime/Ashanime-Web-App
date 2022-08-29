import {useAppDispatch} from "../redux/store";
import {useCallback} from "react";
import {
  animeSearch,
  searchLoadingAction,
  setCurrentPage,
  setPageLoadingAction,
  setSearchQuery,
  setSearchQueryView
} from "../redux/search-slice";
import axios from "axios";

export const UseSearch = (title: string) => {

  const dispatch = useAppDispatch();

  const handleWatchOnClick = useCallback((title: string) => {
    dispatch(setSearchQueryView(title));
    dispatch(setPageLoadingAction(false));
    dispatch(searchLoadingAction(true));
    dispatch(setSearchQuery(title));
    const getSearch = async () => {
      await axios
        .get('https://gogoanime.herokuapp.com/search', {
          params: {
            keyw: title,
          },
        })
        .then(async (res) => {
          const data = res.data;
          dispatch(searchLoadingAction(false));
          if (data.length === 0 && setCurrentPage) {
            setCurrentPage(1);
          }
          dispatch(animeSearch(data));
        });
    };
    getSearch();
  }, [dispatch]);
}
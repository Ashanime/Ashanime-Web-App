import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Register from "./components/Login/Register";
import SearchResults from "./components/SearchResults/SearchResults";
import Bookmarks from "./components/Bookmarks/Bookmarks";
import Notification from "./components/Shared/Notification";
import ForgotPassword from "./components/Login/ForgotPassword";
import { fetchUserDataById, RootState, useAppDispatch } from "./redux/store";
import { useSelector } from "react-redux";
import { onValue, ref } from "firebase/database";
import { setBookmarks } from "./redux/search-slice";
import { db } from "./firebase/Firebase";

function App() {
  const dispatch = useAppDispatch();

  const uid = useSelector((state: any) => state.google.profileObject?.uid);
  dispatch(fetchUserDataById(uid));

  onValue(ref(db, `users/${uid}/bookmarks`), (snapshot: { val: () => any }) => {
    const data = snapshot.val();
    if (data !== null) {
      dispatch(setBookmarks(data));
    }
  });

  const notificationReducer = useSelector(
    (state: RootState) => state.notification
  );
  const { show } = notificationReducer.notification;

  return (
    <div className=" flex justify-center">
      <div className=" w-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path={"/search-results"} element={<SearchResults />} />
          <Route path={"/genres"} element={<SearchResults />} />
          <Route path={"/bookmarks"} element={<Bookmarks />} />
        </Routes>
        {show && <Notification />}
      </div>
    </div>
  );
}

export default App;

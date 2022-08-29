import { get, child, ref, set, getDatabase, update } from "firebase/database";
import { db } from "../firebase/Firebase";
const dbRef = ref(getDatabase());

export const getUserDataById = async (userId: string) => {
  try {
    const snapshot = await get(child(dbRef, `users/${userId}`));
    if (snapshot.exists()) return snapshot.val();
    return {};
  } catch (error) {
    return;
    throw error;
  }
};

export const saveCurrentWatchEpisode = async (
  userId: string,
  newContinueWatching: any
) => {
  // write continue watching to firebase
  set(ref(db, `users/${userId}/continueWatching`), {
    ...newContinueWatching,
  });
};

export const updateWatchHistory = async (
  userId: string,
  updateBackendSavedEpisodes: any
) => {
  return update(ref(db, `users/${userId}/savedEpisodes`), {
    ...updateBackendSavedEpisodes,
  });
};

import { all, fork, takeEvery, put } from "redux-saga/effects";
// Login Redux States
import { EDIT_PROFILE } from "./actionTypes";
import { profileError } from "./actions";

function* editProfile({ payload: { user } }) {
  try {
  } catch (error) {
    yield put(profileError(error));
  }
}
export function* watchProfile() {
  yield takeEvery(EDIT_PROFILE, editProfile);
}

function* ProfileSaga() {
  yield all([fork(watchProfile)]);
}

export default ProfileSaga;

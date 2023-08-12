import axios from "axios";
import Cookies from "js-cookie";
const token = Cookies.get("token");

export const fetchPostsStart = () => ({
  type: "FETCH_POSTS_START",
});

export const fetchPostsSuccess = (posts) => ({
  type: "FETCH_POSTS_SUCCESS",
  payload: posts,
});

export const fetchPostsError = () => ({
  type: "FETCH_POSTS_ERROR",
});

export const closeSnackbar = () => ({
  type: "CLOSE_SNACKBAR",
});

export const fetchPosts = () => {
    const path = process.env.REACT_APP_PATH_ID;
  return async (dispatch) => {
    dispatch(fetchPostsStart());

    try {
        const res = await axios.get(
            `${path}/api/posts/${user.member_id}/date`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              cancelToken: source.token,
            }
          );
      dispatch(fetchPostsSuccess(res.data));
    } catch (error) {
      dispatch(fetchPostsError());
    }
  };
};
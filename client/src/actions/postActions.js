import axios from "axios";

import {
  ADD_POST,
  GET_ERRORS,
  CLEAR_ERRORS,
  GET_POSTS,
  POST_LOADING,
  DELETE_POST,
  GET_POST
} from "./types";

//Add post

export const addPost = postData => dispatch => {
  dispatch(clearErrors());
  axios
    .post("/api/post", postData)
    .then(res => {
      dispatch({ type: ADD_POST, payload: res.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: GET_ERRORS, payload: err.response.data });
    });
};
//get post

export const getPosts = () => dispatch => {
  dispatch(setPostLoading());
  axios
    .get("/api/post")
    .then(res => {
      dispatch({ type: GET_POSTS, payload: res.data });
    })
    .catch(err => {
      dispatch({ type: GET_POSTS, payload: null });
    });
};

//Delete Post
export const deletePost = id => dispatch => {
  axios
    .delete(`/api/post/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_POST,
        payload: id
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Add like
export const addLike = id => dispatch => {
  axios
    .post(`/api/post/like/${id}`)
    .then(res => dispatch(getPosts()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
//remove like
export const removeLike = id => dispatch => {
  axios
    .post(`/api/post/unlike/${id}`)
    .then(res => dispatch(getPosts()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//getPost
export const getPost = id => dispatch => {
  axios
    .get(`/api/post/${id}`)
    .then(res => dispatch({ type: GET_POST, payload: res.data }))
    .catch(err =>
      dispatch({
        type: GET_POST,
        payload: null
      })
    );
};

//Add Comment

export const addComment = (id, commentData) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/post/comment/${id}`, commentData)
    .then(res => {
      dispatch({ type: GET_POST, payload: res.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: GET_ERRORS, payload: err.response.data });
    });
};
//Delete Comment
export const deleteComment = (postId, commentId) => dispatch => {
  axios
    .delete(`/api/post/comment/${postId}/${commentId}`)
    .then(res =>
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
//set loading spinner
export const setPostLoading = () => {
  return {
    type: POST_LOADING
  };
};
//Clear Error
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

import axiosClient from "./axiosClient";

export async function getPosts() {
  const { data } = await axiosClient.get("/posts");
  return data.posts;
}

export async function getPostById(id) {
  const { data } = await axiosClient.get(`/posts/${id}`);
  return data.post;
}

export async function createPost({ caption, image }) {
  const formData = new FormData();
  formData.append("caption", caption);
  formData.append("image", image);

  const { data } = await axiosClient.post("/create-post", formData);
  return data.post;
}

export async function updatePost(id, { caption, image }) {
  const formData = new FormData();
  if (caption !== undefined) formData.append("caption", caption);
  if (image) formData.append("image", image);

  const { data } = await axiosClient.put(`/posts/${id}`, formData);
  return data.post;
}

export async function deletePost(id) {
  const { data } = await axiosClient.delete(`/posts/${id}`);
  return data;
}

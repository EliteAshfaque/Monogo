import { useCallback, useEffect, useState } from "react";
import { createPost, deletePost, getPosts, updatePost } from "../api";
import { getErrorMessage } from "../utils/error";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingPost, setEditingPost] = useState(null);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load posts"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const savePost = async ({ caption, image }) => {
    try {
      setSaving(true);
      setError("");

      if (editingPost) {
        await updatePost(editingPost._id, { caption, image });
      } else {
        await createPost({ caption, image });
      }

      setEditingPost(null);
      await loadPosts();
      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save post"));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const removePost = async (id) => {
    try {
      setError("");
      await deletePost(id);
      if (editingPost?._id === id) {
        setEditingPost(null);
      }
      await loadPosts();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete post"));
    }
  };

  const startEdit = (post) => {
    setEditingPost(post);
    setError("");
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setError("");
  };

  return {
    posts,
    loading,
    saving,
    error,
    setError,
    editingPost,
    loadPosts,
    savePost,
    removePost,
    startEdit,
    cancelEdit,
  };
}

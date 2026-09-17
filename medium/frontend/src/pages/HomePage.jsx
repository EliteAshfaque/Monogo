import Header from "../components/layout/Header";
import PostForm from "../components/posts/PostForm";
import PostList from "../components/posts/PostList";
import { usePosts } from "../hooks/usePosts";

export default function HomePage() {
  const {
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
  } = usePosts();

  async function handleSubmit(payload) {
    if (!payload.caption.trim()) {
      setError("Caption is required");
      return false;
    }
    if (!editingPost && !payload.image) {
      setError("Image is required");
      return false;
    }
    return savePost(payload);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this post?")) return;
    await removePost(id);
  }

  function handleEdit(post) {
    startEdit(post);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="page">
      <Header />

      <main className="layout">
        <PostForm
          editingPost={editingPost}
          saving={saving}
          error={error}
          onSubmit={handleSubmit}
          onCancel={cancelEdit}
        />

        <PostList
          posts={posts}
          loading={loading}
          onRefresh={loadPosts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}

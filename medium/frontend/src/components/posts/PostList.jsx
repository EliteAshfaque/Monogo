import Button from "../common/Button";
import PostCard from "./PostCard";

export default function PostList({ posts, loading, onRefresh, onEdit, onDelete }) {
  return (
    <section className="panel list-panel">
      <div className="list-header">
        <h2>All posts</h2>
        <Button variant="ghost" onClick={onRefresh}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <p className="empty">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="empty">No posts yet. Create your first one.</p>
      ) : (
        <ul className="post-list">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

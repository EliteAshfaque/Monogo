import Button from "../common/Button";

export default function PostCard({ post, onEdit, onDelete }) {
  return (
    <li className="post-item">
      <img src={post.image} alt={post.caption || "Post"} />
      <div className="post-body">
        <p>{post.caption}</p>
        <div className="post-actions">
          <Button onClick={() => onEdit(post)}>Edit</Button>
          <Button variant="danger" onClick={() => onDelete(post._id)}>
            Delete
          </Button>
        </div>
      </div>
    </li>
  );
}

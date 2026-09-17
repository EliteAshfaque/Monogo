import { useEffect, useRef, useState } from "react";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";

export default function PostForm({
  editingPost,
  saving,
  error,
  onSubmit,
  onCancel,
}) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setCaption(editingPost?.caption || "");
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [editingPost]);

  async function handleSubmit(e) {
    e.preventDefault();

    const success = await onSubmit({ caption: caption.trim(), image });
    if (success) {
      setCaption("");
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <section className="panel form-panel">
      <h2>{editingPost ? "Update post" : "Create post"}</h2>

      <form onSubmit={handleSubmit} className="form">
        <label>
          Caption
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            required
          />
        </label>

        <label>
          Image {editingPost ? "(optional)" : ""}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            required={!editingPost}
          />
        </label>

        <ErrorMessage message={error} />

        <div className="actions">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : editingPost ? "Update Post" : "Create Post"}
          </Button>

          {editingPost && (
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </section>
  );
}

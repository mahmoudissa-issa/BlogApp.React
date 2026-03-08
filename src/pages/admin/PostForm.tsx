import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  createPost,
  fetchPostById,
  updatePost,
  clearCurrentPost,
} from "../../features/posts/postSlice";
import { fetchTags } from "../../features/tags/tagSlice";
import { toast } from "react-toastify";
import { FaCloudUploadAlt, FaTimes, FaArrowLeft } from "react-icons/fa";
import { SERVER_URL } from "../../constants/app";
import { canCreateTags, getDashboardPath } from "../../core/permissions";
import TagDropdown from "../../components/common/TagDropdown";
import "../../styles/AdminPosts.css";

/* ── constants ── */
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link", "image"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ["clean"],
  ],
};

const QUILL_FORMATS = [
  "header", "bold", "italic", "underline", "strike",
  "list", "blockquote", "code-block",
  "link", "image", "align", "color", "background",
];

/* ── helpers ── */
const toSlug = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const validateImage = (file: File): boolean => {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    toast.error("Upload a valid image (JPEG, PNG, WebP, GIF)");
    return false;
  }
  if (file.size > MAX_IMAGE_SIZE) {
    toast.error("Image must be under 5 MB");
    return false;
  }
  return true;
};

/* ── component ── */
export default function PostForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { currentPost, loading } = useAppSelector((s) => s.post);
  const { tags } = useAppSelector((s) => s.tags);
  const { user } = useAppSelector((s) => s.auth);

  const basePath = `${getDashboardPath(user?.role)}/posts`;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState(1);
  const [selectedTagNames, setSelectedTagNames] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [postImage, setPostImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const slug = useMemo(() => toSlug(title), [title]);

  /* ── data loading ── */
  useEffect(() => { dispatch(fetchTags()); }, [dispatch]);

  useEffect(() => {
    if (isEdit && id) dispatch(fetchPostById(Number(id)));
    return () => { dispatch(clearCurrentPost()); };
  }, [isEdit, id, dispatch]);

  useEffect(() => {
    if (!isEdit || !currentPost) return;
    setTitle(currentPost.title);
    setContent(currentPost.content);
    setCategoryId(currentPost.categoryId);
    setSelectedTagNames(currentPost.tagNames ?? []);
    if (currentPost.imageUrl) setImagePreview(currentPost.imageUrl);
  }, [isEdit, currentPost]);

  /* ── tag helpers ── */
  const allowCustomTags = canCreateTags(user?.role);

  const toggleTag = (tagName: string) =>
    setSelectedTagNames((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName],
    );

  const addCustomTag = (name: string) =>
    setCustomTags((prev) => [...prev, name]);

  const removeCustomTag = (name: string) =>
    setCustomTags((prev) => prev.filter((t) => t !== name));

  /* ── image handlers ── */
  const pickImage = (file: File) => {
    if (!validateImage(file)) return;
    setPostImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) pickImage(file);
    e.target.value = "";
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) pickImage(file);
  }, []);

  const removeImage = () => {
    if (imagePreview && postImage) URL.revokeObjectURL(imagePreview);
    setPostImage(null);
    setImagePreview(null);
  };

  /* ── submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");
    if (!content.trim() || content === "<p><br></p>")
      return toast.error("Content is required");
    if (!selectedTagNames.length && !customTags.length)
      return toast.error("Select at least one tag");

    setSubmitting(true);

    const allTagNames = [...selectedTagNames, ...customTags];

    const payload = {
      title,
      content,
      authorId: isEdit ? (currentPost?.authorId ?? Number(user?.id)) : Number(user?.id),
      categoryId,
      tagNames: allTagNames,
      postImage,
    };

    try {
      if (isEdit && id) {
        await dispatch(updatePost({ id: Number(id), ...payload })).unwrap();
        toast.success("Post updated!");
      } else {
        await dispatch(createPost(payload)).unwrap();
        toast.success("Post created!");
      }
      navigate(basePath);
    } catch (err) {
      toast.error((err as string) || `Failed to ${isEdit ? "update" : "create"} post`);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── image src helper ── */
  const imageSrc =
    postImage && imagePreview
      ? imagePreview
      : imagePreview
        ? `${SERVER_URL}${imagePreview}`
        : null;

  /* ── render ── */
  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>{isEdit ? "Edit Post" : "New Post"}</h1>
          <p>{isEdit ? "Update your post" : "Create a new blog post"}</p>
        </div>
        <Link to={basePath} className="btn-cancel">
          <FaArrowLeft style={{ marginRight: 6 }} /> Back to Posts
        </Link>
      </div>

      <div className="post-form-card">
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="post-title">Title</label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title…"
            />
          </div>

          {/* Slug (auto-generated, read-only) */}
          <div className="form-group">
            <label htmlFor="post-slug">Slug</label>
            <input id="post-slug" type="text" value={slug} readOnly />
          </div>

          {/* Content */}
          <div className="form-group">
            <label>Content</label>
            <div className="quill-wrapper">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={QUILL_MODULES}
                formats={QUILL_FORMATS}
                placeholder="Write your post content here…"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label>Tags</label>
            <TagDropdown
              tags={tags}
              selectedTagNames={selectedTagNames}
              onToggle={toggleTag}
              customTags={customTags}
              onAddCustomTag={addCustomTag}
              onRemoveCustomTag={removeCustomTag}
              allowCustomTags={allowCustomTags}
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="post-category">Category ID</label>
            <input
              id="post-category"
              type="number"
              min={1}
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
            />
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label>Post Image</label>
            {imageSrc ? (
              <div className="image-preview-container">
                <img src={imageSrc} alt="Preview" className="image-preview" />
                <button type="button" className="image-remove-btn" onClick={removeImage}>
                  <FaTimes />
                </button>
              </div>
            ) : (
              <div
                className={`image-upload-area ${isDragging ? "dragging" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <div className="image-upload-placeholder">
                  <FaCloudUploadAlt />
                  <p>Click or drag image to upload</p>
                  <span className="upload-hint">JPEG, PNG, WebP, GIF — Max 5 MB</span>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={onFileChange}
              style={{ display: "none" }}
            />
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={submitting || loading}>
              {submitting ? (isEdit ? "Updating…" : "Creating…") : isEdit ? "Update Post" : "Create Post"}
            </button>
            <Link to={basePath} className="btn-cancel">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

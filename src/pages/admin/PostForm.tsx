import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { validateImageFile } from "../../utils/imageValidation";
import { postFormSchema, type PostFormData } from "../../types/post";
import "../../styles/AdminPosts.css";

/* ── constants ── */
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

  // RHF with Zod
  const {
    register,
    handleSubmit: rhfSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: { title: "", content: "", tagNames: [] },
  });

  const title = watch("title");
  const slug = useMemo(() => toSlug(title), [title]);

  // Non-validated local state (image, custom tags, drag)
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [postImage, setPostImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── data loading ── */
  useEffect(() => { dispatch(fetchTags()); }, [dispatch]);

  useEffect(() => {
    if (isEdit && id) dispatch(fetchPostById(Number(id)));
    return () => { dispatch(clearCurrentPost()); };
  }, [isEdit, id, dispatch]);

  useEffect(() => {
    if (!isEdit || !currentPost) return;
    reset({
      title: currentPost.title,
      content: currentPost.content,
      tagNames: currentPost.tagNames ?? [],
    });
    if (currentPost.imageUrl) setImagePreview(currentPost.imageUrl);
  }, [isEdit, currentPost, reset]);

  /* ── tag helpers ── */
  const allowCustomTags = canCreateTags(user?.role);
  const selectedTagNames = watch("tagNames");

  const toggleTag = (tagName: string) => {
    const current = selectedTagNames;
    const next = current.includes(tagName)
      ? current.filter((t) => t !== tagName)
      : [...current, tagName];
    setValue("tagNames", next, { shouldValidate: true });
  };

  const addCustomTag = (name: string) => setCustomTags((prev) => [...prev, name]);
  const removeCustomTag = (name: string) => setCustomTags((prev) => prev.filter((t) => t !== name));

  /* ── image handlers ── */
  const pickImage = (file: File) => {
    if (!validateImageFile(file)) return;
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
  const onSubmit = async (data: PostFormData) => {
    // Merge custom tags with selected tags
    const allTagNames = [...data.tagNames, ...customTags];
    if (!allTagNames.length) { toast.error("Select at least one tag"); return; }

    const payload = {
      title: data.title,
      content: data.content,
      authorId: isEdit ? (currentPost?.authorId ?? Number(user?.id)) : Number(user?.id),
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
    }
  };

  /* ── image src helper ── */
  const imageSrc = postImage && imagePreview
    ? imagePreview
    : imagePreview ? `${SERVER_URL}${imagePreview}` : null;

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
        <form onSubmit={rhfSubmit(onSubmit)} noValidate>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="post-title">Title</label>
            <input id="post-title" type="text" placeholder="Enter post title…" {...register("title")} />
            {errors.title && <p className="text-danger mt-1">{errors.title.message}</p>}
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
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <ReactQuill
                    theme="snow"
                    value={field.value}
                    onChange={(val) => {
                      const isEmpty = !val || val === "<p><br></p>";
                      field.onChange(isEmpty ? "" : val);
                    }}
                    modules={QUILL_MODULES}
                    formats={QUILL_FORMATS}
                    placeholder="Write your post content here…"
                  />
                )}
              />
            </div>
            {errors.content && <p className="text-danger mt-1">{errors.content.message}</p>}
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
            {errors.tagNames && <p className="text-danger mt-1">{errors.tagNames.message}</p>}
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
            <button type="submit" className="btn-submit" disabled={isSubmitting || loading}>
              {isSubmitting ? (isEdit ? "Updating…" : "Creating…") : isEdit ? "Update Post" : "Create Post"}
            </button>
            <Link to={basePath} className="btn-cancel">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

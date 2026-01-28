import  { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import defaultAvatar from "../assets/avatar.png";
import {
  clearPostDetail,
  fetchComments,
  fetchPostDetail,
} from "../features/postDetails/postDetailSlice";
import ErrorAlert from "../components/common/ErrorAlert";
import "../styles/PostDetail.css";
import EmptyState from "../components/common/EmptyState";
import { SERVER_URL } from "../constants/app";
import { calculateReadingTime, formatPostDate } from "../utils/dateFormatter";
import { BsCalendar3, BsArrowLeft } from "react-icons/bs";
import { BiTime } from "react-icons/bi";
import DOMPurify from "dompurify";
import CommentForm from "../components/comment/CommentForm";


export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { post, comments, loading, error, commentsLoading } = useAppSelector(
    (state) => state.postDetail
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchPostDetail(Number(id)));
      dispatch(fetchComments(Number(id)));
    }
    // Cleanup on unmount
    return () => {
      dispatch(clearPostDetail());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="post-detail-container">
        <div className="loading-state">Loading post...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-detail-container">
        <ErrorAlert
          message={error}
          onRetry={() => {
            if (id) {
              dispatch(fetchPostDetail(Number(id)));
              dispatch(fetchComments(Number(id)));
            }
          }}
        />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-detail-container">
        <EmptyState
          title="Post not found"
          message="The post you are looking for does not exist."
        />
      </div>
    );
  }

  const readingTime = calculateReadingTime(post.content);

  const sanitizedContent = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "img",
      "code",
      "pre",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "rel", "class"],
  });

  return (
    <div className="post-detail-container">
      {/* Back Button */}
      <div className="back-button-container">
        <button onClick={() => navigate(-1)} className="back-button">
          <span className="back-arrow">
            <BsArrowLeft />
          </span>
          <span>Back to Home</span>
        </button>
      </div>

      {/* Post Header */}
      <header className="post-header">
        <span className="category-badge">{post.categoryName}</span>
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <div className="meta-item">
            <img
              src={`${SERVER_URL}/${post.avatarUrl}`}
              alt={post.authorName}
              className="author-avatar"
              onError={(e) => {
                e.currentTarget.src = defaultAvatar;
              }}
            />
            <span className="author-name">
              <strong>{post.authorName}</strong>
            </span>
          </div>
          <div className="meta-item">
            <BsCalendar3 />
            <span>{formatPostDate(post.createdAt)}</span>
          </div>
          <div className="meta-item">
            <BiTime />
            <span>{readingTime} min read</span>
          </div>
        </div>
      </header>

      {/* Featured Image with wrapper for overlay effect */}
      <div className="featured-image-container">
        <div className="image-wrapper">
          <img
            src={`${SERVER_URL}/${post.imageUrl}`}
            alt={post.title}
            className="featured-image"
            onError={(e) => {
              e.currentTarget.src = defaultAvatar;
            }}
          />
        </div>
      </div>

      {/* Post Content */}
      <article className="post-content-details">
        <div
          className="content-text"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </article>

      {/* Tags and Share */}
      <div className="tags-share-section">
        <div className="tags-container-details">
          <h3 className="section-title">Tags</h3>
          <div className="tags-list">
            {post.tagNames && post.tagNames.length > 0 ? (
              post.tagNames.map((tag, index) => (
                <Link to={`/?tag=${tag}`} key={index} className="tag">
                  {tag}
                </Link>
              ))
            ) : (
              <span className="tag">No tags</span>
            )}
          </div>
        </div>

        <div className="share-container">
          <h3 className="section-title">Share Article</h3>
          <div className="share-buttons">
            <a
              href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${post.title}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-btn"
              title="Share on Twitter"
            >
              𝕏
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-btn"
              title="Share on Facebook"
            >
              f
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?url=${window.location.href}&title=${post.title}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-btn"
              title="Share on LinkedIn"
            >
              in
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }}
              className="share-btn"
              title="Copy link"
            >
              🔗
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h2 className="comments-title">Discussion</h2>

        {/* Comment Form */}
         { id && <CommentForm postId={Number(id)} /> }

        {/* Comments List */}
        <div className="comments-list">
          {commentsLoading ? (
            <div className="loading-state">Loading comments...</div>
          ) : comments.length === 0 ? (
            <EmptyState
              title="No comments yet"
              message="Be the first to comment on this post."
            />
          ) : (
            comments.map((comment) => (
              <div className="comment" key={comment.id}>
                <div className="comment-header">
                  <img
                    src={`${SERVER_URL}/${comment.avatarUrl}`}
                    alt="Commenter Avatar"
                    className="commenter-avatar"
                    onError={(e) => {
                      e.currentTarget.src = defaultAvatar;
                    }}
                  />
                  <div className="comment-author-info">
                    <div className="comment-author">{comment.userName}</div>
                    <div className="comment-date">
                      {formatPostDate(comment.createdAt)}
                    </div>
                  </div>
                </div>
                <p className="comment-text">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Related Posts Section */}
      <div className="related-posts-section">
        <h2 className="related-posts-title">Related Posts</h2>
        <div className="related-posts-grid">
          {/* Example Related Post Card - You can map actual related posts here */}
          <Link to="#" className="related-post-card">
            <img
              src={defaultAvatar}
              alt="Related Post"
              className="related-post-image"
            />
            <div className="related-post-content">
              <div className="related-post-category">Development</div>
              <h4 className="related-post-title">
                Understanding React Hooks and State Management
              </h4>
              <p className="related-post-date">August 25, 2023</p>
            </div>
          </Link>

          <Link to="#" className="related-post-card">
            <img
              src={defaultAvatar}
              alt="Related Post"
              className="related-post-image"
            />
            <div className="related-post-content">
              <div className="related-post-category">Tutorial</div>
              <h4 className="related-post-title">
                Building Scalable APIs with Node.js
              </h4>
              <p className="related-post-date">August 20, 2023</p>
            </div>
          </Link>

          <Link to="#" className="related-post-card">
            <img
              src={defaultAvatar}
              alt="Related Post"
              className="related-post-image"
            />
            <div className="related-post-content">
              <div className="related-post-category">Design</div>
              <h4 className="related-post-title">
                Modern UI/UX Design Principles
              </h4>
              <p className="related-post-date">August 18, 2023</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
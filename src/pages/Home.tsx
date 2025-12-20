import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchPosts } from "../features/posts/postSlice";
import { fetchTags } from "../features/tags/tagSlice";
import { Link } from "react-router-dom";
import { SERVER_URL } from "../constants/app";
import PostCardSkeleton from "../components/skeletons/PostCardSkeleton";
import EmptyState from "../components/common/EmptyState";
import ErrorAlert from "../components/common/ErrorAlert";
import TagsSkeleton from "../components/skeletons/TagsSkeleton";

function Home() {
  const dispatch = useAppDispatch();
  const {
    items: posts,
    loading,
    error,
  } = useAppSelector((state) => state.post);

  const {
    tags,
    loading: tagsLoading,
    error: tagsError,
  } = useAppSelector((state) => state.tags);

  const [activeTag, setActiveTag] = useState<string>("All");

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, [dispatch]);

  const filteredPosts =
    activeTag === "All"
      ? posts
      : posts.filter((post) => post.tagNames.some((tag) => tag === activeTag));

  return (
    <div className="posts-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h4>FullStack Blog App</h4>
        <p>Click a tag to explore posts by topic</p>
      </div>

      {/* Error Alert - Only show if there's an error */}
      {error && (
        <ErrorAlert
          message={error}
          onRetry={() => {
            dispatch(fetchPosts());
            dispatch(fetchTags());
          }}
        />
      )}
      {/* Tags Container - Hide when there's an error */}
      {!error && (
        <div className="tags-container">
          {tagsLoading ? (
            // Skeleton loading for tags
              <TagsSkeleton count={8} />
          ) : (
            <>
              {/* "All" button */}
              <button
                className={`tag-pill ${activeTag === "All" ? "active" : ""}`}
                onClick={() => setActiveTag("All")}
              >
                All
              </button>
              
              {/* Tag buttons */}
              {tags.map((tag) => (
                <button
                  key={tag.tagId}
                  className={`tag-pill ${activeTag === tag.name ? "active" : ""}`}
                  onClick={() => setActiveTag(tag.name)}
                >
                  {tag.name}
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {/* Posts Grid - Hide when there's an error */}
      {!error && (
        <div className="posts-grid">
          {loading ? (
            // Skeleton loading for posts
            <>
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
            </>
          ) : filteredPosts.length === 0 ? (
            // Empty state
            <div className="posts-grid-empty">
              <EmptyState
                title="No posts found"
                message={
                  activeTag === "All"
                    ? "No posts available yet. Check back later!"
                    : `No posts found for "${activeTag}"`
                }
                actionButton={
                  activeTag !== "All"
                    ? {
                        label: "View All Posts",
                        onClick: () => setActiveTag("All"),
                      }
                    : undefined
                }
              />
            </div>
          ) : (
            // Posts list
            filteredPosts.map((post) => (
              <Link
                to={`/posts/${post.id}`}
                key={post.id}
                className="post-card-link"
              >
                <div className="post-card">
                  {/* Post Image */}
                  <div className="post-image-container">
                    <img
                      src={`${SERVER_URL}/${post.imageUrl}`}
                      alt={post.title}
                      className="post-image"
                      onError={(e) => {
                        // Fallback image if loading fails
                        e.currentTarget.src = "/placeholder.jpg";
                      }}
                    />
                  </div>

                  {/* Post Content */}
                  <div className="post-content">
                    {/* Category Badge */}
                    {post.categoryName && (
                      <span className="post-category">
                        {post.categoryName}
                      </span>
                    )}

                    {/* Post Title */}
                    <h3 className="post-title">{post.title}</h3>

                    {/* Post Excerpt */}
                    <p className="post-excerpt">
                      {post.content.substring(0, 120)}...
                    </p>
                  </div>

                  {/* Author & Date */}
                  <div className="post-meta">
                    <div className="author-info">
                      <img
                        src="/default-avatar.png"
                        alt={post.authorName}
                        className="author-avatar"
                        onError={(e) => {
                          e.currentTarget.src = "/default-avatar.png";
                        }}
                      />
                      <div className="author-details">
                        <p className="author-name">{post.authorName}</p>
                        <p className="post-date">
                          {new Date(post.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
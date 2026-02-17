import  { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchPosts } from "../features/posts/postSlice";
import { fetchTags } from "../features/tags/tagSlice";
import { Link } from "react-router-dom";
import { SERVER_URL } from "../constants/app";
import PostCardSkeleton from "../components/skeletons/PostCardSkeleton";
import EmptyState from "../components/common/EmptyState";
import ErrorAlert from "../components/common/ErrorAlert";
import TagsSkeleton from "../components/skeletons/TagsSkeleton";
import { formatPostDate } from "../utils/dateFormatter";
import defaultAvatar from "../assets/avatar.png";
import DomPurify from "dompurify";
import { FaSearch } from "react-icons/fa";
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
  } = useAppSelector((state) => state.tags);

  const [activeTag, setActiveTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, [dispatch]);

  // Memoize filtered and sanitized posts to avoid re-computing on every render
  const sanitizedPosts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const filtered = posts.filter((post) => {
      const matchesTag = activeTag === "All" || post.tagNames.some((tag) => tag === activeTag);
      const matchesSearch = !query
        || post.title.toLowerCase().includes(query)
        || post.authorName.toLowerCase().includes(query)
        || post.content.toLowerCase().includes(query);
      return matchesTag && matchesSearch;
    });

    return filtered.map((post) => ({
      ...post,
      content: DomPurify.sanitize(post.content),
    }));
  }, [posts, activeTag, searchQuery]);
    
 

  return (
    <div className="posts-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h4>FullStack Blog App</h4>
        <p>Click a tag to explore posts by topic</p>

        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search posts by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
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
                  className={`tag-pill ${
                    activeTag === tag.name ? "active" : ""
                  }`}
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
          ) : sanitizedPosts.length === 0 ? (
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
            sanitizedPosts.map((post) => (
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
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        // Fallback image if loading fails
                         e.currentTarget.src = defaultAvatar;
                      }}
                    />
                  </div>

                  {/* Post Content */}
                  <div className="post-content">
                    {/* Category Badge */}
                    {post.categoryName && (
                      <span className="post-category">{post.categoryName}</span>
                    )}

                    {/* Post Title */}
                    <h3 className="post-title">{post.title}</h3>

                    {/* Post Excerpt */}
                    <p className="post-excerpt" dangerouslySetInnerHTML={{__html:post.content.substring(0,120) +"..."}} />
                  
                    
                  </div>

                  {/* Author & Date */}
                  <div className="post-meta">
                    <div className="author-info">
                      <img
                        src={defaultAvatar}
                        alt={post.authorName}
                        className="author-avatar"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                           e.currentTarget.src = defaultAvatar;
                        }}
                      />
                      <div className="author-details">
                        <p className="author-name">{post.authorName}</p>
                        <p className="post-date">
                          {formatPostDate(post.createdAt)}
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

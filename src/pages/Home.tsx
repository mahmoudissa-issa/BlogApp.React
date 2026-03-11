import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchPosts } from "../features/posts/postSlice";
import { fetchTags } from "../features/tags/tagSlice";
import { Link } from "react-router-dom";
import { SERVER_URL } from "../constants/app";
import PostCardSkeleton from "../components/skeletons/PostCardSkeleton";
import EmptyState from "../components/common/EmptyState";
import ErrorAlert from "../components/common/ErrorAlert";
import TagsSkeleton from "../components/skeletons/TagsSkeleton";
import Pagination from "../components/common/Pagination";
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
    totalRows,
    pageSize,
  } = useAppSelector((state) => state.post);

  const {
    tags,
    loading: tagsLoading,
  } = useAppSelector((state) => state.tags);

  const [activeTag, setActiveTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(0); // 0-indexed

  // Resolve tagId from active tag name for server-side filtering
  const activeTagId = useMemo(() => {
    if (activeTag === "All") return undefined;
    return tags.find((t) => t.name === activeTag)?.tagId;
  }, [activeTag, tags]);

  // Fetch posts whenever page or active tag changes
  useEffect(() => {
    dispatch(fetchPosts({ pageNumber: page, pageSize, tagId: activeTagId }));
  }, [dispatch, page, activeTagId, pageSize]);

  // Fetch tags once
  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  // Client-side search applied to the current page's results
  const sanitizedPosts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const filtered = posts.filter((post) => {
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.authorName.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query);
      return matchesSearch;
    });

    return filtered.map((post) => ({
      ...post,
      content: DomPurify.sanitize(post.content),
    }));
  }, [posts, searchQuery]);

  const totalPages = Math.ceil(totalRows / pageSize);

  const handleTagChange = (tag: string) => {
    setActiveTag(tag);
    setPage(0);
    setSearchQuery("");
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

      {/* Error Alert */}
      {error && (
        <ErrorAlert
          message={error}
          onRetry={() => {
            dispatch(fetchPosts({ pageNumber: page, pageSize, tagId: activeTagId }));
            dispatch(fetchTags());
          }}
        />
      )}

      {/* Tags Container */}
      {!error && (
        <div className="tags-container">
          {tagsLoading ? (
            <TagsSkeleton count={8} />
          ) : (
            <>
              <button
                className={`tag-pill ${activeTag === "All" ? "active" : ""}`}
                onClick={() => handleTagChange("All")}
              >
                All
              </button>

              {tags.map((tag) => (
                <button
                  key={tag.tagId}
                  className={`tag-pill ${activeTag === tag.name ? "active" : ""}`}
                  onClick={() => handleTagChange(tag.name)}
                >
                  {tag.name}
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {/* Posts Grid */}
      {!error && (
        <>
          <div className="posts-grid">
            {loading ? (
              <>
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </>
            ) : sanitizedPosts.length === 0 ? (
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
                          onClick: () => handleTagChange("All"),
                        }
                      : undefined
                  }
                />
              </div>
            ) : (
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
                          e.currentTarget.src = defaultAvatar;
                        }}
                      />
                    </div>

                    {/* Post Content */}
                    <div className="post-content">
                      <h3 className="post-title">{post.title}</h3>
                      <p
                        className="post-excerpt"
                        dangerouslySetInnerHTML={{
                          __html: post.content.substring(0, 120) + "...",
                        }}
                      />
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
                          <p className="post-date">{formatPostDate(post.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Pagination  */}
          {!loading && totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              pageSize={pageSize}
              totalRows={totalRows}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Home;
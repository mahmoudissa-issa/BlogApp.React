import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchPosts } from "../features/posts/postSlice";

function Home() {
  const dispatch = useAppDispatch();
  const {
    items: posts,
    loading,
    error,
  } = useAppSelector((state) => state.post);

 useEffect(() =>{
  dispatch(fetchPosts());
 },[dispatch])

 useEffect(() => {
   console.log("Posts:", posts);
 }, [posts]); 

  return (
    <div className="posts-container">
      <h2>FullStack Blog App</h2>
      <p>Click a tag to explore posts by topic</p>
      {loading && <p>Loading posts...</p>}
      {error && <p className="text-danger">Error: {error}</p>}
      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <img src={`https://localhost:7027/${post.imageUrl}`} alt={post.title} className="post-image" />
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;

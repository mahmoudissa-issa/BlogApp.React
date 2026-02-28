import { useState } from "react";
import type { Post } from "../types/post";

function PostSearch({ posts }: { posts: Post[] }) {
  const [search, setSearch] = useState("");
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <input type="text" placeholder="Search posts..."  value={search} onChange={(e) => setSearch(e.target.value)}/>
      {filteredPosts.length === 0 && <p>No Posts Found</p>}
      <ul>
        {filteredPosts.map((post) => (
          <li key={post.id}>{post.title}</li>
        )) }
      </ul>
    </div>
  );
}

export default PostSearch;

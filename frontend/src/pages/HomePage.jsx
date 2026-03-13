import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/posts');
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="page">
      <h1 className="page-title">Latest Posts</h1>
      {posts.length === 0 && <p>No posts found.</p>}
      <div className="posts-wrapper">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <Link to={`/post/${post.slug}`}><h2>{post.title}</h2></Link>
            <p>{post.content.slice(0, 100)}...</p>
            <p>By {post.author?.username || "Unknown"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;

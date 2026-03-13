import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import Loader from '../components/Loader';

const PostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/posts/${slug}`);
        if (!res.ok) throw new Error('Post not found');
        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error(err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) return <Loader />;
  if (!post) return <p>Post not found.</p>;

  return (
    <div className="page">
      <h1>{post.title}</h1>
      <p>By {post.author?.username || 'Unknown'}</p>

      {/* SIGURAN PRIKAZ SADRŽAJA */}
      <div className="post-content">
        <p>{post.content}</p>
      </div>
    </div>
  );
};

export default PostPage;

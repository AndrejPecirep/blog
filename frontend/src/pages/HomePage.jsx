import React, { useEffect, useMemo, useState } from 'react';
import apiClient from '../apiClient';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import PostCard from '../components/PostCard';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get('/posts', {
          params: {
            page,
            q: query || undefined,
            tag: selectedTag || undefined,
            limit: 9
          }
        });
        setPosts(data.posts || []);
        setAvailableTags(data.availableTags || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, query, selectedTag]);

  const featured = useMemo(() => posts[0], [posts]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setQuery(search.trim());
  };

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div>
          <span className="eyebrow">Professional Blog</span>
          <h1>Turn content into a modern digital experience.</h1>
          <p>
            The app now includes search, tag filtering, rich post pages, comments, a profile area, and a polished modern UI.
          </p>
          <form onSubmit={handleSearch} className="toolbar-card search-bar">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search titles and content..."
            />
            <button className="button button-primary" type="submit">Search</button>
          </form>
        </div>
        <div className="stats-grid">
          <div className="stat-card"><strong>{posts.length}</strong><span>posts on this page</span></div>
          <div className="stat-card"><strong>{availableTags.length}</strong><span>tags</span></div>
          <div className="stat-card"><strong>100%</strong><span>responsive design</span></div>
          <div className="stat-card"><strong>Pro</strong><span>visual identity</span></div>
        </div>
      </section>

      <section className="toolbar-card filter-row">
        <div className="tag-filter-group">
          <button className={!selectedTag ? 'tag-pill active' : 'tag-pill'} onClick={() => { setSelectedTag(''); setPage(1); }}>
            All topics
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              className={selectedTag === tag ? 'tag-pill active' : 'tag-pill'}
              onClick={() => { setSelectedTag(tag); setPage(1); }}
            >
              #{tag}
            </button>
          ))}
        </div>
      </section>

      {loading ? <Loader /> : (
        <>
          {featured && (
            <section className="featured-card">
              <div>
                <span className="eyebrow">Featured Article</span>
                <h2>{featured.title}</h2>
                <p>{featured.content.slice(0, 240)}...</p>
              </div>
              <div className="featured-meta">
                <span>Author: {featured.author?.username || 'Unknown'}</span>
                <span>{featured.readingTime || 1} min read</span>
                <span>{featured.commentsCount || 0} comments</span>
              </div>
            </section>
          )}

          {posts.length === 0 ? (
            <section className="empty-state">No results found for the selected filter.</section>
          ) : (
            <section className="posts-grid">
              {posts.map((post) => <PostCard key={post.id} post={post} />)}
            </section>
          )}

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default HomePage;

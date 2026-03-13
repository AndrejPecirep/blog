import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../apiClient';
import Loader from '../components/Loader';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, refreshProfile, login, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ username: '', bio: '', avatarUrl: '' });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const currentUser = await refreshProfile();
        setProfile(currentUser);
        setForm({
          username: currentUser?.username || '',
          bio: currentUser?.bio || '',
          avatarUrl: currentUser?.avatarUrl || ''
        });
        const { data } = await apiClient.get('/posts', { params: { authorId: currentUser?.id, limit: 6 } });
        setPosts(data.posts || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (token) load();
  }, [token]);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await apiClient.put('/users/me', form);
      setProfile(data.user);
      login(data.user, token);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;
  if (!profile) return <section className="empty-state">Profile is not available.</section>;

  return (
    <div className="page-stack two-column-layout">
      <section className="profile-card">
        <div className="profile-top">
          <div className="avatar-circle">{profile.username?.[0]?.toUpperCase()}</div>
          <div>
            <span className="eyebrow">My Profile</span>
            <h1>{profile.username}</h1>
            <p>{profile.email}</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSave}>
          <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" />
          <input value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} placeholder="Avatar image URL" />
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Short bio" />
          <button className="button button-primary" disabled={saving} type="submit">
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </section>

      <section className="dashboard-card">
        <div className="section-heading">
          <h2>My Published Posts</h2>
          <Link to="/create" className="button button-secondary">New Post</Link>
        </div>
        <div className="posts-grid compact-grid">
          {posts.length ? posts.map((post) => <PostCard key={post.id} post={post} />) : <div className="empty-state small">No published posts yet.</div>}
        </div>
      </section>
    </div>
  );
}

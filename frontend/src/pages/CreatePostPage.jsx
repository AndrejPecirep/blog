import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../apiClient';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditMode = useMemo(() => Boolean(editId), [editId]);
  const [form, setForm] = useState({ title: '', content: '', tags: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      if (!editId) return;
      try {
        const { data: postsData } = await apiClient.get('/posts', { params: { limit: 100 } });
        const post = postsData.posts.find((item) => `${item.id}` === `${editId}`);
        if (post) {
          setForm({
            title: post.title,
            content: post.content,
            tags: post.Tags?.map((tag) => tag.name).join(', ') || ''
          });
          setPreview(post.imageUrl ? `${import.meta.env.VITE_UPLOADS_BASE_URL || 'http://localhost:5000'}${post.imageUrl}` : '');
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadPost();
  }, [editId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    const payload = new FormData();
    payload.append('title', form.title);
    payload.append('content', form.content);
    payload.append('tags', form.tags);
    if (image) payload.append('image', image);

    try {
      const { data } = isEditMode
        ? await apiClient.put(`/posts/${editId}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } })
        : await apiClient.post('/posts', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate(`/post/${data.slug}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Saving failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="editor-shell">
      <div className="editor-card">
        <span className="eyebrow">{isEditMode ? 'Edit Content' : 'New Content'}</span>
        <h1>{isEditMode ? 'Edit Existing Post' : 'Create a professional blog post'}</h1>
        <p>Add a title, content, tags, and a cover image.</p>
        {error && <div className="alert-error">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post title" required />
          <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Tags separated by commas" />
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your content here..." rows={14} required />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setImage(file || null);
              if (file) setPreview(URL.createObjectURL(file));
            }}
          />
          {preview && <img className="preview-image" src={preview} alt="Preview" />}
          <button className="button button-primary" disabled={saving} type="submit">
            {saving ? 'Saving...' : isEditMode ? 'Save changes' : 'Publish post'}
          </button>
        </form>
      </div>
    </section>
  );
}

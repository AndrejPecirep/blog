import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const ProfilePage = () => {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) return <Loader />;
  if (!user) return <p>Profile not available.</p>;

  return (
    <div className="page">
      <h1>Profile</h1>

      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>

      {user.bio && (
        <p><strong>Bio:</strong> {user.bio}</p>
      )}

      {user.avatarUrl && (
        <img
          src={user.avatarUrl}
          alt="Avatar"
          style={{ maxWidth: '150px', borderRadius: '50%' }}
        />
      )}
    </div>
  );
};

export default ProfilePage;

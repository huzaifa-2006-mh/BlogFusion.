'use client';

import { useState, useEffect } from 'react';

export default function Settings() {
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          setUsername(data.username);
          if (data.image) setProfilePic(data.image);
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };
    fetchProfile();
  }, []);

  const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePic(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: profilePic }),
      });
      if (res.ok) {
        alert('Profile saved successfully! Reloading...');
        window.location.reload();
      } else {
        alert('Failed to save profile.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1 className="mb-4">Profile Settings</h1>
      
      <div className="card" style={{ padding: '3rem', background: 'white', maxWidth: '600px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '150px', 
            height: '150px', 
            borderRadius: '50%', 
            background: '#eee', 
            margin: '0 auto 1.5rem',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid var(--secondary-color)'
          }}>
            {profilePic ? (
              <img src={profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '3rem' }}>{username ? username[0].toUpperCase() : '?'}</span>
            )}
          </div>
          <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
            Change Profile Picture
            <input type="file" hidden onChange={handlePicChange} accept="image/*" />
          </label>
        </div>

        <div className="form-group">
          <label>Username</label>
          <input type="text" value={username} disabled style={{ background: '#f0f0f0' }} />
        </div>

        <div className="form-group">
          <label>Display Name</label>
          <input type="text" placeholder={username ? username.charAt(0).toUpperCase() + username.slice(1) : ''} disabled style={{ background: '#f0f0f0' }} />
        </div>

        <button className="btn btn-primary" onClick={handleSave} disabled={isSaving} style={{ width: '100%' }}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

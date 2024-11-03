// src/pages/CreateEditContent.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Use useNavigate instead of useHistory
import { useDispatch } from 'react-redux';
import { addItem, updateItem } from '../redux/actions';
import { createMediaItem, getMediaItem, updateMediaItem } from '../services/api';

function CreateEditContent() {
  const { id } = useParams();
  const [form, setForm] = useState({ title: '', description: '', genre: '', uploadDate: '', status: 'Draft' });
  const dispatch = useDispatch();
  const navigate = useNavigate();  // Initialize useNavigate

  useEffect(() => {
    if (id) {
      getMediaItem(id).then(response => setForm(response.data)).catch(console.error);
    }
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (id) {
      const response = await updateMediaItem(id, form);
      dispatch(updateItem(response.data));
    } else {
      const response = await createMediaItem(form);
      dispatch(addItem(response.data));
    }
    navigate('/');  // Use navigate instead of history.push
  };

  return (
    <div>
      <h1>{id ? 'Edit' : 'Create'} Media Content</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required></textarea>
        <select name="genre" value={form.genre} onChange={handleChange}>
          <option value="Drama">Drama</option>
          <option value="Comedy">Comedy</option>
        </select>
        <input type="date" name="uploadDate" value={form.uploadDate} onChange={handleChange} required />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default CreateEditContent;

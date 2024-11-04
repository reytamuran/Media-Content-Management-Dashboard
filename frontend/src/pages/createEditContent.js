// src/pages/CreateEditContent.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem, updateItem } from '../redux/actions';
import { createMediaItem, getMediaItem, updateMediaItem } from '../services/api';
import './createEditContent.css';

function CreateEditContent() {
  const { id } = useParams();
  const [form, setForm] = useState({
    title: '',
    description: '',
    genre: 'Drama',
    uploadDate: '',
    status: 'Draft',
    thumbnail: null,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getMediaItem(id)
        .then(response => {
          setForm({
            ...response.data,
            thumbnail: null,
          });
        })
        .catch(console.error);
    }
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = e => {
    setForm({ ...form, thumbnail: e.target.files[0] });
  };

  const handleSubmit = async (status) => {
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('genre', form.genre);
      formData.append('uploadDate', form.uploadDate);
      formData.append('status', status);

      if (form.thumbnail) {
        formData.append('thumbnail', form.thumbnail);
      }

      if (id) {
        const response = await updateMediaItem(id, formData);
        dispatch(updateItem(response.data));
      } else {
        const response = await createMediaItem(formData);
        dispatch(addItem(response.data));
      }
      navigate('/content-listing');
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  return (
    <div className="container-edit">
      <h1 className="heading">{id ? 'Edit' : 'Create'} Media Content</h1>
      <form onSubmit={(e) => e.preventDefault()} className="form">
        <label className="label">Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="input"
        />
        <label className="label">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="textarea"
        />
        <label className="label">Genre</label>
        <select
          name="genre"
          value={form.genre}
          onChange={handleChange}
          required
          className="select"
        >
          <option value="Drama">Drama</option>
          <option value="Comedy">Comedy</option>
          <option value="Mystery">Mystery</option>
          <option value="Documentary">Documentary</option>
        </select>
        <label className="label">Upload Date</label>
        <input
          type="date"
          name="uploadDate"
          value={form.uploadDate}
          onChange={handleChange}
          required
          className="input"
        />
        <label className="label">Thumbnail</label>
        <input
          type="file"
          name="thumbnail"
          onChange={handleFileChange}
          accept="image/*"
          className="fileInput"
        />
        {form.thumbnail && (
          <img
            src={id ? form.thumbnail : URL.createObjectURL(form.thumbnail)}
            alt="Thumbnail"
            className="thumbnail-edit"
          />
        )}
        <div className="buttonContainer">
          <button type="button" onClick={() => handleSubmit('Draft')} className="button">
            Save as Draft
          </button>
          <button type="button" onClick={() => handleSubmit('Published')} className="publishButton">
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEditContent;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem, updateItem } from '../redux/actions';
import { createMediaItem, getMediaItem, updateMediaItem } from '../services/api';

function CreateEditContent() {
  const { id } = useParams();
  const [form, setForm] = useState({
    title: '',
    description: '',
    genre: 'Drama',
    uploadDate: '',
    status: 'Draft',
    thumbnail: null, // New field for thumbnail file
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      console.log(`Fetching item with ID: ${id}`);
      getMediaItem(id)
        .then(response => {
          console.log("Fetched item data:", response.data);
          setForm({
            ...response.data,
            thumbnail: null, // Clear thumbnail field initially
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
        formData.append('thumbnail', form.thumbnail); // Add the file if it exists
      }
  
      if (id) {
        const response = await updateMediaItem(id, formData); // Use FormData for PUT
        dispatch(updateItem(response.data));
      } else {
        const response = await createMediaItem(formData); // Use FormData for POST
        dispatch(addItem(response.data));
      }
      navigate('/content-listing');
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };
  

  return (
    <div>
      <h1>{id ? 'Edit' : 'Create'} Media Content</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <select name="genre" value={form.genre} onChange={handleChange} required>
          <option value="Drama">Drama</option>
          <option value="Comedy">Comedy</option>
          <option value="Mystery">Mystery</option>
          <option value="Documentary">Documentary</option>
        </select>
        <input
          type="date"
          name="uploadDate"
          value={form.uploadDate}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="thumbnail"
          onChange={handleFileChange}
          accept="image/*"
        />
        {form.thumbnail && (
          <img
            src={`http://localhost:5002/uploads/${form.thumbnail}`} // Path to show the image
            alt="Thumbnail"
            style={{ width: '100px', height: 'auto' }}
          />
        )}
        <div>
          <button type="button" onClick={() => handleSubmit('Draft')}>Save as Draft</button>
          <button type="button" onClick={() => handleSubmit('Published')}>Publish</button>
        </div>
      </form>
    </div>
  );
  
}

export default CreateEditContent;

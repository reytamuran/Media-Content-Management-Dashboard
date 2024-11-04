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
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getMediaItem(id)
        .then(response => {
          const item = response.data;
          setForm({
            ...item,
            thumbnail: null,
          });
          const thumbnailUrl = item.thumbnail.startsWith('/uploads/')
            ? `http://localhost:5002${item.thumbnail}`
            : item.thumbnail;
          setThumbnailPreview(thumbnailUrl);
        })
        .catch(err => console.error("Error fetching media item:", err));
    } else {
      setForm({
        title: '',
        description: '',
        genre: 'Drama',
        uploadDate: '',
        status: 'Draft',
        thumbnail: null,
      });
      setThumbnailPreview(null);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, thumbnail: file });
    setThumbnailPreview(URL.createObjectURL(file));
    setErrors({ ...errors, thumbnail: '' });
  };

  const validateForm = (status) => {
    const newErrors = {};
    if (!form.title) newErrors.title = "Title is required.";

    if (status === "Published") {
      if (!form.description) newErrors.description = "Description is required for publishing.";
      if (!form.uploadDate) newErrors.uploadDate = "Upload Date is required for publishing.";
      if (!form.thumbnail) newErrors.thumbnail = "Thumbnail is required for publishing.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status) => {
    if (!validateForm(status)) {
      return;
    }

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


  const handleCancel = () => {
    if (id) {
      navigate(`/content/${id}`); // Go to details page if in edit mode
    } else {
      navigate('/content-listing'); // Go to content listing page if in create mode
    }
  };

  return (
    <div className="container-edit">
      <h1 className="heading">{id ? 'Edit' : 'Create'} Item Content</h1>
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
        {errors.title && <p className="error">{errors.title}</p>}
        
        <label className="label">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="textarea"
        />
        {errors.description && <p className="error">{errors.description}</p>}
        
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
        {errors.uploadDate && <p className="error">{errors.uploadDate}</p>}
        
        <label className="label">Thumbnail</label>
        <input
          type="file"
          name="thumbnail"
          onChange={handleFileChange}
          accept="image/*"
          className="fileInput"
        />
        {errors.thumbnail && <p className="error">{errors.thumbnail}</p>}
        {thumbnailPreview && (
          <img
            src={thumbnailPreview}
            alt="Thumbnail Preview"
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
          <button type="button" onClick={handleCancel} className="cancelButton">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEditContent;

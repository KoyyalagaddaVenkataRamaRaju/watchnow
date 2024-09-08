import React, { useState, useEffect } from 'react';
import MovieCard from '../../components/MovieCard/MovieCard';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MovieForm.css'; 

const MovieForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    release_date: '',
    closing_date: '',
    director: '',
    genre: '',
    casting: '',
    motion_poster_url: '',
    location: '',
    show_timings: '',
    ticket_price: ''
  });

  const [movies, setMovies] = useState([]);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [showMovies, setShowMovies] = useState(false);
  const navigate = useNavigate();

  const goToSignin = () => {
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      genre: formData.genre.split(',').map(name => name.trim()),
      casting: formData.casting.split(',').map(name => name.trim()),
      location: formData.location.split(',').map(loc => loc.trim()),
      show_timings: formData.show_timings.split(',').map(time => time.trim()), // Split show timings into an array
    };

    try {
      if (editingMovieId) {
        await axios.put(`http://localhost:5001/api/movies/${editingMovieId}`, dataToSubmit);
        alert('Movie updated successfully!');
        setEditingMovieId(null);
      } else {
        await axios.post('http://localhost:5001/api/movies', dataToSubmit);
        alert('Movie added successfully!');
      }

      setFormData({
        title: '',
        release_date: '',
        closing_date: '',
        director: '',
        genre: '',
        casting: '',
        motion_poster_url: '',
        location: '',
        show_timings: '',
        ticket_price: ''
      });
      fetchMovies();
    } catch (error) {
      console.error('Error saving movie:', error.response ? error.response.data : error.message);
      alert('Failed to save movie.');
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/movies');
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const startEditing = (movie) => {
    setFormData({
      title: movie.title,
      release_date: movie.release_date.split('T')[0],
      closing_date: movie.closing_date.split('T')[0],
      director: movie.director,
      genre: movie.genre.join(', '),
      casting: movie.casting.join(', '),
      motion_poster_url: movie.motion_poster_url,
      location: movie.location.join(', '),
      show_timings: movie.show_timings.join(', '), // Join show timings array into a string
      ticket_price: movie.ticket_price
    });
    setEditingMovieId(movie._id);
  };

  const deleteMovie = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/movies/${id}`);
      alert('Movie deleted successfully!');
      fetchMovies();
    } catch (error) {
      console.error('Error deleting movie:', error);
      alert('Failed to delete movie.');
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const toggleShowMovies = () => {
    setShowMovies(!showMovies);
  };

  return (
    <div className="movie-form-container">
      <div className="header1">
        <div>
        <FaArrowLeft onClick={goToSignin} size={24}  />
      </div>
      <div>
      <h2>{editingMovieId ? 'Edit Movie' : 'Add New Movie'}</h2>
      </div>
      <div></div>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Release Date:</label>
          <input type="date" name="release_date" value={formData.release_date} onChange={handleChange} required />
        </div>
        <div>
          <label>Closing Date:</label>
          <input type="date" name="closing_date" value={formData.closing_date} onChange={handleChange} required />
        </div>
        <div>
          <label>Director:</label>
          <input type="text" name="director" value={formData.director} onChange={handleChange} required />
        </div>
        <div>
          <label>Genre (comma separated):</label>
          <input type="text" name="genre" value={formData.genre} onChange={handleChange} required />
        </div>
        <div>
          <label>Casting (comma separated):</label>
          <input type="text" name="casting" value={formData.casting} onChange={handleChange} required />
        </div>
        <div>
          <label>Motion Poster URL:</label>
          <input type="text" name="motion_poster_url" value={formData.motion_poster_url} onChange={handleChange} required />
        </div>
        <div>
          <label>Location (comma separated):</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </div>
        <div>
          <label>Show Timings (comma separated):</label>
          <input type="text" name="show_timings" value={formData.show_timings} onChange={handleChange} required />
        </div>
        <div>
          <label>Ticket Price:</label>
          <input type="number" name="ticket_price" value={formData.ticket_price} onChange={handleChange} required />
        </div>
        <button type="submit">{editingMovieId ? 'Update Movie' : 'Add Movie'}</button>
      </form>
      <hr />
      <button onClick={toggleShowMovies}>{showMovies ? 'Hide Movies' : 'Show All Movies'}</button>

      {showMovies && movies.length > 0 && (
        <div className="movie-list-container">
          <h2>Movie List</h2>
          <ul>
            {movies.map(movie => (
              <li key={movie._id}>
                <MovieCard key={movie._id} movies={movie} />
                <div>
                  <button onClick={() => startEditing(movie)}>Update Data</button>
                  <button className="delete-btn" onClick={() => deleteMovie(movie._id)}>Delete Movie</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MovieForm;
                                                                                                          
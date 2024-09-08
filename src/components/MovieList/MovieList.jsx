// src/components/MoviesList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from '../MovieCard/MovieCard';
import './MovieList.css';

const MoviesList = ({ searchQuery }) => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/movies');
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError('Failed to fetch movies.');
      }
    };

    fetchMovies();
  }, []);

  // Filter movies based on the search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(movies); // Show all movies if no search query
    }
  }, [searchQuery, movies]);

  return (
    <div>
      {error && <p>{error}</p>}
      <div className="movies-list1">
        {filteredMovies.length > 0 ? (
          filteredMovies.map(movie => (
            <MovieCard key={movie._id} movies={movie} />
          ))
        ) : (
          <p>No movies found</p>
        )}
      </div>
    </div>
  );
};

export default MoviesList;

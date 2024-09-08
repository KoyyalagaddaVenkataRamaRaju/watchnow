import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/home');
  };

  useEffect(() => {
    fetch(`http://localhost:5001/api/movies/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          setMovie(data);
        } else {
          throw new Error('No data found for this ID');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching movie details:', error);
        setError('Failed to load movie details.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <div>
      <div className="header2">
        <div className="arrow">
          <FaArrowLeft onClick={goToHome} size={24} />
        </div>
        <div>
          <h1>{movie.title}</h1>
        </div>
        <div></div>
      </div>
      <div className="movie-details">
        <div className="image-slider">
          <img src={movie.motion_poster_url} alt={movie.title} className="motion-poster" />
        </div>

        <div className="movie-details-section">
          <div className="movie-details-content">
            <p><strong>Director:</strong> {movie.director}</p>
            <p><strong>Release Date:</strong> {new Date(movie.release_date).toLocaleDateString()}</p>
            <p><strong>Genres:</strong> {movie.genre.join(', ')}</p>
            <p><strong>Cast:</strong> {movie.casting.join(', ')}</p>
            <p><strong>Ticket Price:</strong> ${movie.ticket_price}</p>
          </div>
          <Link to={`/booking/${movie._id}`} className="book-tickets">Book Tickets</Link>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;

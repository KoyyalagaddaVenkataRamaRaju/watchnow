// src/components/MovieCard.jsx
import React from 'react';
import "./MovieCard.css";
import { Link } from 'react-router-dom';

const MovieCard = ({ movies }) => {
  return (
    <>
    <Link to={`/details/${movies._id}`} className="details-link">
    <div className="card">
      <div className="card-img">
        <img src={movies.motion_poster_url} alt={`${movies.title} poster`} />
      </div>
      <div className="card-content">
        <h3 className="movie-name">{movies.title}</h3>
      </div>
    </div>
    </Link>
    </>
  );
};

export default MovieCard;

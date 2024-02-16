import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './style.css'; 
import { Link } from 'react-router-dom';


const MovieDetailedPage = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const { data } = await axios.get(`http://127.0.0.1:8000/api/movies/` +id);
        console.log("Movie Details:", data);
        setMovieDetails(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movieDetails) {
    return <div className="loading-container">Loading...</div>;
  }

  const { title, genre, description, language, rating,  image } = movieDetails;

  return (
    
    <div>
      
      <div className="movie-details-container">
      <h1 className="movie-title">{title}</h1>
      <img className="movie-image" src={image} alt={title} />
      <p className="movie-description">Description: {description}</p>

      <div className="details">
        <p className="detail-item"><strong>Genre:</strong> {genre}</p>
        <p className="detail-item"><strong>Language:</strong> {language}</p>
        <p className="detail-item"><strong>Rating:</strong> {rating}</p>
      </div>
      {/* <Link to={'/movie-theater/:movie_id'} className="book-now-link">Select Theater</Link>     */}
      <Link to={`/movie-theater/${id}`} className="book-now-link">Select Theater</Link>


    </div>
    </div>
  );
};

export default MovieDetailedPage;

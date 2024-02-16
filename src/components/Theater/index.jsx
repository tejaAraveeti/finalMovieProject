import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "./style.css";
import { Link } from 'react-router-dom';

const Theater = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { movie_id } = useParams();

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/movie-theater/`+ movie_id);
        console.log('Fetching theaters with URL:', response.config.url);

        if (Array.isArray(response.data.theaters)) {
          setTheaters(response.data.theaters);
        } else {
          console.error('Invalid data structure. Expected an array.');
          setError('Invalid data structure from the API:', response.data);
        }
      } catch (error) {
        console.error('Error fetching theaters:', error);
        setError(`An error occurred while fetching theaters. ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTheaters();
  }, [movie_id]); 

  if (loading) {
    return <div>Loading theaters...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
    <h2>Theaters for Movie {movie_id}</h2>
    <ul>
      {theaters.map((theater) => (
        <li key={theater.id}>
          <div className="theater-item">
            <h3>
            <Link to={`/movie-theater/${theater.id}/seat-page/${movie_id}`}>
          {theater.name}
        </Link>   </h3>
            <p>{theater.address}, {theater.city} - {theater.pincode}</p>
          </div>
        </li>
      ))}
    </ul>

    <Link to="/">
          <button>Home</button>
        </Link>
  </div>
  );
};

export default Theater;

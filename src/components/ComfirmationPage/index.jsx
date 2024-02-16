import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';

const ConfirmationPage = () => {
  const { theaterId, movieId, selectedSeats: urlSelectedSeats } = useParams();
  const location = useLocation();
  const confirmationDataString = new URLSearchParams(location.search).get('confirmationData');
  const confirmationData = confirmationDataString ? JSON.parse(decodeURIComponent(confirmationDataString)) : null;
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stateSelectedSeats, setStateSelectedSeats] = useState(urlSelectedSeats ? urlSelectedSeats.split(',') : []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    console.log('Effect: urlSelectedSeats changed', urlSelectedSeats);
    setStateSelectedSeats(urlSelectedSeats ? urlSelectedSeats.split(',') : []);
  }, [urlSelectedSeats]);

  useEffect(() => {
    console.log('Effect: confirmationData changed', confirmationData);
  }, [confirmationData]);

  console.log('State: stateSelectedSeats', stateSelectedSeats);

  if (!confirmationData) {
    console.error('Confirmation data is missing.');
    return (
      <div>
        <p>Error: Confirmation data is missing.</p>
      </div>
    );
  }

  console.log('Parsed Confirmation Data:', confirmationData);

  const { user, movie, seats, totalCost, bookingTime } = confirmationData;

const theaterDetails = movie?.theaters?.find((theater) => theater.id === parseInt(theaterId, 10));


  return (
    <div className="container">
      <div className="content-container">
        <h2>Confirmation Page</h2>
        <p>User: {user ? user.name : 'N/A'}</p>
        <p>Selected Seats: {seats.length > 0 ? seats.join(', ') : 'N/A'}</p>
        <p>Movie: {movie ? movie.title : 'N/A'}</p>
        <p>Total Cost: {totalCost ? `$${totalCost}` : 'N/A'}</p>
        <p>Booking Time: {bookingTime ? new Date(bookingTime).toLocaleString() : 'N/A'}</p>
        {/* <p>Theater: {theaterDetails ? theaterDetails.name : 'N/A'}</p>
        <p>Theater Address: {theaterDetails ? theaterDetails.address : 'N/A'}</p> */}
        <p>Current Time: {currentTime.toLocaleString()}</p>

        {movie && (
          <div className="movie-details">
            <h3>Movie Details</h3>
            <p>Title: {movie.title}</p>
            <p>Genre: {movie.genre}</p>
          </div>
        )}

        {movie && (
          <div className="movie-image">
            <img src={movie.image} alt="Movie Poster" />
          </div>
        )}
      </div>

      <Link to="/">
        <button>Home</button>
      </Link>
    </div>
  );
};

export default ConfirmationPage;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './style.css';

const BookingPage = () => {
  const { movie_id: movieId, theater_id: theaterId, selected_seats: selectedSeatsString } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [theaterDetails, setTheaterDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch movie details
        const movieDetailsResponse = await fetch(`http://127.0.0.1:8000/api/movies/${movieId}`);
        if (!movieDetailsResponse.ok) {
          throw new Error(`Error fetching movie details: ${movieDetailsResponse.status} ${movieDetailsResponse.statusText}`);
        }
        const movieDetailsData = await movieDetailsResponse.json();
        setMovieDetails(movieDetailsData);

        const theaterDetailsResponse = await fetch(`http://127.0.0.1:8000/api/theater-seat/${theaterId}/`);
        if (!theaterDetailsResponse.ok) {
          throw new Error(`Error fetching theater details: ${theaterDetailsResponse.status} ${theaterDetailsResponse.statusText}`);
        }
        const theaterDetailsData = await theaterDetailsResponse.json();

        setTheaterDetails({
          name: theaterDetailsData.name,
          address: theaterDetailsData.address,
          seats: selectedSeats.map(seatNumber => {
            const matchingSeat = theaterDetailsData.seats.find(seat => seat.seat_number === seatNumber);
            return {
              seat_number: seatNumber,
              price: matchingSeat ? matchingSeat.price : 0, 
            };
          }),
        });
      } catch (error) {
        console.error('Error during data fetching:', error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [movieId, theaterId]);

  useEffect(() => {
    if (selectedSeatsString) {
      const seatsArray = selectedSeatsString.split(',');
      setSelectedSeats(seatsArray);
    }
  }, [selectedSeatsString]);

  const handleConfirmBooking = async () => {
    try {
      const access_token = localStorage.getItem('access_token');
      if (!access_token) {
        console.log('Access Token is missing or expired. Redirecting to login.');
        navigate('/login');
        return;
      }
  
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      };
  
      const response = await fetch('http://127.0.0.1:8000/api/booking/', {
        method: 'GET',
        headers: headers,
      });
  
      const responseData = await response.json(); 
  
      console.log('Response status:', response.status);
      console.log('Response data:', responseData);
        const selectedSeatsPrices = selectedSeats.map(seatNumber => {
      const matchingSeat = theaterDetails.seats.find(seat => seat.seat_number === seatNumber);
      return matchingSeat ? matchingSeat.price : 0;
    });

  
      if (response.ok) {
        console.log('Booking data retrieved successfully:', responseData);
  
        if (responseData.length === 0) {
          console.log('No booking data found.');
          return;
        }
  
        const confirmationData = {
          user: responseData[0].user,
          movie: movieDetails, 
          seats: selectedSeats,
          totalCost: responseData[0].total_cost,
          bookingTime: responseData[0].booking_time,
        };
  
        const confirmationDataString = encodeURIComponent(JSON.stringify(confirmationData));
        console.log('theaterId:', theaterId);
console.log('movieId:', movieId);
console.log('selectedSeats:', selectedSeats);

        navigate(`/confirmation/${theaterId}/${movieId}/${selectedSeats.join(',')}?confirmationData=${confirmationDataString}`);
      } else if (response.status === 401) {
        console.log('Unauthorized. Redirect to login or handle accordingly.');
        navigate('/login');
      } else {
        console.log(`Error fetching booking data: ${response.status} ${response.statusText}`);
        const errorResponse = responseData; 
        console.log('Error Response:', errorResponse);
        throw new Error(`Error fetching booking data: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching booking data:', error.message);
    }
  };
  
  
  return (
    <div className="container">
      <div className="image-container">
        {movieDetails && <img src={movieDetails.image} alt="Movie Poster" />}
      </div>
      <div className="content-container">
        <h2>Booking Page</h2>
        <p>Movie ID: {movieId}</p>
        <p>Theater ID: {theaterId}</p>
<p>Selected Seats: {Array.isArray(selectedSeats) ? selectedSeats.join(', ') : selectedSeats}</p>

        {/* <p>Selected Seats: {selectedSeats.join(',')}</p> */}
        {theaterDetails && (
          <div>
            {theaterDetails.seats && (
              <ul>
                {theaterDetails.seats.map((seat) => (
                  <li key={seat.id}>{seat.name} - Price: ${seat.price}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        {movieDetails && (
          <div>
            <h3>Movie Details</h3>
            <p>Title: {movieDetails.title}</p>
            <p>Genre: {movieDetails.genre}</p>
          </div>
        )}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <button onClick={() => handleConfirmBooking()}>Confirm Booking</button>
          </div>
        )}
        <Link to="/">
          <button>Home</button>
        </Link>
      </div>
    </div>
  );
};

export default BookingPage;

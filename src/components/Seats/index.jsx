import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair } from '@fortawesome/free-solid-svg-icons';
import "./Seats.css";
import { Link } from 'react-router-dom';
const Seat = () => {
  
  const [theaterSeats, setTheaterSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();
  const { theater_id, movie_id } = useParams();

  const fetchTheaterSeats = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/theater-seat/${theater_id}/`);

      if (Array.isArray(response.data.theaters)) {
        const seatsData = response.data.theaters.find(theater => theater.theater_id === parseInt(theater_id, 10));

        if (seatsData) {
          setTheaterSeats(seatsData.seats);
        } else {
          setError('Theater not found.');
        }
      } else {
        console.error('Invalid data structure. Expected an array of theaters.');
        setError('Invalid data structure from the API.');
      }
    } catch (error) {
      console.error(`Error fetching seats for theater ID ${theater_id}.`, error);
      setError('An error occurred while fetching seats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheaterSeats();
  }, [theater_id]);

  const handleSeatSelect = (seatNumber) => {
    console.log('Selected Seats:', selectedSeats);

    const isSeatSelected = selectedSeats.includes(seatNumber);
  
    if (isSeatSelected) {
      const updatedSeats = selectedSeats.filter((selectedSeat) => selectedSeat !== seatNumber);
      console.log('Updated Seats (Remove):', updatedSeats);
      setSelectedSeats(updatedSeats);
    } else {
      const updatedSeats = [...selectedSeats, seatNumber];
      console.log('Updated Seats (Add):', updatedSeats);
      setSelectedSeats(updatedSeats);
    }
  };
  
  
  
  
  
  
  
  

  const isBookNowVisible = selectedSeats.length > 0;

  const handleBookNow = () => {
    console.log('Theater ID:', theater_id);
    console.log('Movie ID:', movie_id);
    console.log('Selected Seats:', selectedSeats);
    navigate(`/booking-page/${theater_id}/${movie_id}/${selectedSeats.join(',')}`);
  };
  

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchTheaterSeats();
  };

  if (loading) {
    return <div>Loading seats... <button onClick={handleRetry}>Retry</button></div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Seats for Theater {theater_id}</h2>
      <div className="seat-container">
      {theaterSeats.map((seat) => {
  const individualSeats = seat.seat_number.split(',').filter(Boolean); 

  return individualSeats.map((individualSeat) => (
    <div
      key={seat.id + '-' + individualSeat}
      className={`seat ${selectedSeats.includes(individualSeat) ? 'selected-seat' : ''}`}
      onClick={() => handleSeatSelect(individualSeat)}
    >
      {/* Render the rest of your seat content here */}
      <div className={`fa-chair ${selectedSeats.includes(individualSeat) ? 'selected-chair' : ''}`}>
        <FontAwesomeIcon icon={faChair} size="lg" />
      </div>
      <div className="seat-number-container">
        <span className={`seat-number-overlay ${selectedSeats.includes(individualSeat) ? 'selected-number' : ''}`}>
          {individualSeat}
        </span>
      </div>
      <div className="category-price">
        <p className='category'>Category: {seat.category}</p>
        <p className='price'>Price: {seat.price}</p>
      </div>
    </div>
  ));
})}
      </div>

      {isBookNowVisible && (
        <button onClick={handleBookNow}>Book Now</button>
      )}
      <Link to="/">
          <button>Home</button>
        </Link>
    </div>
  
  );
};

export default Seat;
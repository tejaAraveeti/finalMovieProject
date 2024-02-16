import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import MovieDetailsPage from './pages/MovieDetails';
import HomePage from './pages/HomePage';
import LoginPage from './components/LoginPage';
import MovieList from './components/MovieList';
import Seat from './components/Seats';
import SignupPage from './components/SignupPage';
import Theater from './components/Theater';
import BookingPage from './components/BookingPage';
import TheaterPage from './pages/TheaterPage';
import SeatPage from './pages/SeatPage';
import ConfirmationPage from "./components/ComfirmationPage" // Corrected file name

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element = {<HomePage/>} />
        
        <Route path = "/login" element = {<LoginPage/>} />
        <Route path = "/signup" element = {<SignupPage/>} />

        <Route path ={"/movies"} element = {<MovieList/>}></Route>
        <Route path ={"/movies/details/:id"} element = {<MovieDetailsPage/>}></Route>
        <Route path={"/movie-theater/:movie_id"} element={<TheaterPage />} />       
        <Route path={"/movie-theater/:theater_id/seat-page/:movie_id"} element={<SeatPage />} />
        <Route path={"/booking-page/:theater_id/:movie_id/:selected_seats"} element={<BookingPage />} />
        <Route path={"/confirmation/:movie_id/:theater_id/:selected_seats"} element={<ConfirmationPage/>} />
      

        </Routes>  
      </BrowserRouter>
    </div>
  );
}

export default App;

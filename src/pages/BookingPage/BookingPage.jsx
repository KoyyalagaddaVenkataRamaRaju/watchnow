import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BookingPage.css';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';

const BookingPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTiming, setSelectedTiming] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [showTicket, setShowTicket] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [blockedSeats, setBlockedSeats] = useState([]);
  const [user, setUser] = useState(null); // Added user state
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/home');
  };

  useEffect(() => {
    // Fetch user data from local storage or context
    const userData = JSON.parse(localStorage.getItem('user')); // Example method
    setUser(userData);

    // Fetch movie details
    fetch(`http://localhost:5001/api/movies/${id}`)
      .then(response => response.json())
      .then(data => {
        setMovie(data);

        // Fetch blocked seats
        fetch(`http://localhost:5001/api/movies/${id}/blocked-seats?show_time=${selectedTiming}`)
          .then(res => {
            if (!res.ok) throw new Error('Failed to fetch blocked seats');
            return res.json();
          })
          .then(seatData => {
            // Ensure blockedSeats is an array
            const seatsArray = Array.isArray(seatData.blockedSeats) ? seatData.blockedSeats : [];
            setBlockedSeats(seatsArray);
          })
          .catch(error => {
            console.error('Error fetching blocked seats:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching movie details:', error);
      });
  }, [id, selectedTiming]);

  // Handle seat selection
  const handleSeatSelection = (row, col) => {
    const seat = `${row}${col}`;
    // Check if blockedSeats is an array before using includes
    if (Array.isArray(blockedSeats) && blockedSeats.includes(seat)) return;

    setSelectedSeats(prevSeats => {
      if (prevSeats.includes(seat)) {
        return prevSeats.filter(s => s !== seat);
      } else {
        return [...prevSeats, seat];
      }
    });
  };

  // Calculate total cost based on selected seats and ticket price
  useEffect(() => {
    if (movie) {
      const cost = selectedSeats.length * movie.ticket_price;
      setTotalCost(cost);
    }
  }, [selectedSeats, movie]);

  // Generate an array of dates between release and closing date
  const generateDateRange = (startDate, endDate) => {
    const dateArray = [];
    let currentDate = new Date(startDate);
    const closingDate = new Date(endDate);

    while (currentDate <= closingDate) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
  };

  // Handle booking submission
  const handleBooking = () => {
    if (!user) {
      alert('User not logged in. Please log in to proceed.');
      return;
    }
  
    if (!selectedLocation || !selectedDate || !selectedTiming || selectedSeats.length === 0) {
      alert('Please select all required fields and seats.');
      return;
    }
  
    const bookingData = {
      movieId: id,
      movieTitle: movie.title,
      poster: movie.motion_poster_url,
      location: selectedLocation,
      date: selectedDate,
      timing: selectedTiming,
      seats: selectedSeats,
      numberOfTickets: selectedSeats.length,
      totalAmount: totalCost,
    };
  
    fetch(`http://localhost:5001/api/movies/${id}/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include JWT token in header
      },
      body: JSON.stringify({
        location: selectedLocation,
        show_time: selectedTiming,
        date: selectedDate,
        seats: selectedSeats,
      }),
    })
      .then(response => response.json())
      .then(data => {
        setTicketData({
          ...bookingData,
          price: data.booking.price // Ensure this maps to your response
        });
        setShowTicket(true);
  
        setTimeout(() => {
          navigate('/cart', { state: { ticket: bookingData } });
        }, 1000);
      })
      .catch(error => {
        console.error('Error during booking:', error);
      });
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  const availableDates = movie ? generateDateRange(movie.release_date, movie.closing_date) : [];

  return (
    <div className="booking-page">
      <div className="booking-img">
        <div className="header3">
          <div className="arrow">
            <FaArrowLeft onClick={goToHome} size={18} />
          </div>
          <h1>{movie.title}</h1>
        </div>
        <img src={movie.motion_poster_url} alt={movie.title} className="motion-poster" />
      </div>

      <div className="booking-content">
        <div className="selection-section">
          <label>Location:</label>
          <select onChange={(e) => setSelectedLocation(e.target.value)} value={selectedLocation}>
            <option value="">Select Location</option>
            {movie.location.map((loc, index) => (
              <option key={index} value={loc}>{loc}</option>
            ))}
          </select>

          <label>Date:</label>
          <select onChange={(e) => setSelectedDate(e.target.value)} value={selectedDate}>
            <option value="">Select Date</option>
            {availableDates.map((date, index) => (
              <option key={index} value={date.toISOString().split('T')[0]}>
                {date.toDateString()}
              </option>
            ))}
          </select>

          <label>Show Timings:</label>
          <select onChange={(e) => setSelectedTiming(e.target.value)} value={selectedTiming}>
            <option value="">Select Timing</option>
            {movie.show_timings.map((time, index) => (
              <option key={index} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <div className="seat-selection">
          <h3>Select your seats:</h3>
          <div className="seat-grid">
            {Array.from({ length: 10 }, (_, rowIdx) => {
              const rowLabel = String.fromCharCode(65 + rowIdx);
              return (
                <React.Fragment key={rowLabel}>
                  {Array.from({ length: 10 }, (_, colIdx) => {
                    const colLabel = colIdx + 1;
                    const seat = `${rowLabel}${colLabel}`;
                    const isSelected = selectedSeats.includes(seat);
                    const isBlocked = blockedSeats.includes(seat);
                    return (
                      <div
                        key={seat}
                        className={`seat ${isBlocked ? 'blocked' : isSelected ? 'selected' : 'available'}`}
                        onClick={() => handleSeatSelection(rowLabel, colLabel)}
                      >
                        {seat}
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="ticket-cost">
          <h3>Total Cost: ₹{totalCost}</h3>
        </div>

        <button className="book-tickets-btn" onClick={handleBooking}>
          Book Tickets
        </button>
      </div>

      {showTicket && (
        <div className="ticket-card">
          <span className="close" onClick={() => setShowTicket(false)}>x</span>
          <div className="ticket-details">
            <div className="poster">
              <img src={ticketData?.poster} alt={ticketData?.movieTitle} />
            </div>
            <div className="details">
              <h2>{ticketData?.movieTitle}</h2>
              <p>Location: {ticketData?.location}</p>
              <p>Date: {ticketData?.date}</p>
              <p>Show Time: {ticketData?.timing}</p>
              <p>Seats: {ticketData?.seats.join(', ')}</p>
              <p>Price: ₹{ticketData?.price}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;

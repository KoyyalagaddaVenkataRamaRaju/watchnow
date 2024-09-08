import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CartPage.css'; // Assuming you'll style the cart page
import { FaArrowLeft } from 'react-icons/fa';

const CartPage = () => {
  const location = useLocation();
  const ticket = location.state?.ticket; // Retrieve the ticket data passed from the BookingPage
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/home');
  };

  if (!ticket) {
    return (
      <div>
        <h2>No ticket found</h2>
        <button onClick={goToHome}>Go Back to Home</button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <FaArrowLeft onClick={goToHome} size={18} className="back-arrow" />
        <h2>Your Ticket</h2>
      </div>
      
      <div className="ticket-details">
        <img src={ticket.poster} alt={ticket.movieTitle} className="ticket-poster" />
        <div className="ticket-info">
          <h3>{ticket.movieTitle}</h3>
          <p><strong>Location:</strong> {ticket.location}</p>
          <p><strong>Date:</strong> {ticket.date}</p>
          <p><strong>Timing:</strong> {ticket.timing}</p>
          <p><strong>Seats:</strong> {ticket.seats.join(', ')}</p>
          <p><strong>Total Tickets:</strong> {ticket.numberOfTickets}</p>
          <p><strong>Total Amount:</strong> ₹{ticket.totalAmount}</p>
        </div>
      </div>

      <button className="checkout-btn">Proceed to Checkout</button>
    </div>
  );
};

export default CartPage;

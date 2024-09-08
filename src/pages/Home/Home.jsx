// src/pages/Home/Home.jsx
import React, { useState } from "react";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import MoviesList from "../../components/MovieList/MovieList";

function Home() {
  const [searchQuery, setSearchQuery] = useState(''); // Manage search query in Home

  return (
    <div className="home">
      {/* Pass searchQuery and setSearchQuery as props to Navbar */}
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <h1>Movies</h1>
      {/* Pass searchQuery as a prop to MoviesList */}
      <MoviesList searchQuery={searchQuery} />
      <Footer />
    </div>
  );
}

export default Home;

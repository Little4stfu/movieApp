import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext.js';

import AppNavbar from './components/AppNavbar.js';
import Home from './pages/Home.js';
import Register from './pages/Register.js';
import Login from './pages/Login.js';
import Logout from './pages/Logout.js';
import MoviePage from './pages/Movie.js';
import AddMoviePage from './pages/AddMovie.js';

// Update API base URL
const API_URL = "https://movieapp-api-lms1.onrender.com";

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null,
  });

  const unsetUser = () => {
    localStorage.clear();
    setUser({
      id: null,
      isAdmin: null,
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API_URL}/users/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.user) {
            setUser({
              id: data.user._id,
              isAdmin: data.user.isAdmin,
            });
          } else {
            unsetUser();
          }
        })
        .catch(() => unsetUser());
    }
  }, []);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/Movie" element={<MoviePage />} />
            <Route path="/add-movie" element={<AddMoviePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;

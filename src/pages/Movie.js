import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Card, Row, Col, Form, Table } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'notyf/notyf.min.css';
import axios from 'axios';

export default function MoviePage() {
  const { user } = useContext(UserContext);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Array of image URLs for the random pictures
  const imageArray = [
    'https://i.pinimg.com/736x/27/33/8c/27338cb2e255dfaeb5c03967434daf09.jpg',
    'https://i.pinimg.com/736x/8f/ba/27/8fba277cacaed8a8cd5e11dbccf59aa7.jpg',
    'https://i.pinimg.com/736x/a6/80/35/a68035e09b159ee6767ce52a874b2c4e.jpg',
    'https://i.pinimg.com/736x/fc/fa/40/fcfa401c77b4ca36eaf35432b5e73a8e.jpg',
    'https://i.pinimg.com/736x/ab/bc/38/abbc38db1458bed8fec7f0394cf10015.jpg',
    'https://i.pinimg.com/736x/42/d4/88/42d488faa741aebfa5856d07fb3cb35e.jpg',
    'https://i.pinimg.com/736x/7c/21/db/7c21dbdf5870a32a3e5fa570f9c770e8.jpg',
    'https://i.pinimg.com/736x/3c/18/72/3c18721883f54064ead28a8df5e8329b.jpg',
    'https://i.pinimg.com/736x/85/53/dd/8553ddd316e61fe8f4830fa980ab18d6.jpg',
    'https://i.pinimg.com/736x/d5/28/52/d52852dc29b001b7934ea357235c5113.jpg',
    'https://i.pinimg.com/736x/9c/63/77/9c6377500eb28d032c8d784b38cddd65.jpg',
    'https://i.pinimg.com/736x/8e/fd/40/8efd40188e5183beea1a0a2ae2a34ac0.jpg',
  ];

  useEffect(() => {
    // Fetch the list of movies when the component mounts
    const fetchMovies = async () => {
      try {
        const response = await axios.get('https://movieapp-api-lms1.onrender.com/movies/getMovies');
        setMovies(response.data.movies);
      } catch (error) {
        setError('Error fetching movies');
        console.error(error);
      }
    };
    fetchMovies();
  }, []);

  const handleAddMovie = () => {
    navigate('/add-movie');
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      await axios.delete(`https://movieapp-api-lms1.onrender.com/movies/deleteMovie/${movieId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMovies(movies.filter((movie) => movie._id !== movieId)); // Remove movie from state
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  const handleAddComment = async (movieId, comment) => {
    try {
      await axios.patch(
        `https://movieapp-api-lms1.onrender.com/movies/addComment/${movieId}`,
        { comment },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      // Refresh the movies after adding comment
      const updatedMovies = [...movies];
      const movieIndex = updatedMovies.findIndex((movie) => movie._id === movieId);
      if (movieIndex !== -1) {
        updatedMovies[movieIndex].comments.push({ userId: user.id, comment });
        setMovies(updatedMovies);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <Container>
      <h1>Movies</h1>
      {error && <p>{error}</p>}

      {user && user.isAdmin ? (
        <div>
          <Button variant="primary" onClick={handleAddMovie} className="mb-3">
            Add Movie
          </Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Genre</th>
                <th>Year</th>
                <th>Comments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie._id}>
                  <td>{movie.title}</td>
                  <td>{movie.description}</td>
                  <td>{movie.genre}</td>
                  <td>{movie.year}</td>
                  <td>
                    {movie.comments.length > 0 ? (
                      <ul>
                        {movie.comments.map((comment, idx) => (
                          <li key={idx}>
                            {comment.comment} - <em>{comment.userId}</em>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No comments yet</p>
                    )}
                  </td>
                  <td>
                    <Button variant="warning" onClick={() => handleDeleteMovie(movie._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div>
          <Row xs={1} md={2} lg={3} className="g-4">
            {movies.map((movie) => {
              // Randomly pick an image from the array
              const randomImage = imageArray[Math.floor(Math.random() * imageArray.length)];

              return (
                <Col key={movie._id}>
                  <Card>
                    <Card.Img variant="top" src={randomImage} alt="Movie poster" />
                    <Card.Body>
                      <Card.Title>{movie.title}</Card.Title>
                      <Card.Text>{movie.description}</Card.Text>
                      <p><strong>Genre:</strong> {movie.genre} | <strong>Year:</strong> {movie.year}</p>
                      <h6>Comments:</h6>
                      {movie.comments.length > 0 ? (
                        <ul>
                          {movie.comments.map((comment, idx) => (
                            <li key={idx}>
                              {comment.comment} - <em>{comment.userId}</em>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No comments yet</p>
                      )}
                      {user && !user.isAdmin && (
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Add a comment"
                          onBlur={(e) => handleAddComment(movie._id, e.target.value)}
                        />
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      )}
    </Container>
  );
}

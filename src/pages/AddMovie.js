import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBInput,
  MDBIcon,
} from 'mdb-react-ui-kit';

const AddMoviePage = () => {
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const movieData = {
      title,
      director,
      year,
      description,
      genre,
      comments: comments ? comments.split(",") : [], // assuming comments are input as comma separated
    };

    try {
      const response = await axios.post(
        "https://movieapp-api-lms1.onrender.com/movies/addMovie",
        movieData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // assuming token is saved in localStorage
          },
        }
      );

      if (response.status === 201) {
        alert("Movie added successfully!");
        navigate("/movies"); // Redirect to the movie list page after success
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : "Internal Server Error");
    }
  };

  return (
    <MDBContainer fluid>
      <MDBCard className='text-black m-5' style={{ borderRadius: '25px' }}>
        <MDBCardBody>
          <MDBRow>
            {/* Left Column - Movie Form */}
            <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>
              <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Add a New Movie</p>

              {error && <p style={{ color: 'red' }}>{error}</p>}

              {/* Movie Title */}
              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="film me-3" size='lg' />
                <MDBInput label='Movie Title' id='form1' type='text' className='w-100' value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              {/* Director */}
              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="user me-3" size='lg' />
                <MDBInput label='Director' id='form2' type='text' className='w-100' value={director} onChange={(e) => setDirector(e.target.value)} />
              </div>

              {/* Year */}
              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="calendar-alt me-3" size='lg' />
                <MDBInput label='Year of Release' id='form3' type='number' className='w-100' value={year} onChange={(e) => setYear(e.target.value)} />
              </div>

              {/* Description */}
              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="align-left me-3" size='lg' />
                <MDBInput label='Description' id='form4' type='text' className='w-100' value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              {/* Genre */}
              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="tags me-3" size='lg' />
                <MDBInput label='Genre' id='form5' type='text' className='w-100' value={genre} onChange={(e) => setGenre(e.target.value)} />
              </div>

              {/* Comments */}
              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="comment me-3" size='lg' />
                <MDBInput label='Comments (comma separated)' id='form6' type='text' className='w-100' value={comments} onChange={(e) => setComments(e.target.value)} />
              </div>

              {/* Submit Button */}
              <MDBBtn className='mb-4' size='lg' onClick={handleSubmit}>Add Movie</MDBBtn>
            </MDBCol>

            {/* Right Column - Image */}
            <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
              <MDBCardImage src='https://i.pinimg.com/736x/60/cd/7f/60cd7fefd91ee9aff32488c435477c30.jpg' fluid />
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default AddMoviePage;

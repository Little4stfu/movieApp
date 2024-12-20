import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'notyf/notyf.min.css';

export default function Register() {
    const notyf = new Notyf();
    const { user } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isActive, setIsActive] = useState(false);

    const API_URL = 'https://movieapp-api-lms1.onrender.com';

    // Validate inputs and enable the submit button if all fields are valid
    useEffect(() => {
        const isValidEmail = email.includes('@'); // Email must include '@'
        const isPasswordValid = password.length >= 8; // Password must be at least 8 characters
        const isFormValid = isValidEmail && isPasswordValid && password === confirmPassword;

        setIsActive(isFormValid);
    }, [email, password, confirmPassword]);

    const registerUser = (e) => {
        e.preventDefault();

        fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message === 'Registered Successfully') {
                    // Clear input fields
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');

                    notyf.success('Registration successful');
                } else if (data.error) {
                    notyf.error(data.error);
                } else {
                    notyf.error('An error occurred. Please try again.');
                }
            })
            .catch((err) => {
                console.error(err);
                notyf.error('Server error. Please try again later.');
            });
    };

    return user.id !== null ? (
        <Navigate to="/" />
    ) : (
        <Form onSubmit={registerUser}>
            <h1 className="my-5 text-center">Register</h1>

            <Form.Group>
                <Form.Label>Email:</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Password:</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Confirm Password:</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </Form.Group>

            {isActive ? (
                <Button variant="primary" type="submit" id="submitBtn">
                    Submit
                </Button>
            ) : (
                <Button variant="danger" type="submit" id="submitBtn" disabled>
                    Submit
                </Button>
            )}
        </Form>
    );
}

import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'notyf/notyf.min.css';

import { Notyf } from 'notyf';

export default function Login() {
    const notyf = new Notyf();
    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(false);

    const API_URL = 'https://movieapp-api-lms1.onrender.com';

    const authenticate = (e) => {
        e.preventDefault();

        fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.access) {
                    // Save token to local storage
                    localStorage.setItem('token', data.access);
                    retrieveUserDetails(data.access);
                    setEmail('');
                    setPassword('');
                    notyf.success('Successful Login');
                } else if (data.message === 'Email and password do not match') {
                    notyf.error('Incorrect Credentials. Try Again');
                } else if (data.error === 'No Email Found') {
                    notyf.error('User Not Found. Try Again.');
                } else {
                    notyf.error('An error occurred. Please try again.');
                }
            })
            .catch((err) => {
                console.error(err);
                notyf.error('Server error. Please try again later.');
            });
    };

    const retrieveUserDetails = (token) => {
        fetch(`${API_URL}/users/details`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    setUser({
                        id: data.user._id,
                        isAdmin: data.user.isAdmin,
                    });
                } else {
                    notyf.error('Failed to retrieve user details.');
                }
            })
            .catch((err) => {
                console.error(err);
                notyf.error('An error occurred while fetching user details.');
            });
    };

    useEffect(() => {
        setIsActive(email !== '' && password !== '');
    }, [email, password]);

    return user.id !== null ? (
        <Navigate to="/" />
    ) : (
        <Form onSubmit={authenticate}>
            <h1 className="my-5 text-center">Login</h1>
            <Form.Group>
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>

            <Button variant={isActive ? 'primary' : 'danger'} type="submit" disabled={!isActive}>
                Login
            </Button>
        </Form>
    );
}

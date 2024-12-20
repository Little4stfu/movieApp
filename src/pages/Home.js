import { useNavigate } from 'react-router-dom';
import Banner from '../components/Banner.js';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
    const navigate = useNavigate(); // Hook for navigation

    const data = {
        title: "Zuitt Movie",
        content: "Enjoy your weekend with us",
        destination: "/Movie",
    }

    const handleNavigate = () => {
        navigate("/Movie"); // Navigate to the /Movie page
    };

    return (
        <div className="container text-center py-5">
            <Banner data={data} />

            {/* Adding image */}
            <div className="my-5">
                <img 
                    src="https://i.pinimg.com/736x/2e/12/69/2e12693d3f5556a62eca2251897e8655.jpg" 
                    alt="Movie Night" 
                    className="img-fluid rounded shadow-lg"
                />
            </div>

            <div className="row mt-5">
                <div className="col-12 col-md-6 bg-danger text-dark p-4">
                    <h2 className="display-4">Why Zuitt Movie?</h2>
                    <p className="lead text-dark">
                        Relax and unwind with a great movie selection, perfect for your weekend!
                    </p>
                </div>
                <div className="col-12 col-md-6 bg-dark text-danger p-4">
                    <h2 className="display-4">What We Offer</h2>
                    <ul className="list-unstyled text-danger">
                        <li>Top-rated movies</li>
                        <li>Curated movie collections</li>
                        <li>Seamless viewing experience</li>
                    </ul>
                </div>
            </div>

            {/* Button to navigate to /Movie */}
            <div className="mt-4">
                <button onClick={handleNavigate} className="btn btn-danger btn-lg">
                    Go to Movies
                </button>
            </div>
        </div>
    );
}

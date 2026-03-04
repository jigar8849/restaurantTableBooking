import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md rounded-b-2xl px-8 py-4 flex justify-between items-center mb-8">
            <Link to="/" className="text-2xl font-bold text-primary-600 tracking-tight">
                Gourmet Reserve
            </Link>

            <div className="space-x-6 flex items-center">
                {user ? (
                    <>
                        <span className="text-gray-600 font-medium">Hello, {user.name}</span>
                        {user.role === 'customer' && (
                            <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 transition">Dashboard</Link>
                        )}
                        {user.role === 'employee' && (
                            <Link to="/employee" className="text-gray-600 hover:text-primary-600 transition">Workstation</Link>
                        )}
                        {user.role === 'admin' && (
                            <Link to="/admin" className="text-gray-600 hover:text-primary-600 transition">Admin Panel</Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="bg-primary-100 text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-200 transition"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-600 hover:text-primary-600 transition font-medium">Login</Link>
                        <Link to="/register" className="bg-primary-600 text-white px-5 py-2 rounded-full hover:bg-primary-700 transition shadow-md">
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

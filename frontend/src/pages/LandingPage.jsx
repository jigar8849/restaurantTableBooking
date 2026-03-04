import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
            <motion.h1
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl font-bold text-primary-800 mb-6"
            >
                Welcome to Gourmet Reserve
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-gray-600 mb-10 max-w-2xl"
            >
                Experience fine dining with effortless table booking. Manage your reservations, services, and enjoy your meal.
            </motion.p>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 }}
                className="space-x-4"
            >
                <Link to="/login" className="bg-primary-600 text-white px-8 py-3 rounded-full hover:bg-primary-700 transition shadow-lg text-lg">
                    Login
                </Link>
                <Link to="/register" className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-full hover:bg-primary-50 transition shadow-lg text-lg">
                    Sign Up
                </Link>
            </motion.div>
        </div>
    );
};

export default LandingPage;

import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [tables, setTables] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [date, setDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [partySize, setPartySize] = useState(2);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([fetchTables(), fetchMyBookings()]);
            setPageLoading(false);
        };
        loadData();
    }, []);

    const fetchTables = async () => {
        try {
            const { data } = await api.get('/tables');
            setTables(data);
        } catch (error) {
            console.error("Error fetching tables", error);
        }
    };

    const fetchMyBookings = async () => {
        try {
            const { data } = await api.get('/bookings/mybookings');
            setBookings(data);
        } catch (error) {
            console.error("Error fetching bookings", error);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // 1. Create Booking
            const bookingRes = await api.post('/bookings', {
                tableId: selectedTable,
                date,
                timeSlot,
                partySize
            });

            // Simulate Demo Payment Processing
            setTimeout(() => {
                setMessage({ type: 'success', text: 'Booking request sent! (Demo Mode: Payment skipped)' });
                fetchMyBookings();
                setLoading(false);
                // Reset form
                setSelectedTable(null);
                setDate('');
                setTimeSlot('');
                setPartySize(2);
            }, 1500);

        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Booking Failed' });
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-primary-800 mb-8">My Dashboard</h1>

            {pageLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Booking Form */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold mb-4 text-gray-700">Book a Table</h2>
                        {message && (
                            <div className={`p-3 rounded mb-4 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}
                        <form onSubmit={handleBooking} className="space-y-4">
                            <div>
                                <label className="block text-gray-600 mb-1 text-sm font-medium">Select Table</label>
                                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                                    {tables.map(table => (
                                        <div
                                            key={table._id}
                                            onClick={() => setSelectedTable(table._id)}
                                            className={`p-2 border rounded-lg cursor-pointer text-center transition ${selectedTable === table._id ? 'bg-primary-500 text-white border-primary-500' : 'hover:bg-gray-50 border-gray-200'}`}
                                        >
                                            <div className="font-bold">Table {table.tableNumber}</div>
                                            <div className="text-xs">{table.capacity} Seats</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-600 mb-1 text-sm font-medium">Date</label>
                                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-primary-500" required />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-1 text-sm font-medium">Time</label>
                                    <select value={timeSlot} onChange={e => setTimeSlot(e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-primary-500" required>
                                        <option value="">Select Time</option>
                                        <option value="18:00 - 19:00">18:00 - 19:00</option>
                                        <option value="19:00 - 20:00">19:00 - 20:00</option>
                                        <option value="20:00 - 21:00">20:00 - 21:00</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1 text-sm font-medium">Party Size</label>
                                <input type="number" min="1" value={partySize} onChange={e => setPartySize(e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-primary-500" required />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !selectedTable}
                                className="w-full bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700 transition font-bold disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Book Table (Demo)'}
                            </button>
                        </form>
                    </div>

                    {/* Booking History */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold mb-4 text-gray-700">Your Bookings</h2>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                            {bookings.length === 0 && <p className="text-gray-500">No bookings found.</p>}
                            {bookings.map(booking => (
                                <div key={booking._id} className="border-b pb-4 last:border-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-bold text-primary-800">Table {booking.table?.tableNumber}</div>
                                            <div className="text-sm text-gray-600">{booking.date} | {booking.timeSlot}</div>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-bold 
                                        ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

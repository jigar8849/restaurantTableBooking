import { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/admin/stats');
            setStats(data);
        } catch (error) {
            console.error("Error fetching stats", error);
            setError("Failed to load admin statistics. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center text-red-600 font-bold">
                {error}
            </div>
        );
    }

    if (!stats) return <div className="text-center mt-10">No stats available.</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-primary-800 mb-8">Admin Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-primary-500">
                    <div className="text-gray-500 text-sm font-medium uppercase">Total Revenue</div>
                    <div className="text-3xl font-bold text-gray-800">₹{stats.totalEarnings}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-blue-500">
                    <div className="text-gray-500 text-sm font-medium uppercase">Total Bookings</div>
                    <div className="text-3xl font-bold text-gray-800">{stats.totalBookings}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-green-500">
                    <div className="text-gray-500 text-sm font-medium uppercase">Total Users</div>
                    <div className="text-3xl font-bold text-gray-800">{stats.totalUsers}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-purple-500">
                    <div className="text-gray-500 text-sm font-medium uppercase">Tables</div>
                    <div className="text-3xl font-bold text-gray-800">{stats.totalTables}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-gray-700">Booking Status</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span>Pending</span>
                            <span className="font-bold text-yellow-600">{stats.bookingStats.pending}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Confirmed</span>
                            <span className="font-bold text-green-600">{stats.bookingStats.confirmed}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Completed</span>
                            <span className="font-bold text-blue-600">{stats.bookingStats.completed}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Cancelled</span>
                            <span className="font-bold text-red-600">{stats.bookingStats.cancelled}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-gray-700">Recent Bookings</h3>
                    <div className="space-y-4">
                        {stats.recentBookings.map(booking => (
                            <div key={booking._id} className="flex justify-between text-sm border-b pb-2">
                                <div>
                                    <div className="font-bold">{booking.user?.name || 'Unknown User'}</div>
                                    <div className="text-gray-500">Table {booking.table?.tableNumber}</div>
                                </div>
                                <div className="text-right">
                                    <div>{booking.date}</div>
                                    <div className={`font-bold ${booking.status === 'Confirmed' ? 'text-green-600' : 'text-gray-600'}`}>{booking.status}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

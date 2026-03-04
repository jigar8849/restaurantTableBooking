import { useState, useEffect } from 'react';
import api from '../services/api';

const EmployeeDashboard = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings');
            setBookings(data);
        } catch (error) {
            console.error("Error fetching bookings", error);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/bookings/${id}/status`, { status });
            fetchBookings();
        } catch (error) {
            console.error("Error updating status", error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-primary-800 mb-8">Employee Station</h1>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-primary-50">
                        <tr>
                            <th className="p-4 font-bold text-gray-600">Customer</th>
                            <th className="p-4 font-bold text-gray-600">Table</th>
                            <th className="p-4 font-bold text-gray-600">Date & Time</th>
                            <th className="p-4 font-bold text-gray-600">Status</th>
                            <th className="p-4 font-bold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bookings.map(booking => (
                            <tr key={booking._id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="font-medium">{booking.user?.name}</div>
                                    <div className="text-xs text-gray-500">{booking.user?.email}</div>
                                </td>
                                <td className="p-4">Table {booking.table?.tableNumber}</td>
                                <td className="p-4">
                                    <div className="text-sm">{booking.date}</div>
                                    <div className="text-xs text-gray-500">{booking.timeSlot}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold 
                                        ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="p-4 space-x-2">
                                    {booking.status === 'Pending' && (
                                        <button onClick={() => updateStatus(booking._id, 'Confirmed')} className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Confirm</button>
                                    )}
                                    {booking.status === 'Confirmed' && (
                                        <button onClick={() => updateStatus(booking._id, 'Completed')} className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Complete</button>
                                    )}
                                    {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                                        <button onClick={() => updateStatus(booking._id, 'Cancelled')} className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Cancel</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeDashboard;

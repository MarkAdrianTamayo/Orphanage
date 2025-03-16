import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from '../admin/SideBar.jsx';
import AdminHeader from '../admin/AdminHeader.jsx';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, parseISO, getYear, addYears } from 'date-fns';
import { MdClose } from 'react-icons/md';
import { FaCalendarAlt, FaClock, FaBirthdayCake, FaChevronLeft, FaChevronRight, FaCalendarDay } from 'react-icons/fa';

function Calendar() {
    const [dir, setDir] = useState(['CALENDAR']);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [children, setChildren] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('all'); // 'all', 'events', 'appointments', 'birthdays'
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([
                    fetchEvents(),
                    fetchAppointments(),
                    fetchChildren()
                ]);
            } catch (error) {
                console.error('Error fetching calendar data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, []);

    useEffect(() => {
        return () => {
            const modalOverlay = document.getElementById('calendar-modal-overlay');
            if (modalOverlay) {
                modalOverlay.remove();
            }
            
            document.body.classList.remove('overflow-hidden');
        };
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('/api/events');
            setEvents(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching events:', error);
            return [];
        }
    };

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('/api/appointments');
            setAppointments(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching appointments:', error);
            return [];
        }
    };

    const fetchChildren = async () => {
        try {
            const response = await axios.get('/api/children');
            setChildren(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching children data:', error);
            return [];
        }
    };

    const getDaysInMonth = () => {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        return eachDayOfInterval({ start, end });
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
    };

    const getEventsForDate = (date) => {
        if (viewMode === 'appointments' || viewMode === 'birthdays') return [];
        return events.filter(event => 
            isSameDay(new Date(event.event_date), date)
        );
    };

    const getAppointmentsForDate = (date) => {
        if (viewMode === 'events' || viewMode === 'birthdays') return [];
        return appointments.filter(appointment => 
            isSameDay(new Date(appointment.visit_date), date)
        );
    };

    const getBirthdaysForDate = (date) => {
        if (viewMode === 'events' || viewMode === 'appointments') return [];
        return children.filter(child => {
            if (!child.date_of_birth) return false;
            const birthDate = new Date(child.date_of_birth);
            return birthDate.getDate() === date.getDate() && 
                   birthDate.getMonth() === date.getMonth();
        });
    };

    // Calculate age from birthdate
    const calculateAge = (birthdate) => {
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    };

    const openDateModal = (date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
        
        const modalOverlay = document.getElementById('calendar-modal-overlay');
        if (!modalOverlay) {
            const overlay = document.createElement('div');
            overlay.id = 'calendar-modal-overlay';
            overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-40';
            document.body.appendChild(overlay);
        }
        
        document.body.classList.add('overflow-hidden');
    };

    const closeDateModal = () => {
        setIsModalOpen(false);
        
        const modalOverlay = document.getElementById('calendar-modal-overlay');
        if (modalOverlay) {
            modalOverlay.remove();
        }
        
        document.body.classList.remove('overflow-hidden');
    };

    return (
        <div className="flex w-full">
            <div>
                <SideBar activeMenu='calendar' />
            </div>
            <div className="w-full bg-gray-100 min-h-screen">
                <AdminHeader dir={dir} />
                <div className="px-6 py-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col md:flex-row items-center justify-between mb-4 bg-white rounded-xl p-4 shadow-sm">
                                <div className="flex items-center mb-4 md:mb-0">
                                    <button 
                                        onClick={prevMonth} 
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <FaChevronLeft className="text-gray-600" />
                                    </button>
                                    <h2 className="text-2xl font-semibold text-gray-800 mx-4">
                                        {format(currentDate, 'MMMM yyyy')}
                                    </h2>
                                    <button 
                                        onClick={nextMonth} 
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <FaChevronRight className="text-gray-600" />
                                    </button>
                                </div>
                                
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setViewMode('all')}
                                        className={`px-3 py-2 rounded-lg transition-colors flex items-center ${
                                            viewMode === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        }`}
                                    >
                                        <FaCalendarAlt className="mr-1" /> All
                                    </button>
                                    <button
                                        onClick={() => setViewMode('events')}
                                        className={`px-3 py-2 rounded-lg transition-colors flex items-center ${
                                            viewMode === 'events' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        }`}
                                    >
                                        <FaClock className="mr-1" /> Events
                                    </button>
                                    <button
                                        onClick={() => setViewMode('appointments')}
                                        className={`px-3 py-2 rounded-lg transition-colors flex items-center ${
                                            viewMode === 'appointments' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        }`}
                                    >
                                        <FaCalendarDay className="mr-1" /> Appointments
                                    </button>
                                    <button
                                        onClick={() => setViewMode('birthdays')}
                                        className={`px-3 py-2 rounded-lg transition-colors flex items-center ${
                                            viewMode === 'birthdays' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        }`}
                                    >
                                        <FaBirthdayCake className="mr-1" /> Birthdays
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="grid grid-cols-7 bg-gray-50 font-medium text-gray-700 border-b border-gray-200">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                        <div key={day} className="p-4 text-center">{day}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7">
                                    {getDaysInMonth().map((date) => {
                                        const dayEvents = getEventsForDate(date);
                                        const dayAppointments = getAppointmentsForDate(date);
                                        const dayBirthdays = getBirthdaysForDate(date);
                                        const hasItems = dayEvents.length > 0 || dayAppointments.length > 0 || dayBirthdays.length > 0;
                                        const isToday = isSameDay(date, new Date());
                                        const isCurrentMonth = isSameMonth(date, currentDate);

                                        return (
                                            <div
                                                key={date.toString()}
                                                className={`p-2 border border-gray-100 min-h-[120px] cursor-pointer hover:bg-gray-50 transition-colors
                                                    ${selectedDate && isSameDay(selectedDate, date) ? 'bg-blue-50 border-blue-200' : ''}
                                                    ${isToday ? 'bg-yellow-50 border-yellow-200' : ''}
                                                    ${!isCurrentMonth ? 'opacity-50' : ''}`}
                                                onClick={() => openDateModal(date)}
                                            >
                                                <span className={`block text-right mb-2 ${isToday ? 'text-yellow-700 font-bold' : 'text-gray-600'}`}>
                                                    {format(date, 'd')}
                                                </span>
                                                <div className="space-y-1">
                                                    {dayEvents.length > 0 && (
                                                        <span className="block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded truncate">
                                                            <FaCalendarAlt className="inline mr-1" /> {dayEvents.length > 1 ? `${dayEvents.length} Events` : '1 Event'}
                                                        </span>
                                                    )}
                                                    {dayAppointments.length > 0 && (
                                                        <span className="block text-xs bg-green-100 text-green-800 px-2 py-1 rounded truncate">
                                                            <FaClock className="inline mr-1" /> {dayAppointments.length > 1 ? `${dayAppointments.length} Appts` : '1 Appt'}
                                                        </span>
                                                    )}
                                                    {dayBirthdays.length > 0 && (
                                                        <span className="block text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded truncate">
                                                            <FaBirthdayCake className="inline mr-1" /> {dayBirthdays.length > 1 ? `${dayBirthdays.length} Birthdays` : '1 Birthday'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
                        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {format(selectedDate, 'MMMM d, yyyy')}
                            </h2>
                            <button
                                onClick={closeDateModal}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                                <MdClose className="text-gray-500 text-xl" />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white rounded-lg shadow p-4">
                                    <h3 className="text-lg font-medium text-blue-600 mb-4 flex items-center">
                                        <FaCalendarAlt className="h-5 w-5 mr-2" />
                                        Events
                                    </h3>
                                    <div className="space-y-3">
                                        {getEventsForDate(selectedDate).length > 0 ? (
                                            getEventsForDate(selectedDate).map(event => (
                                                <div key={event.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                                                    <h5 className="font-medium text-gray-800">{event.event_name}</h5>
                                                    <p className="text-gray-600 text-sm mt-1">{event.event_description}</p>
                                                    <div className="flex items-center mt-2">
                                                        <span className="bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs">
                                                            {event.start_time} - {event.end_time}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-center py-4">No events on this day</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow p-4">
                                    <h3 className="text-lg font-medium text-green-600 mb-4 flex items-center">
                                        <FaClock className="h-5 w-5 mr-2" />
                                        Appointments
                                    </h3>
                                    <div className="space-y-3">
                                        {getAppointmentsForDate(selectedDate).length > 0 ? (
                                            getAppointmentsForDate(selectedDate).map(appointment => (
                                                <div key={appointment.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500">
                                                    <h5 className="font-medium text-gray-800">{appointment.visitor}</h5>
                                                    <p className="text-gray-600 text-sm mt-1">{appointment.purpose}</p>
                                                    <div className="flex items-center mt-2">
                                                        <span className={`rounded-full px-2 py-1 text-xs ${
                                                            appointment.status === 'Confirmed' 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : appointment.status === 'Pending' 
                                                                    ? 'bg-yellow-100 text-yellow-800' 
                                                                    : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {appointment.status}
                                                        </span>
                                                        <span className="bg-gray-100 text-gray-800 rounded-full px-2 py-1 text-xs ml-2">
                                                            {appointment.start_time} - {appointment.end_time}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-center py-4">No appointments on this day</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow p-4">
                                    <h3 className="text-lg font-medium text-purple-600 mb-4 flex items-center">
                                        <FaBirthdayCake className="h-5 w-5 mr-2" />
                                        Birthdays
                                    </h3>
                                    <div className="space-y-3">
                                        {getBirthdaysForDate(selectedDate).length > 0 ? (
                                            getBirthdaysForDate(selectedDate).map(child => (
                                                <div key={child.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-500">
                                                    <h5 className="font-medium text-gray-800">{child.name}</h5>
                                                    <p className="text-gray-600 text-sm mt-1">
                                                        Turns {calculateAge(child.date_of_birth) + 1} on {format(new Date(child.date_of_birth), 'MMMM d')}
                                                    </p>
                                                    <div className="flex items-center mt-2">
                                                        <span className="bg-purple-100 text-purple-800 rounded-full px-2 py-1 text-xs">
                                                            Born {format(new Date(child.date_of_birth), 'yyyy')}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-center py-4">No birthdays on this day</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Calendar;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from '../admin/SideBar.jsx';
import AdminHeader from '../admin/AdminHeader.jsx';
import { MdPeople, MdEvent, MdCalendarToday, MdVolunteerActivism, MdCake, MdHistory, MdClose } from 'react-icons/md';
import { Line, Bar, Pie } from 'react-chartjs-2';
import '../../styles/dashboard.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function Dashboard() {
    const [dir, setDir] = useState(['DASHBOARD']);
    const [isLogsOpen, setIsLogsOpen] = useState(false);
    const [stats, setStats] = useState({
        children: 0,
        events: 0,
        appointments: 0,
        volunteers: 0,
        staffs: 0
    });
    const [recentLogs, setRecentLogs] = useState([]);
    const [chartData, setChartData] = useState({
        appointments: [],
        events: [],
        children: []
    });
    const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [distributionData, setDistributionData] = useState({
        caseCategories: [],
        educationLevels: [],
        ageRanges: []
    });

    useEffect(() => {
        fetchStats();
        fetchRecentLogs();
        fetchChartData();
        fetchUpcomingBirthdays();
        fetchUpcomingEvents();
        fetchDistributionData();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get('/api/dashboard/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchRecentLogs = async () => {
        try {
            const response = await axios.get('/api/logs/recent');
            setRecentLogs(response.data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };

    const fetchChartData = async () => {
        try {
            const response = await axios.get('/api/dashboard/chart-data');
            setChartData(response.data);
        } catch (error) {
            console.error('Error fetching chart data:', error);
        }
    };

    const fetchUpcomingBirthdays = async () => {
        try {
            const response = await axios.get('/api/dashboard/upcoming-birthdays');
            setUpcomingBirthdays(response.data);
        } catch (error) {
            console.error('Error fetching upcoming birthdays:', error);
        }
    };

    const fetchUpcomingEvents = async () => {
        try {
            const response = await axios.get('/api/dashboard/upcoming-events');
            setUpcomingEvents(response.data);
        } catch (error) {
            console.error('Error fetching upcoming events:', error);
        }
    };

    const fetchDistributionData = async () => {
        try {
            const response = await axios.get('/api/dashboard/children-distribution');
            setDistributionData(response.data);
        } catch (error) {
            console.error('Error fetching distribution data:', error);
        }
    };

    const commonOptions = {
        responsive: true,
        scales: {
            y: {
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        if (Math.floor(value) === value) {
                            return value;
                        }
                    }
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
            }
        }
    };

    const appointmentsChartData = {
        labels: chartData.appointments.map(item => item.month),
        datasets: [{
            label: 'Monthly Appointments',
            data: chartData.appointments.map(item => item.count),
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1
        }]
    };

    const eventsChartData = {
        labels: chartData.events.map(item => item.month),
        datasets: [{
            label: 'Events per Month',
            data: chartData.events.map(item => item.count),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1
        }]
    };

    const appointmentsEventsChartData = {
        labels: chartData.appointments.map(item => item.month),
        datasets: [{
            label: 'Monthly Appointments',
            data: chartData.appointments.map(item => item.count),
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1
        }, {
            label: 'Events per Month',
            data: chartData.events.map(item => item.count),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1
        }]
    };

    const childrenChartData = {
        labels: chartData.children.map(item => item.year.toString()),
        datasets: [{
            label: 'Children Admitted per Year',
            data: chartData.children.map(item => item.count),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.1
        }]
    };

    // New pie chart configurations
    const caseCategoryPieData = {
        labels: distributionData.caseCategories.map(item => item.category),
        datasets: [{
            label: 'Children by Case Category',
            data: distributionData.caseCategories.map(item => item.count),
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(199, 199, 199, 0.6)',
                'rgba(83, 102, 255, 0.6)',
                'rgba(40, 159, 64, 0.6)',
                'rgba(210, 199, 199, 0.6)',
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)',
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)',
                'rgb(199, 199, 199)',
                'rgb(83, 102, 255)',
                'rgb(40, 159, 64)',
                'rgb(210, 199, 199)',
            ],
            borderWidth: 1
        }]
    };

    const educationPieData = {
        labels: distributionData.educationLevels.map(item => item.education_level),
        datasets: [{
            label: 'Children by Educational Attainment',
            data: distributionData.educationLevels.map(item => item.count),
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(199, 199, 199, 0.6)',
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)',
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)',
                'rgb(199, 199, 199)',
            ],
            borderWidth: 1
        }]
    };

    const ageRangePieData = {
        labels: distributionData.ageRanges.map(item => item.age_range),
        datasets: [{
            label: 'Children by Age Range',
            data: distributionData.ageRanges.map(item => item.count),
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(199, 199, 199, 0.6)',
                'rgba(83, 102, 255, 0.6)',
                'rgba(40, 159, 64, 0.6)',
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)',
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)',
                'rgb(199, 199, 199)',
                'rgb(83, 102, 255)',
                'rgb(40, 159, 64)',
            ],
            borderWidth: 1
        }]
    };

    const pieChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 15,
                    padding: 10,
                    font: {
                        size: 10
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';
                        return `${label}: ${value} (${percentage})`;
                    }
                }
            }
        }
    };

    return (
        <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <SideBar activeMenu="dashboard" />
            <div className="flex-1 overflow-hidden">
                <AdminHeader dir={dir} />
                {/* Mobile Logs Button - Only visible on mobile */}
                <button
                    onClick={() => setIsLogsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 xl:hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    aria-label="Show Recent Activities"
                >
                    <MdHistory size={24} />
                </button>

                {/* Mobile Logs Popup */}
                {isLogsOpen && (
                    <div className="fixed inset-0 z-50 xl:hidden bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden relative">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">Recent Activities</h2>
                                    <button
                                        onClick={() => setIsLogsOpen(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                    >
                                        <MdClose size={24} />
                                    </button>
                                </div>
                                <div className="space-y-4 max-h-[calc(80vh-8rem)] overflow-y-auto custom-scrollbar">
                                    {recentLogs.map((log, index) => (
                                        <div key={index} className="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                                            <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs font-medium uppercase text-center shadow-sm">
                                                {log.action}
                                            </div>
                                            <div className="text-center">
                                                <p className="text-gray-800 font-medium">{log.affected_table} - {log.record_name || `Record #${log.record_id}`}</p>
                                                <p className="text-sm text-gray-600 mt-1">By: {log.lastName || ''} {log.l_name || ''}</p>
                                                <span className="text-xs text-gray-500 block mt-1">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="container mx-auto px-4 py-6 space-y-8">
                    {/* Main content and logs layout */}
                    <div className="flex flex-col xl:flex-row gap-6">
                        {/* Main dashboard content */}
                        <div className="xl:w-3/4 space-y-8">
                            {/* Stat cards section */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                                {/* Children Stats */}
                                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-2xl text-white shadow-lg">
                                            <MdPeople />
                                        </div>
                                        <div>
                                            <h3 className="text-gray-600 text-sm font-medium">Children</h3>
                                            <p className="text-2xl font-bold text-gray-800 mt-1">{stats.children}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Events Stats */}
                                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-2xl text-white shadow-lg">
                                            <MdEvent />
                                        </div>
                                        <div>
                                            <h3 className="text-gray-600 text-sm font-medium">Events</h3>
                                            <p className="text-2xl font-bold text-gray-800 mt-1">{stats.events}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Appointments Stats */}
                                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-2xl text-white shadow-lg">
                                            <MdCalendarToday />
                                        </div>
                                        <div>
                                            <h3 className="text-gray-600 text-sm font-medium">Appointments</h3>
                                            <p className="text-2xl font-bold text-gray-800 mt-1">{stats.appointments}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Volunteers Stats */}
                                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-2xl text-white shadow-lg">
                                            <MdVolunteerActivism />
                                        </div>
                                        <div>
                                            <h3 className="text-gray-600 text-sm font-medium">Volunteers</h3>
                                            <p className="text-2xl font-bold text-gray-800 mt-1">{stats.volunteers}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Upcoming Events and Birthdays */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Upcoming Birthdays */}
                                <div className="bg-white p-6 rounded-2xl shadow-lg">
                                    <h2 className="flex items-center text-xl font-bold mb-6">
                                        <MdCake className="mr-2 text-pink-500" size={28} />
                                        Upcoming Birthdays
                                    </h2>
                                    <div className="divide-y max-h-[400px] overflow-y-auto custom-scrollbar">
                                        {upcomingBirthdays.length > 0 ? (
                                            upcomingBirthdays.map((child) => (
                                                <div key={child.id} className="py-4 flex justify-between items-center hover:bg-gray-50 rounded-lg transition-colors duration-200">
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{child.name}</p>
                                                        <p className="text-sm text-gray-600">
                                                            Turning {child.upcoming_age} on {new Date(child.date_of_birth).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full text-sm font-medium shadow-md">
                                                        {child.days_until_birthday === 0 ? 'Today' : 
                                                         child.days_until_birthday === 1 ? 'Tomorrow' : 
                                                         `In ${child.days_until_birthday} days`}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 py-4 text-center">No upcoming birthdays in the next 30 days</p>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Upcoming Events */}
                                <div className="bg-white p-6 rounded-2xl shadow-lg">
                                    <h2 className="flex items-center text-xl font-bold mb-6">
                                        <MdEvent className="mr-2 text-purple-500" size={28} />
                                        Upcoming Events
                                    </h2>
                                    <div className="divide-y max-h-[400px] overflow-y-auto custom-scrollbar">
                                        {upcomingEvents.length > 0 ? (
                                            upcomingEvents.map((event) => (
                                                <div key={event.id} className="py-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <p className="font-semibold text-gray-800">{event.event_name}</p>
                                                        <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full text-sm font-medium shadow-md">
                                                            {event.days_until_event === 0 ? 'Today' : 
                                                             event.days_until_event === 1 ? 'Tomorrow' : 
                                                             `In ${event.days_until_event} days`}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(event.event_date).toLocaleDateString()}
                                                    </p>
                                                    {event.description && (
                                                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                                            {event.description}
                                                        </p>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 py-4 text-center">No upcoming events</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Charts Container */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                <div className="bg-white rounded-2xl p-6 shadow-lg">
                                    <h3 className="text-gray-800 font-bold mb-6">Children Admission Trend</h3>
                                    <Line data={childrenChartData} options={commonOptions} />
                                </div>
                                <div className="bg-white rounded-2xl p-6 shadow-lg xl:col-span-2">
                                    <h3 className="text-gray-800 font-bold mb-6">Monthly Events & Appointments</h3>
                                    <Bar data={appointmentsEventsChartData} options={commonOptions} />
                                </div>
                            </div>
                            
                            {/* Distribution Charts */}
                            <div>
                                <h2 className="text-2xl font-bold mb-6">Children Distribution</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {/* Case Category Distribution */}
                                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                                        <h3 className="text-lg font-bold mb-6">By Case Category</h3>
                                        <div className="h-[300px]">
                                            <Pie data={caseCategoryPieData} options={pieChartOptions} />
                                        </div>
                                    </div>
                                    
                                    {/* Educational Attainment Distribution */}
                                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                                        <h3 className="text-lg font-bold mb-6">By Educational Attainment</h3>
                                        <div className="h-[300px]">
                                            <Pie data={educationPieData} options={pieChartOptions} />
                                        </div>
                                    </div>
                                    
                                    {/* Age Range Distribution */}
                                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                                        <h3 className="text-lg font-bold mb-6">By Age Group</h3>
                                        <div className="h-[300px]">
                                            <Pie data={ageRangePieData} options={pieChartOptions} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Recent activity logs section - Hidden on mobile */}
                        <div className="hidden xl:block xl:w-1/4">
                            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-20">
                                <h2 className="text-xl font-bold mb-6 text-center">Recent Activities</h2>
                                <div className="space-y-4 max-h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar">
                                    {recentLogs.map((log, index) => (
                                        <div key={index} className="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                                            <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs font-medium uppercase text-center shadow-sm">
                                                {log.action}
                                            </div>
                                            <div className="text-center">
                                                <p className="text-gray-800 font-medium">{log.affected_table} - {log.record_name || `Record #${log.record_id}`}</p>
                                                <p className="text-sm text-gray-600 mt-1">By: {log.lastName || ''} {log.l_name || ''}</p>
                                                <span className="text-xs text-gray-500 block mt-1">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
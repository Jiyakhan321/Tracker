import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaBox, FaChartBar, FaTimes,  } from 'react-icons/fa';



import TaskManager from './Taskmanager.jsx';

import Logout from './Logout'
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const EmployeeDashboard = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [activeTab, setActiveTab] = useState('Dashboard');
	const [totalProducts, setTotalProducts] = useState(0);

	const navigate = useNavigate();


	// ✅ Check if the user is an employee before allowing access
	const checkEmployeeStatus = async () => {
		const token = localStorage.getItem('token');

		if (!token) {
			console.error('❌ No auth token found! Redirecting to login.');
			alert('Unauthorized access! Please log in as an employee.');
			navigate('/login');
			return;
		}

		try {
			const response = await fetch(`${apiUrl}/auth/isEmployee`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});

			const data = await response.json();
			console.log('Employee Check Response:', data);

			if (!data.success || !data.isEmployee) {
				console.error('❌ User is not an employee, redirecting to login...');
				localStorage.removeItem('authToken'); // 🔹 Remove invalid token
				navigate('/login');
				return;
			}
		} catch (error) {
			console.error('❌ Error checking employee status:', error);
			alert('An error occurred. Redirecting to login.');
			navigate('/login');
		}
	};

	// ✅ Run employee check and fetch data on component mount
	useEffect(() => {
		checkEmployeeStatus();
	}, []);

	// Function to toggle the sidebar
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const renderContent = () => {
		switch (activeTab) {
		
		
				case 'TaskManager':
				return (
					<div className='p-4'>
						<TaskManager />
					</div>
				);
		
			case 'LogOut':
				return (
					<div className='p-4'>
						<Logout />
					</div>

				)
			default:
				return <div className='p-4'>
					<TaskManager />
				</div>

		}
	};

	return (

		<div className='flex h-screen bg-gray-100'>

			{/* Sidebar */}
			<div
				className={`fixed top-0 left-0 z-40 h-full bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
					} transition-transform duration-300 sm:translate-x-0 sm:w-64`}>
				<div className='flex items-center justify-between p-4 bg-teal-600'>
					<h2 className='text-white text-xl font-bold'>Task Manger</h2>
					<button className='text-white sm:hidden' onClick={toggleSidebar}>
						<FaTimes />
					</button>
				</div>
				<nav className='p-4'>
					<ul className='space-y-4'>
					

						<MenuItem
							icon={<FaChartBar />}
							text='TaskManager'
							isActive={activeTab === 'TaskManager'}
							onClick={() => setActiveTab('TaskManager')}
						/>
					

					
						<MenuItem
							icon={<FaBox />}
							text='LogOut'
							isActive={activeTab === 'LogOut'}
							onClick={() => setActiveTab('LogOut')}
						/>
					</ul>
				</nav>
			</div>

			{/* Main Content */}
			<div className='flex flex-col flex-grow sm:ml-64'>
				<header className='flex items-center justify-between p-4 bg-white shadow-md sm:hidden'>
					<h2 className='text-lg font-semibold'>{activeTab}</h2>
					<button onClick={toggleSidebar} className='text-teal-600'>
						<FaBars />
					</button>
				</header>
				<main className='flex-grow p-4'>{renderContent()}</main>
			</div>
		</div>
	);
};

const MenuItem = ({ icon, text, isActive, onClick }) => (
	<li>
		<button
			onClick={onClick}
			className={`flex items-center p-2 w-full text-left ${isActive ? 'text-teal-700 bg-gray-100' : 'text-gray-700'
				} hover:text-teal-600 hover:bg-gray-100 rounded-lg transition`}>
			<span className='mr-2'>{icon}</span>
			{text}
		</button>
	</li>
);

const DashboardCard = ({ title, value, icon }) => (
	<div className='flex items-center p-4 bg-white shadow rounded-lg'>
		<div className='p-3 bg-gray-100 rounded-full'>{icon}</div>
		<div className='ml-4'>
			<h3 className='text-lg font-medium text-gray-700'>{title}</h3>
			<p className='text-2xl font-bold text-gray-900'>{value}</p>
		</div>
	</div>
);

export default EmployeeDashboard;
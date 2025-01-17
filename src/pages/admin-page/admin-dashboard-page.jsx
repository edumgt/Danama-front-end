import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { fetchAdminDashBoardPage } from "../../api/admin-api.js";
import './admin-dashboard-page.css';
import AdminHeader from "../../components/common/AdminHeader/AdminHeader.jsx";
import AdminSidebar from "./../../components/common/AdminSideBar/AdminSideBar.jsx";
import {formatCurrency} from "../../utils/utility.js";

function AdminDashboardPage() {
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAdminDashBoardPage();
                setDashboardData(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="loading-overlay">
            <div className="spinner"></div>
        </div>;
    }

    if (error) {
        return <div className="dashboard-error-message">{error}</div>;
    }

    const { cinemaRevenues = [], movies = [], popularShowtimes = [] } = dashboardData || {};

    // Tính tổng doanh thu
    const totalRevenueAmount = cinemaRevenues.length > 0
        ? cinemaRevenues.reduce((acc, cinema) => acc + (cinema.totalRevenue || 0), 0)
        : 0;

    // Cấu hình pie chart
    const pieChartData = {
        series: cinemaRevenues.map(cinema => cinema.totalRevenue),
        options: {
            chart: {
                type: 'pie',
            },
            labels: cinemaRevenues.map(cinema => cinema.cinemaName),
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                floating: false,
                itemMargin: {
                    horizontal: 5,
                    vertical: 2
                },
                labels: {
                    colors: ['#ff0000'],
                    fontSize: '16px',
                    fontWeight: 'bold'
                }
            },
            markers: {
                width: 12,
                height: 12,
                strokeWidth: 0,
                strokeColor: '#fff',
                fillOpacity: 1,
                radius: 12,
                shape: "circle",
            },
            colors: ['#1CBB8C', '#0F9CF3', '#FCB92C', '#4AA3FF', '#F32F53'],
            dataLabels: {
                enabled: true,
                formatter: (val, opts) => {
                    return `${opts.w.config.labels[opts.seriesIndex]}: ${val.toFixed(2)}%`;
                },
            },
            stroke: {
                show: false,
            },
        },
    };

    return (
        <>
            <AdminHeader/>
            <div className="dashboard-container">

                <AdminSidebar/>
                <div className="dashboard-content">
                    <h1 className="dashboard-title">Admin Dashboard</h1>

                    <div className="dashboard-most-watched-movies">
                        <h2>Most Watched Movies</h2>
                        <table>
                            <thead>
                            <tr>
                                <th>Movie</th>
                                <th>Name</th>
                                <th>Ticket (Total)</th>
                                <th>Revenue (VND)</th>
                            </tr>
                            </thead>
                            <tbody>
                            {movies.map((movie, index) => (
                                <tr key={index}>
                                    <td>
                                        <img src={movie.poster} alt={`Poster of ${movie.name}`}
                                             className="dashboard-movie-poster" width="100"/>
                                    </td>
                                    <td>{movie.name}</td>
                                    <td>{movie.totalTicketsSold}</td>
                                    <td>{formatCurrency(movie.totalRevenue)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {popularShowtimes.length > 0 && (
                        <div className="dashboard-most-popular-time-slots">
                            <h2>Most Popular Time Slots</h2>
                            <ul>
                                {popularShowtimes.map((showtime, index) => (
                                    <li key={index} className="dashboard-time-slot-item">
                                        <img src={showtime.logo} alt={`${showtime.cinemaName} logo`}
                                             className="dashboard-cinema-logo"/>
                                        <span>{showtime.cinemaName}</span>
                                        <span>{showtime.startTime} - {showtime.endTime}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {cinemaRevenues.length > 0 && (
                        <div className="dashboard-revenue-summary">
                            <h2>Total</h2>
                            <div className='total-revenue'>
                            <p>Total revenue: {formatCurrency(totalRevenueAmount)}</p>
                            </div>
                            <div className="dashboard-cinema-revenue-list">
                                {cinemaRevenues.map((cinema, index) => (
                                    <div key={index} className="dashboard-cinema-revenue">
                                        <span>{cinema.cinemaName}</span>
                                        <span>{formatCurrency(cinema.totalRevenue)} </span>
                                        <div className="dashboard-revenue-bar">
                                            <div className="dashboard-revenue-fill"
                                                 style={{width: `${(cinema.totalRevenue / totalRevenueAmount) * 100}%`}}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {cinemaRevenues.length > 0 && (
                        <div className="dashboard-summary-pie-chart">
                            <h2>Revenue Distribution by Cinema</h2>
                            <div id="pie_chart" className="apex-charts">
                                <ReactApexChart options={pieChartData.options} series={pieChartData.series} type="pie"
                                                height={350}/>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>

    );
}

export default AdminDashboardPage;

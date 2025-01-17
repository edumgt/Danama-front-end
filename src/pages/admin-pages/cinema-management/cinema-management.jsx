import { useState, useEffect } from 'react';
import {
    fetchAccountById,
    fetchAddCinema,
    fetchAvailableManagers,
    fetchCinemaList,
    fetchDeleteCinema,
    fetchUpdateCinema
} from "../../../api/admin-api.js";
import CustomModal from "../../../components/common/CustomModal/CustomModal.jsx";
import { upFileToAzure } from "../../../api/webAPI.jsx";
import "./cinema-management.css";
import AdminHeader from "../../../components/common/AdminHeader/AdminHeader.jsx";
import AdminSidebar from "../../../components/common/AdminSideBar/AdminSideBar.jsx";
import {useCustomAlert} from "../../../utils/CustomAlertContext.jsx";

const CinemaManagement = () => {
    const [cinemas, setCinemas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState({});
    const [newCinema, setNewCinema] = useState({ name: '', logo: '', address: '', description: '', managerId: '' });
    const [editCinemaId, setEditCinemaId] = useState(null);
    const showAlert = useCustomAlert();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(''); // 'add' or 'edit'
    const [selectedFile, setSelectedFile] = useState(null);
    const [availableManagers, setAvailableManagers] = useState([]);

    // Hàm reset state newCinema
    const resetForm = () => {
        setNewCinema({ name: '', logo: '', address: '', description: '', managerId: '' });
        setSelectedFile(null);
        setFormError({});
    };

    const [itemsPerPage] = useState(10); // Số mục hiển thị trên mỗi trang
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

    const paginatedCinemas = cinemas.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleNextPage = () => {
        if (currentPage < Math.ceil(cinemas.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Khi modal đóng, reset lại form
    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
        resetAvailableManagers(); // Reset available managers when closing the modal
    };


    // Hàm xử lý khi nhấn Cancel
    const handleCancel = () => {
        handleCloseModal();
    };

    // Fetch cinema list on mount
    useEffect(() => {
        const getCinemas = async () => {
            try {
                const data = await fetchCinemaList();
                if (data) {
                    setCinemas(data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        getCinemas();
    }, []);

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const managers = await fetchAvailableManagers();
                setAvailableManagers(managers);
            } catch (err) {
                console.error('Error fetching available managers:', err);
            }
        };
        fetchManagers();
    }, []);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // If changing the managerId, also update managerEmail
        if (name === 'managerId') {
            const selectedManager = availableManagers.find(manager => manager.UID === value);
            setNewCinema((prevState) => ({
                ...prevState,
                managerId: value,
                managerEmail: selectedManager ? selectedManager.email : '' // Set the new email if a manager is found
            }));
        } else {
            setNewCinema((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };


    const validateForm = () => {
        const errors = {};
        if (!newCinema.name.trim()) errors.name = 'Cinema name is required';
        if (!newCinema.address.trim()) errors.address = 'Address is required';
        if (!newCinema.description.trim()) errors.description = 'Description is required';
        if (!newCinema.managerId.trim()) errors.managerId = 'Manager is required';
        setFormError(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddCinema = async () => {
        if (!validateForm()) {
            return;
        }

        let logoUrl = newCinema.logo;
        if (selectedFile) {
            const uploadedImageUrl = await upFileToAzure(selectedFile);
            if (uploadedImageUrl) {
                logoUrl = uploadedImageUrl;
            } else {
                showAlert('Failed to upload image.');
                return;
            }
        }
        setLoading(true);

        const success = await fetchAddCinema({ ...newCinema, logo: logoUrl });
        if (success) {
            showAlert('Cinema added successfully!');

            // Fetch the updated list of cinemas
            const updatedCinemas = await fetchCinemaList();
            const updatedManagers = await fetchAvailableManagers();
            if (updatedCinemas) {
                setCinemas(updatedCinemas);
            }
            if(updatedManagers) {
                setAvailableManagers(updatedManagers);
            }
            setLoading(false);
            handleCloseModal(); // Reset form and close modal after successful addition
        } else {
            showAlert('Failed to add cinema.');
        }
    };

    const handleEditCinema = async (cinema) => {
        setEditCinemaId(cinema.cinemaId);
        let managerEmail = ''; // Default value for the email

        if (cinema.managerId) {
            // Check if the manager is already in availableManagers
            let manager = availableManagers.find(mgr => mgr.UID === cinema.managerId);
            if (!manager) {
                // Fetch the manager's details if not already in availableManagers
                const managerInfo = await fetchAccountById(cinema.managerId);
                if (managerInfo) {
                    managerEmail = managerInfo.email;
                    // Add the current manager to availableManagers
                    setAvailableManagers(prevManagers => [...prevManagers, managerInfo]);
                }
            } else {
                // Use the existing manager data
                managerEmail = manager.email;
            }
        }

        setNewCinema({
            cinemaId: cinema.cinemaId,
            name: cinema.name,
            logo: cinema.logo,
            address: cinema.address,
            description: cinema.description,
            managerId: cinema.managerId,
            managerEmail: managerEmail
        });

        setModalType('edit');
        setIsModalOpen(true);
    };

    const resetAvailableManagers = async () => {
        try {
            const managers = await fetchAvailableManagers();
            setAvailableManagers(managers);
        } catch (err) {
            console.error('Error resetting available managers:', err);
        }
    };


    const handleUpdateCinema = async () => {
        if (!validateForm()) {
            return;
        }
        let logoUrl = newCinema.logo;
        if (selectedFile) {
            const uploadedImageUrl = await upFileToAzure(selectedFile);
            if (uploadedImageUrl) {
                logoUrl = uploadedImageUrl;
            } else {
                showAlert('Failed to upload image.');
                return;
            }
        }

        const success = await fetchUpdateCinema({ ...newCinema, logo: logoUrl });
        if (success) {
            showAlert('Cinema updated successfully!');
            const updatedManagers = await fetchAvailableManagers();
            const updatedCinemas = await fetchCinemaList();
            if (updatedCinemas) {
                setCinemas(updatedCinemas);
            }
            if(updatedManagers) {
                setAvailableManagers(updatedManagers);
            }
            handleCloseModal(); // Reset form và đóng modal sau khi cập nhật thành công
        } else {
            showAlert('Failed to update cinema.');
        }
    };

    const handleDeleteCinema = async (cinemaId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this cinema?');

        if (isConfirmed) {
            setLoading(true);
            const success = await fetchDeleteCinema(cinemaId);
            if (success) {
                setLoading(false);
                showAlert('Cinema deleted successfully!');
                setCinemas(cinemas.filter((cinema) => cinema.cinemaId !== cinemaId));
                handleCloseModal(); // Reset form and close modal after successful deletion
            } else {
                showAlert('Failed to delete cinema.');
            }
        } else {
            // Optional: handle cancel action or close modal
            showAlert('Delete action canceled.');
        }
    };

    if (loading) {
        return <div className="loading-overlay">
            <div className="spinner"></div>
        </div>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <>
            <AdminHeader />
            <div className="cinema-list-container">
                <AdminSidebar />
                <div className="cinema-list-content">
                    <div className="cinema-list-header">
                        <h2 className="title">Cinema List</h2>
                        <button className="add-cinema-btn" onClick={() => {
                            setModalType('add');
                            setIsModalOpen(true);
                        }}>+ Add new cinema
                        </button>
                    </div>

                    <table className="cinema-table">
                        <thead>
                        <tr>
                            <th>Cinema ID</th>
                            <th>Name</th>
                            <th>Logo</th>
                            <th>Manager ID</th>
                            <th>Address</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedCinemas.map((cinema) => (
                            <tr key={cinema.cinemaId}>
                                <td>{cinema.cinemaId}</td>
                                <td>{cinema.name}</td>
                                <td><img src={cinema.logo} className="cinema-logo" alt="cinema logo"/></td>
                                <td>{cinema.managerId}</td>
                                <td>{cinema.address}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEditCinema(cinema)}>✏️</button>
                                    <button className="delete-btn"
                                            onClick={() => handleDeleteCinema(cinema.cinemaId)}>🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="pagination-controls">
                        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
                        <span>Page {currentPage} of {Math.ceil(cinemas.length / itemsPerPage)}</span>
                        <button onClick={handleNextPage}
                                disabled={currentPage === Math.ceil(cinemas.length / itemsPerPage)}>Next
                        </button>
                    </div>

                    <CustomModal isOpen={isModalOpen} onClose={handleCloseModal}>
                        {modalType === 'add' && (
                            <div>
                                <h3>Add Cinema</h3>
                                <input
                                    type="text"
                                    name="name"
                                    value={newCinema.name}
                                    onChange={handleInputChange}
                                    placeholder="Cinema Name"
                                    className={formError.name ? 'input-error' : ''}
                                />
                                {formError.name && <p className="error-message">{formError.name}</p>}

                                <input
                                    type="text"
                                    name="address"
                                    value={newCinema.address}
                                    onChange={handleInputChange}
                                    placeholder="Address"
                                    className={formError.address ? 'input-error' : ''}
                                />
                                {formError.address && <p className="error-message">{formError.address}</p>}

                                <input
                                    type="text"
                                    name="description"
                                    value={newCinema.description}
                                    onChange={handleInputChange}
                                    placeholder="Description"
                                    className={formError.description ? 'input-error' : ''}
                                />
                                {formError.description && <p className="error-message">{formError.description}</p>}

                                <select
                                    name="managerId"
                                    value={newCinema.managerId}
                                    onChange={handleInputChange}
                                    className={formError.managerId ? 'input-error' : ''}
                                >
                                    <option value="">Select Manager</option>
                                    {availableManagers.map(manager => (
                                        <option key={manager.UID} value={manager.UID}>
                                            {manager.email}
                                        </option>
                                    ))}
                                </select>

                                {formError.managerId && <p className="error-message">{formError.managerId}</p>}

                                <input type="file" accept="image/*" onChange={handleFileChange}/>
                                <button onClick={handleAddCinema}>Add</button>
                                <button onClick={handleCancel}>Cancel</button>
                            </div>
                        )}

                        {modalType === 'edit' && (
                            <div>
                                <h3>Edit Cinema</h3>
                                <input
                                    type="text"
                                    name="name"
                                    value={newCinema.name}
                                    onChange={handleInputChange}
                                    placeholder="Cinema Name"
                                    className={formError.name ? 'input-error' : ''}
                                />
                                {formError.name && <p className="error-message">{formError.name}</p>}

                                <input type="file" accept="image/*" onChange={handleFileChange}/>
                                <input
                                    type="text"
                                    name="address"
                                    value={newCinema.address}
                                    onChange={handleInputChange}
                                    placeholder="Address"
                                    className={formError.address ? 'input-error' : ''}
                                />
                                {formError.address && <p className="error-message">{formError.address}</p>}

                                <input
                                    type="text"
                                    name="description"
                                    value={newCinema.description}
                                    onChange={handleInputChange}
                                    placeholder="Description"
                                    className={formError.description ? 'input-error' : ''}
                                />
                                {formError.description && <p className="error-message">{formError.description}</p>}

                                <select
                                    name="managerId"
                                    value={newCinema.managerId}
                                    onChange={handleInputChange}
                                    className={formError.managerId ? 'input-error' : ''}
                                >
                                    <option value="">Select Manager</option>
                                    {availableManagers.map(manager => (
                                        <option key={manager.UID} value={manager.UID}>
                                            {manager.email}
                                        </option>
                                    ))}
                                </select>


                                {formError.managerId && <p className="error-message">{formError.managerId}</p>}

                                <button onClick={handleUpdateCinema}>Update</button>
                                <button onClick={handleCancel}>Cancel</button>
                            </div>
                        )}
                    </CustomModal>
                </div>
            </div>
        </>
    );
};

export default CinemaManagement;

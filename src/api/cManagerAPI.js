import {API_URL} from "../utils/utility.js";

export const fetchBookingListPage = async (cinemaId) => {
    try {
        const response = await fetch(API_URL+`ListBookingController?cinemaId=${cinemaId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },


        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching cinema booking list:', error);
        return false;
    }
};

export const fetchCinemaDashBoardPage = async (cinemaId) => {
    try {
        const response = await fetch(API_URL+`managerDashBoard?cinemaId=${cinemaId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },


        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching cinema dashboard page:', error);
        return false;
    }
};

export const fetchRoomList = async (cinemaId) => {
    try {
        const response = await fetch(API_URL+`RoomController?cinemaId=${cinemaId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching room list:', error);
        return false;
    }
};

export const fetchSeatList = async (roomId) => {
    try {
        const response = await fetch(API_URL+`SeatController?roomId=${roomId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching seat list:', error);
        return false;
    }
};

export const fetchShowtimeList = async (cinemaId) => {
    try {
        const response = await fetch(API_URL+`ShowtimeController?cinemaId=${cinemaId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching showtime list:', error);
        return false;
    }
};

export const fetchDeleteRoom = async (roomId) => {
    try {
        const response = await fetch(API_URL+'RoomController', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'delete',
                roomId: roomId,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data; // Return success and message from the server
    } catch (error) {
        console.error('Error deleting room:', error);
        return { success: false, message: 'Error deleting room.' };
    }
};


export const fetchDeleteSeat = async (seatId) => {
    try {
        const response = await fetch(API_URL+'SeatController', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'delete',
                seat: { seatId: seatId }
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting seat:', error);
        return false;
    }
};

export const fetchDeleteShowtime = async (showtimeId) => {
    try {
        const response = await fetch(API_URL+'ShowtimeController', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'delete',
                showtime: { showtimeId: showtimeId }
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting showtime:', error);
        return false;
    }
};

export const fetchAddShowtime = async (showtime) => {
    try {
        const response = await fetch(API_URL+'ShowtimeController', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'add',
                showtime: showtime
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding showtime:', error);
        return false;
    }
};

export const fetchAddRoom = async (room) => {
    try {
        const response = await fetch(API_URL+'RoomController', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'add',
                room: room
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data; // Return success and message from the server
    } catch (error) {
        console.error('Error adding room:', error);
        return { success: false, message: 'Error adding room.' };
    }
};

export const fetchAddSeat = async (seat) => {
    try {
        const response = await fetch(API_URL+'SeatController', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'add',
                seat: seat
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding seat:', error);
        return false;
    }
};

export const fetchUpdateRoom = async (room) => {
    try {
        const response = await fetch(API_URL+'RoomController', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'update',
                room: room,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating room:', error);
        return { success: false, message: 'Error updating room.' };
    }
};

export const fetchChangeSeatType = async (seat) => {
    try {
        const response = await fetch(API_URL+'SeatController', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'changeSeatType',
                seat: seat
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error('Error changing seat type:', error);
        return false;
    }
};

export const fetchUpdateShowtime = async (showtime) => {
    try {
        const response = await fetch(API_URL+'ShowtimeController', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'update',
                showtime: showtime,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error('Error updating showtime:', error);
        return false;
    }
};

export const fetchMovieRequestList = async (cinemaId) => {
    try {
        const response = await fetch(API_URL+`MovieRequestController?cinemaId=${cinemaId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movie request list:', error);
        return false;
    }
};

export const fetchAddMovieRequest = async (movierequest) => {
    try {
        const response = await fetch(API_URL+'MovieRequestController', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'add',
                movierequest: movierequest
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding movie request:', error);
        return false;
    }
};

export const fetchUpdateMovieRequest = async (movierequest) => {
    try {
        const response = await fetch(API_URL+'MovieRequestController', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'update',
                movierequest: movierequest,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error('Error updating movie request:', error);
        return false;
    }
};

export const fetchDeleteMovieRequest = async (movierequestId) => {
    try {
        const response = await fetch(API_URL+'MovieRequestController', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'delete',
                movierequest: { requestId: movierequestId }
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting movie request:', error);
        return false;
    }
};

export const fetchViewMovieRequest = async(requestId) => {
    const response = await fetch(API_URL+'MovieRequestController', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'view',
            requestId: requestId,
        }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();

    return data;
}







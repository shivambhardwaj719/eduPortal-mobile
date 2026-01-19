import api from './api';
import { apiPaths } from '../constants/apiPaths';
import { ApiResponse, Hostel, HostelRoom, HostelMeal, HostelAdmission } from '../types';

export const hostelService = {
    // Hostels
    getHostels: async () => {
        const response = await api.get<ApiResponse<Hostel[]>>(apiPaths.hostels.list);
        return response.data;
    },
    createHostel: async (data: Partial<Hostel>) => {
        const response = await api.post(apiPaths.hostels.create, data);
        return response.data;
    },
    updateHostel: async (id: number, data: Partial<Hostel>) => {
        const response = await api.put(`${apiPaths.hostels.update}/${id}`, data);
        return response.data;
    },
    deleteHostels: async (ids: number[]) => {
        const response = await api.post(apiPaths.hostels.delete, { ids });
        return response.data;
    },

    // Rooms
    getRooms: async () => {
        const response = await api.get<ApiResponse<HostelRoom[]>>(apiPaths.hostelRooms.list);
        return response.data;
    },
    createRoom: async (data: Partial<HostelRoom>) => {
        const response = await api.post(apiPaths.hostelRooms.create, data);
        return response.data;
    },
    updateRoom: async (id: number, data: Partial<HostelRoom>) => {
        const response = await api.put(`${apiPaths.hostelRooms.update}/${id}`, data);
        return response.data;
    },
    deleteRooms: async (ids: number[]) => {
        const response = await api.post(apiPaths.hostelRooms.delete, { ids });
        return response.data;
    },
    getAvailableBeds: async (hostelId: number, roomId: number) => {
        const response = await api.post<ApiResponse<{ available_beds: number[] }>>(apiPaths.hostelRooms.availableBeds, {
            hostel_id: hostelId,
            room_id: roomId
        });
        return response.data;
    },

    // Meals
    getMeals: async () => {
        const response = await api.get<ApiResponse<HostelMeal[]>>(apiPaths.hostelMeals.list);
        return response.data;
    },
    createMeal: async (data: Partial<HostelMeal>) => {
        const response = await api.post(apiPaths.hostelMeals.create, data);
        return response.data;
    },
    deleteMeals: async (ids: number[]) => {
        const response = await api.post(apiPaths.hostelMeals.delete, { ids });
        return response.data;
    },

    // Admissions
    getAdmissions: async () => {
        const response = await api.get<ApiResponse<HostelAdmission[]>>(apiPaths.hostelAdmissions.list);
        return response.data;
    },
    createAdmission: async (data: Partial<HostelAdmission>) => {
        const response = await api.post(apiPaths.hostelAdmissions.create, data);
        return response.data;
    },
    deleteAdmissions: async (ids: number[]) => {
        const response = await api.post(apiPaths.hostelAdmissions.delete, { ids });
        return response.data;
    },

    // Get My Hostel Details (Student View)
    getMyHostelDetails: async (studentId: number) => {
        // This logic mimics finding the student's admission record
        // Since there isn't a dedicated "my-hostel" endpoint yet, we might filter client-side 
        // or the backend might start supporting it. For now, we'll fetch admissions and filter.
        const response = await api.get<ApiResponse<HostelAdmission[]>>(apiPaths.hostelAdmissions.list);
        if (response.data.success && response.data.data) {
            const admission = response.data.data.find(a => a.student.id === studentId);
            return admission || null;
        }
        return null;
    }
};

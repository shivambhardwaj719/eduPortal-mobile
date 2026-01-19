import api from './api';
import { apiPaths } from '../constants/apiPaths';
import { ApiResponse, InventoryAsset, InventoryVehicle } from '../types';

export const inventoryService = {
    // Assets
    getAssets: async () => {
        const response = await api.get<ApiResponse<InventoryAsset[]>>(apiPaths.inventory.assets.list);
        return response.data;
    },
    createAsset: async (data: Partial<InventoryAsset>) => {
        const response = await api.post(apiPaths.inventory.assets.create, data);
        return response.data;
    },
    deleteAssets: async (ids: number[]) => {
        const response = await api.post(apiPaths.inventory.assets.delete, { ids });
        return response.data;
    },

    // Vehicles
    getVehicles: async () => {
        const response = await api.get<ApiResponse<InventoryVehicle[]>>(apiPaths.inventory.vehicles.list);
        return response.data;
    },
    createVehicle: async (data: Partial<InventoryVehicle>) => {
        const response = await api.post(apiPaths.inventory.vehicles.create, data);
        return response.data;
    },
    deleteVehicles: async (ids: number[]) => {
        const response = await api.post(apiPaths.inventory.vehicles.delete, { ids });
        return response.data;
    },

    // Dashboard
    getStats: async () => {
        const response = await api.get(apiPaths.inventory.dashboard.stats);
        return response.data;
    }
};

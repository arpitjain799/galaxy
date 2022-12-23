import axios from "axios";
import { prependPath } from "utils/redirect";
import { rethrowSimple } from "utils/simple-error";

export async function getCurrentUser() {
    const url = prependPath("/api/users/current");
    const response = await axios.get(url);
    if (response.status != 200) {
        throw new Error(response);
    }
    return response.data;
}

export async function addFavoriteTool(userId, toolId) {
    const url = prependPath(`/api/users/${userId}/favorites/tools`);
    try {
        const { data } = await axios.put(url, { object_id: toolId });
        return data["tools"];
    } catch (e) {
        rethrowSimple(e);
    }
}

export async function removeFavoriteTool(userId, toolId) {
    const url = prependPath(`/api/users/${userId}/favorites/tools/${encodeURIComponent(toolId)}`);
    try {
        const { data } = await axios.delete(url);
        return data["tools"];
    } catch (e) {
        rethrowSimple(e);
    }
}

export async function setCurrentTheme(userId, themeId) {
    const url = prependPath(`/api/users/${userId}/theme/${themeId}`);
    try {
        const { data } = await axios.put(url, { theme_id: themeId });
        return data["theme_id"];
    } catch (e) {
        rethrowSimple(e);
    }
}

export async function getCurrentTheme(userId) {
    const url = prependPath(`/api/users/${userId}/theme`);
    try {
        const { data } = await axios.get(url);
        return data["tools"];
    } catch (e) {
        rethrowSimple(e);
    }
}
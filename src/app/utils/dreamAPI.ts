const API_BASE_URL = "http://localhost:5000/api/dreams"; // Update with your backend URL

export const fetchDreams = async (params: Record<string, string | number>) => {
    const query = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
            acc[key] = String(value);
            return acc;
        }, {} as Record<string, string>)
    ).toString();
    const response = await fetch(`${API_BASE_URL}?${query}`);
    if (!response.ok) throw new Error("Failed to fetch dreams");
    return response.json();
};

export const createDream = async (dream: { title: string; content: string; date: string; tags: string[] }) => {
    const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dream),
    });
    if (!response.ok) throw new Error("Failed to create dream");
    return response.json();
};

export const updateDream = async (id: string, dream: { title: string; content: string; date: string; tags: string[] }) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dream),
    });
    if (!response.ok) throw new Error("Failed to update dream");
    return response.json();
};

export const deleteDream = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete dream");
};
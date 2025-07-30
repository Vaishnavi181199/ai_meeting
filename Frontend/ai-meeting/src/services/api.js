const API_BASE_URL = "http://localhost:8000/api";

export const apiService ={
    uploadMeeting: async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${API_BASE_URL}/meeting/transcribe`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to upload meeting file");
        }

        return response.json();
    }
}
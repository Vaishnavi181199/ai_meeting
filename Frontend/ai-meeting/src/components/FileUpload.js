import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/api";

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ["audio/", "video/"];
            const isValidType = allowedTypes.some(type => file.type.startsWith(type));
            if (isValidType) {
                setSelectedFile(file);
                setUploadStatus('');
            } else {
                setUploadStatus('Please select a valid audio or video file.');
                setSelectedFile(null);
            }
        };
    }

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadStatus('Please select a file to upload.');
            return;
        }

        setIsUploading(true);
        setUploadStatus('Uploading...');

        try {
            const response = await apiService.uploadMeeting(selectedFile);
            setUploadStatus('File uploaded successfully!');
            navigate('/dashboard', { state: { meetingData: response } });
        } catch (error) {
            setUploadStatus('Failed to upload file. Please try again.');
            console.error("Upload failed:", error);
            setError('Failed to upload file. Please try again.');
        } finally {
            setIsUploading(false);
        }

    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
    }

    return (
        <div className="upload-container">
            <div className="file-input-container">
                <h2>Upload Meeting File</h2>
                <input
                    id="fileInput"
                    type="file"
                    accept="audio/*,video/*"
                    onChange={handleFileChange}
                    className="file-input"
                />
                <label htmlFor="fileInput" className="file-input-label">
                    Choose Audio/video File
                </label>
            </div>
            {selectedFile && (
                <div className="file-info">
                    <p><strong>Selected File:</strong> {selectedFile.name}</p>
                    <p><strong>Size:</strong> {formatFileSize(selectedFile.size)}</p>
                </div>
            )}
            <button
                onClick={handleUpload}
                disabled={isUploading || !selectedFile}
                className="upload-button"
            >
                {isUploading ? 'Uploading...' : 'Upload File'}
            </button>
            {uploadStatus && (
                <div className={`status-message ${uploadStatus.includes('success') ? 'success' : 'error'}`}>
                    {uploadStatus}
                </div>
            )}
        </div>
    );
};
export default FileUpload;


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
  <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg flex flex-col items-center space-y-4">
    <div className="w-full text-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload Meeting File</h2>
      <input
        id="fileInput"
        type="file"
        accept="audio/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <label
        htmlFor="fileInput"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 transition"
      >
        Choose Audio/Video File
      </label>
    </div>

    {selectedFile && (
      <div className="w-full bg-gray-50 p-3 rounded-md border border-gray-300 text-sm text-gray-700">
        <p><strong>File:</strong> {selectedFile.name}</p>
        <p><strong>Size:</strong> {formatFileSize(selectedFile.size)}</p>
      </div>
    )}

    <button
      onClick={handleUpload}
      disabled={isUploading || !selectedFile}
      className={`w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition ${
        (isUploading || !selectedFile) && 'opacity-50 cursor-not-allowed'
      }`}
    >
      {isUploading ? 'Uploading...' : 'Upload File'}
    </button>

    {uploadStatus && (
      <div className={`text-sm font-medium ${
        uploadStatus.includes('success') ? 'text-green-600' : 'text-red-600'
      }`}>
        {uploadStatus}
      </div>
    )}
  </div>
);

};
export default FileUpload;


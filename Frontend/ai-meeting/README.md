# AI Meeting Intelligence - Frontend

A React-based frontend application for uploading meeting recordings and viewing AI-powered transcription and insights.

## 🚀 Features

- **File Upload Interface**: Drag & drop or click to upload audio/video files
- **Real-time Processing**: Shows upload progress and processing status
- **Dashboard View**: Displays transcription results and AI insights
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations
- **Error Handling**: User-friendly error messages and validation

## 📋 Prerequisites
- Node.js 16.0 or higher
- npm or yarn package manager
- Backend API running on `http://localhost:8000`


## 🛠️ Installation
### 1. Clone the Repository

```bash

git clone https://github.com/Vaishnavi181199/ai_meeting.git

cd Frontend/ai-meeting-intelligence

```


### 2. Install Dependencies

```bash

npm install

# or

yarn install

```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env

REACT_APP_API_BASE_URL=http://localhost:8000

```

## 🚦 Running the Application

### Development Mode

```bash

npm start

```

Runs the app in development mode.\

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.


The page will reload when you make changes.\

You may also see any lint errors in the console.



### Production Build

```bash

npm run build

```

Builds the app for production to the `build` folder.\

It correctly bundles React in production mode and optimizes the build for the best performance.



### Testing

```bash

npm test

```

Launches the test runner in interactive watch mode.



## 🏗️ Project Structure



```

src/

├── components/

│   ├── FileUpload.js      # File upload component with validation

│   └── Dashboard.js       # Results dashboard with insights

├── services/

│   └── api.js            # API service for backend communication

├── App.js                # Main app with routing

├── App.css              # Styling and responsive design

└── index.js             # Application entry point

```



## 🎯 Key Components


### FileUpload Component

- Accepts audio/video files (MP3, WAV, MP4, etc.)
- File size and type validation
- Upload progress indication
- Automatic redirect to dashboard on success



### Dashboard Component

- Displays meeting transcription

- Shows AI-generated insights:

  - Key topics

  - Action items

  - Decisions made

  - Meeting summary

  - Participants

- Back navigation to upload new files



### API Service

- Centralized API calls to backend

- Error handling and response formatting

- Configurable base URL



## 🔧 Configuration



### API Integration

The frontend connects to your FastAPI backend. Update the API base URL in:

- `src/services/api.js`


### Supported File Types

- **Audio**: MP3, WAV, M4A, FLAC, OGG

- **Video**: MP4, AVI, MOV, WEBM (audio extracted)


## 📱 Usage

1. **Upload File**: Click "Choose Audio/Video File" or drag & drop
2. **File Validation**: System validates file type and size
3. **Processing**: File uploads and processes automatically
4. **View Results**: Redirects to dashboard with transcription and insights
5. **New Upload**: Click "Upload New File" to process another recording


## 🎨 Styling

The application uses:
- **CSS Grid & Flexbox** for responsive layouts
- **CSS Animations** for smooth transitions
- **Hover effects** and loading states



## 🔧 Troubleshooting

### Common Issues

#### 1. Backend Connection Error

**Error**: "Upload failed. Please check your connection"

**Solutions**:

- Ensure backend is running on `http://localhost:8000`
- Check CORS settings in backend
- Verify API base URL in configuration



#### 2. File Upload Fails

**Error**: File type or size errors

**Solutions**:

- Check file format is supported
- Ensure file size is under limit (usually 100MB)
- Try with a different audio file



#### 3. Dashboard Not Loading

**Error**: Meeting data not displayed

**Solutions**:

- Check browser console for errors
- Verify meeting ID in URL
- Ensure backend processed file successfully



## 🚀 Deployment

### Build for Production

```bash

npm run build

```



### Deploy to Static Hosting

The `build` folder can be deployed to:

- **Netlify**: Drag & drop build folder
- **Vercel**: Connect GitHub repository
- **AWS S3**: Upload build contents
- **GitHub Pages**: Use gh-pages package


## 📦 Dependencies

### Core Dependencies

- **React 18.1.1**: UI library
- **React Router Dom**: Navigation and routing
- **React Scripts**: Build tools and development server

### Development Tools
- **Create React App**: Project setup and build tools
- **ESLint**: Code linting
- **Testing Library**: Component testing utilities



## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request



## 🔄 Available Scripts

### `npm start`
Runs the app in development mode with hot reload.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production with optimized bundle.

### `npm run eject`
**Note: This is a one-way operation!**

Ejects from Create React App for full configuration control.



## 📄 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)



## 🆘 Support

For support and questions:

- Check the troubleshooting section above
- Create an issue in the repository
- Review browser console for error details

- <img width="1890" height="902" alt="image" src="https://github.com/user-attachments/assets/875eb719-b616-4d54-a619-9f4c009dbbc8" />



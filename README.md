# 📸 InstaXG — Social Media Platform

A modern full-stack social media application inspired by Instagram, built with the **MERN stack**.  
Users can create posts, follow others, manage profiles, and interact through likes, saves, and follow requests.

---

## 🚀 Features

### 👤 Authentication & Security
- Secure user registration & login
- JWT authentication with HTTP-only cookies
- Protected routes & session persistence

### 🏠 Feed System
- View posts from followed users
- Like & unlike posts ❤️
- Double-tap heart animation
- Save & unsave posts 🔖
- Real-time UI updates with toast notifications

### 📷 Post Management
- Create posts with image upload
- Delete posts instantly
- Optimized image rendering

### 👥 Follow System
- Send follow requests
- Accept / reject requests
- Cancel pending requests
- Unfollow users
- Remove followers
- Private follow approval workflow

### 🔍 User Search
- Search users instantly
- Follow/unfollow directly from search results
- Live follow status updates

### 👤 Profile System
- Edit bio & profile picture
- View followers & following
- Remove followers
- View saved posts
- Profile tabs (Posts / Saved)
- Empty state handling for saved posts

### 🎨 UI & UX Enhancements
- Glassmorphism card design
- Heart burst animation on double-tap
- Smooth hover & micro-interactions
- Responsive mobile layout
- Toast notifications for all actions
- Modern Instagram-style sidebar navigation

---

## 🛠 Tech Stack

### Frontend
- React.js
- React Router
- Context API (State Management)
- Axios
- React Toastify
- SCSS

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- Multer (file upload)
- ImageKit (image hosting)

---

## 🔐 Authentication Flow

1. User logs in or registers  
2. JWT stored in **HTTP-only cookie**  
3. Protected routes verify user session  
4. Persistent login without exposing token  

---

## ❤️ Post Interaction Logic

- Double-tap image → like + animation  
- Like button toggles state instantly  
- Save button updates UI optimistically  
- Toast notifications confirm actions  

---

## 👥 Follow Request Workflow

1. User sends follow request  
2. Request appears in recipient profile  
3. Recipient can:
   - Accept → becomes follower
   - Reject → request removed  
4. Sender can cancel pending request  

---

## 🎯 UI Highlights

✔ Heart burst animation  
✔ Modern sidebar navigation  
✔ Responsive design  
✔ Clean profile layout  
✔ Instagram-style interaction flow  

---

## ⚙️ Environment Setup

Create a `.env` file in backend:

```
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_key
```

---

## ▶️ Running the App

### Backend
```

npm install
npm run dev

```

### Frontend
```

npm install
npm run dev

```

---

## 🧠 Future Improvements

- Real-time notifications
- Stories feature
- Comments system
- Dark mode
- Push notifications
- Reels & short videos


---

⭐ If you like this project, consider giving it a star!

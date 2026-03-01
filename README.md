# 📸 InstaXG — Social Media Platform

A full-stack social media app inspired by Instagram, built using the **MERN stack**.
Users can share posts, follow others, and interact through likes, saves, and follow requests.

---

## 🚀 Key Features

| Module            | Features                                                        |
| ----------------- | --------------------------------------------------------------- |
| 🔐 Authentication | Secure login & register, JWT cookies, protected routes          |
| 🏠 Feed           | View posts, like/unlike ❤️, double-tap animation, save posts 🔖 |
| 📷 Posts          | Create & delete posts, image uploads                            |
| 👥 Follow System  | Follow requests, accept/reject, unfollow, remove followers      |
| 🔍 Search         | Find users instantly & follow directly                          |
| 👤 Profile        | Edit bio & picture, followers list, saved posts                 |
| 🎨 UI/UX          | Responsive design, glassmorphism cards, toast notifications     |

---

## 🛠 Tech Stack

| Layer    | Technology                                    |
| -------- | --------------------------------------------- |
| Frontend | React, React Router, Context API, Axios, SCSS |
| Backend  | Node.js, Express.js                           |
| Database | MongoDB & Mongoose                            |
| Auth     | JWT + HTTP-only cookies                       |
| Media    | Multer + ImageKit                             |
| UI Tools | React Toastify                                |

---

## 🔐 Authentication Flow

1. User logs in / registers
2. JWT stored in **HTTP-only cookie**
3. Protected routes verify session
4. User stays logged in securely

---

## ❤️ Post Interactions

* Double-tap → like + animation
* Instant UI updates
* Save & unsave posts
* Toast feedback for actions

---

## 👥 Follow Request Workflow

1. Send follow request
2. Receiver accepts/rejects
3. Accept → follower added
4. Sender can cancel pending request

---

## ⚙️ Environment Variables (Backend)

Create `.env`:

```
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
IMAGEKIT_PRIVATE_KEY=your_key
```

---

## ▶️ Run Locally

### Backend

```bash
npm install
npm run dev
```

### Frontend

```bash
npm install
npm run dev
```

---

## 🧠 Future Enhancements

* Comments system
* Real-time notifications
* Stories & reels
* Dark mode

---

⭐ If you like this project, consider giving it a star!

---

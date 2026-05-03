# 🗳️ NirvachakSetu — Election Education Platform

NirvachakSetu is a comprehensive full-stack web application designed to educate Indian citizens about the democratic election process. The platform provides structured learning modules, interactive quizzes, and an AI-powered assistant to ensure every voter is informed, empowered, and ready to participate in the world's largest democratic exercise.

---

## 🚀 Features

- **Educational Modules**: Deep dive into the Indian election system, covering everything from "What is an Election?" to "Electronic Voting Machines (EVMs)" and "Your Rights as a Voter."
- **Interactive Quizzes**: Test your knowledge with dynamically served quizzes categorized by difficulty.
- **AI Election Assistant**: A Gemini-powered chatbot that provides instant, clear answers to specific election-related queries.
- **Government-Grade UI**: A professional, high-contrast, and accessible interface following modern government website design standards.
- **Responsive Design**: Seamless experience across desktops, tablets, and mobile devices.
- **Hybrid Data Store**: Supports MongoDB for persistence with a seamless in-memory fallback for quick deployments and testing.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router 7](https://reactrouter.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **AI Integration**: [Google Generative AI (Gemini)](https://ai.google.dev/)

---

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (Local or Atlas) - *Optional, system will use in-memory store if DB is unavailable.*
- **Gemini API Key** - *Optional, required for AI Chat functionality.*

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/aishwaryanair440/election-assistance.git
cd election-assistance
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```
Start the backend server:
```bash
node server.js
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run build
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/modules` | Fetch all educational modules |
| `GET` | `/api/quizzes` | Fetch all quiz questions |
| `POST` | `/api/quizzes/submit` | Evaluate quiz answers and return score |
| `POST` | `/api/ask` | Interact with the Gemini AI Assistant |
| `GET` | `/api/seed` | Seed/Reset the database with initial content |
| `GET` | `/api/health` | Check API and Database status |

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve NirvachakSetu, please follow these steps:
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the ISC License. See `LICENSE` for more information.

---

## 📞 Support

For any queries or assistance, please call the **ECI Helpline: 1950** or visit the [Official ECI Website](https://eci.gov.in/).

*Developed with ❤️ for a stronger democracy.*
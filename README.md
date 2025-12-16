# Asynchronous Video Processing System (AsyncVideoPro)

AsyncVideoPro is a frontend dashboard that simulates an **asynchronous video processing pipeline**.
It allows users to upload videos, track background processing tasks in real time, and monitor system-level statistics through a clean, responsive UI.

The project demonstrates how modern frontend systems can **reflect backend state over time**, similar to real-world distributed video processing systems.

---

##  Key Features

*  **Video Upload Simulation**

  * Upload video files and track them instantly in the dashboard
*   **Asynchronous Task Tracking**

  * Each video spawns processing tasks (e.g., transcoding, analysis)
*  **Real-Time Status Updates**

  * UI polls the backend every second to reflect task progress
*  **Dashboard Statistics**

  * Visual summary of total videos, active tasks, completed tasks, and failures
*  **System Reset**

  * Clear all uploaded videos and tasks with a single click
*  **Modern UI**

  * Built with React, TypeScript, Tailwind CSS, and Lucide icons

---

##  System Architecture (Frontend Perspective)

```
User → React UI → Mock Backend Service → Periodic Polling → UI Updates
```

* No blocking operations on the UI
* Processing happens asynchronously
* State is persisted and refreshed automatically

This mirrors how real video systems use queues, workers, and polling/WebSockets.

---

## Project Structure

```
asyncvideopro/
│
├── components/
│   ├── VideoUploader.tsx      # Handles video uploads
│   ├── TaskList.tsx           # Displays processing tasks
│   ├── DashboardStats.tsx     # Summary statistics
│   └── StatusBadge.tsx        # Task state indicators
│
├── services/
│   └── mockBackend.ts         # Simulated backend logic
│
├── types.ts                   # Shared TypeScript interfaces
├── App.tsx                    # Main application logic
├── index.tsx                  # React entry point
├── index.html                 # HTML shell
│
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite build configuration
└── README.md
```

---

##  Tech Stack

* **Frontend Framework:** React 19 + TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Charts:** Recharts
* **State Updates:** Polling-based simulation
* **Backend:** Mock service (no real server)

---

##  Getting Started

### Prerequisites

* Node.js (v18 or later recommended)
* npm

### Installation

```bash
npm install
```

### Run the Application

```bash
npm run dev
```

The app will be available at:

```
http://localhost:5173
```

---

##  How Asynchronous Processing Is Simulated

* Videos and tasks are stored in a mock backend
* The frontend **polls every 1 second**
* Task states transition automatically:

  * `pending → processing → completed / failed`
* This design mimics:

  * Job queues
  * Background workers
  * Event-driven systems

---

##  Use Case

This project is ideal for demonstrating:

* Asynchronous system design
* Frontend–backend separation
* Real-time dashboards
* Distributed systems concepts
* Video processing workflows (conceptual)

---

## Future Enhancements

* Replace mock backend with a real API
* Add WebSocket-based updates
* Integrate actual video processing workers
* Add authentication and user roles
* Persist data using a database

---

##  Author

**Aryan Reddy**
GitHub: [https://github.com/Aryan-Reddy-pa](https://github.com/Aryan-Reddy-pa)

---



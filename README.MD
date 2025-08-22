# Recipe App

A full-stack recipe management application built with **React (frontend)** and **Node.js + Express + MongoDB (backend)**.  
Users can browse, search, and filter recipes by cuisine, rating, and title.  

---

## Features
- MongoDB-based backend for storing recipes
- REST API with search & pagination
- React frontend with filters, pagination, and a recipe drawer
- Custom star rating display
- Postman collection for API testing

---

##  Tech Stack
- **Frontend:** React, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Atlas or local)  

---

##  Setup Instructions

### 1 Clone the repo
```bash
git clone https://github.com/your-username/receipapp.git
cd receipapp
```
### Ensure your .env file in backend/ contains:
```bash
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

## 2 Setup MongoDB

- Use MongoDB Atlas or local MongoDB.
- Create a database (e.g., recipesDB) and collection recipes.
- Import sample data (if available):
- Or, if you have a script:
    ```bash 
    cd backend
    npm run import
    ``` 
- BAckend runs at http://localhost:5000

4️⃣ Run Frontend
## 3 Run Backend
```bash 
cd backend
npm install 
nodemon server.js
```

## 4 Run Frontend
```bash
cd frontend 
npm install 
npm run dev
```
- Frontend runs at http://localhost:5173
## Unit tests:
```bash 
cd backend 
npm test
```
- run the command in the new terminal
- while testing makesure the server is listening to the post 5000

##  API Testing
### Full API documentation is available here:
 - Postman Docs [https://documenter.getpostman.com/view/29171941/2sB3BLhSeW
 ]

### Example Endpoints
- GET /api/recipes?page=1&limit=10 → Fetch recipes with pagination
- GET /api/recipes/search?title=pasta&cuisine=italian&rating=4 → Search     recipes
- POST /api/recipes → Add new recipe
- GET /api/recipes/:id → Get single recipe details

## Scripts 

### Backend 
- npm start → Start backend server
- npm run import → Import recipes from US_reciep.json

### Frontend
- npm start → Start frontend React app

## Contribution

- Fork the repo and create feature branches.
- PRs are welcome!
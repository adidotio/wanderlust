# 🌍 Wanderlust

Wanderlust is a **full-stack web application** inspired by listing and review platforms.
It is built to demonstrate **real-world authentication, authorization, and ownership-based access control** using Node.js, Express, MongoDB, and EJS.

The project focuses on **secure CRUD operations**, where users can only modify the data they own.

## 📌 What is this project?

Wanderlust allows users to:

* Create an account and log in
* Add listings (with price, location, description, etc.)
* View listings created by other users
* Add reviews to listings
* Securely edit or delete **only their own listings**
* Securely delete **only the reviews they authored**

The application enforces **strict authorization rules**:

* Only the **listing owner** can edit or delete a listing
* Only the **review author** can delete a review
* Unauthorized users are blocked both at the **UI level** and the **backend level**

This project is ideal for learning how **authentication and authorization are handled in real production applications**.


## ✨ Features

* User authentication (signup, login, logout)
* Session-based authentication using Passport.js
* Ownership-based authorization for listings
* Author-based authorization for reviews
* RESTful routing
* Server-side validation with Joi
* Flash messages for user feedback
* MongoDB relationships using Mongoose `populate`
* Clean MVC folder structure
* Bootstrap-based UI


## 🛠 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Authentication:** Passport.js, passport-local-mongoose
* **Templating Engine:** EJS, EJS-Mate
* **Validation:** Joi
* **Styling:** Bootstrap


## 📂 Project Structure (Overview)

```
wanderlust/
│
├── models/        # Mongoose schemas (User, Listing, Review)
├── routes/        # Express routes (listings, reviews, users)
├── middleware/    # Custom authentication & authorization middleware
├── views/         # EJS templates
├── public/        # Static files (CSS, images)
├── utils/         # Error handling utilities
├── app.js         # Main application file
└── package.json
```


## ⚙️ How to Set Up Locally

Follow these steps to run the project on your local machine.


### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/wanderlust.git
cd wanderlust
```


### 2️⃣ Install Dependencies

Make sure you have **Node.js** installed.

```bash
npm install
```


### 3️⃣ Start MongoDB

Ensure MongoDB is running locally.

```bash
mongod
```

Default connection used:

```
mongodb://127.0.0.1:27017/wanderlust
```


### 4️⃣ (Optional) Seed Initial Data

If you have seed data:

```bash
node init/index.js
```


### 5️⃣ Run the Application

```bash
nodemon app.js
```

or

```bash
node app.js
```


### 6️⃣ Open in Browser

```
http://localhost:8080
```


## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repository and submit a pull request.


## 📜 License

This project is for learning and educational purposes.


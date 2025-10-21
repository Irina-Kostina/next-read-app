# 📚 NextRead

NextRead is a simple and smart **book recommendation app** that helps people find their next great read based on their interests, favourite genres, and authors.

---

## App Purpose

**NextRead** is built to make it easy and fun for users to discover new books they’ll enjoy.

When you finish a book, it can be hard to decide what to read next — there are too many choices online. **NextRead** solves this problem by showing book suggestions based on what you already like.

You can:

- Search for books by title, author, or genre.
- Filter results by language or rating.
- Save your favourites to keep track of what you love.
- Get smart recommendations (currently rule-based) — for example:
  > If you liked _The Hobbit_, you’ll see more fantasy adventure books.

The goal of **NextRead** is to make book discovery personal and effortless — like having a friendly reading assistant who always knows what you’ll enjoy next.

---

## How It Works

1. **Search for books** using the search bar.
2. **Apply filters** to narrow down results (by author, genre, or rating).
3. **Click on a book card** to view details.
4. **Add books to your favourites** to build your personal reading list.
5. **View recommendations** on the home page when you haven’t searched yet — these are generated based on your past favourites or last read genre.

---

## Tech Stack

- **Frontend:** React + TypeScript
- **Routing:** React Router
- **State Management:** React Context + React Query
- **Styling:** CSS / Tailwind (if added later)
- **Backend (optional):** Express (for API handling)
- **Data:** Book data fetched from a public books API (or local dataset)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Irina-Kostina/next-read-app
```

### 2. Install dependencies

```bash
cd nextread
npm install
```

### 3. Run the app

```bash
npm run dev
```

The app will open in your browser (default: http://localhost:5173).

## 🔮 Future Improvements

Add user authentication (login/signup).

Improve recommendation system with AI or collaborative filtering.

Add user reviews and book ratings.

Save reading history.

Dark/light mode switch.

Mobile app version built with React Native.

## Learning Goals

This project was created as a study exercise to:

Practice React and TypeScript in a real app.

Work with APIs and async data fetching.

Build filtering and recommendation logic.

Understand how to manage state and search params.

Create a simple, user-friendly UI.

## License

This project is for educational and personal portfolio purposes.
All book data is powered by a public API.

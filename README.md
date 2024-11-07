# To start project: 
1. Create a `.env` file with `DATABASE_URL` in the `backend` folder.
2. For development: `docker compose up --build`
3. If the database is not seeded, run `npx prisma db seed`. *(Note: This will modify the database content by adding initial data)*

---

# Art Lookup Platform

This repository contains the codebase for an art lookup platform where users can browse, favorite, and explore artworks. This project uses a **PERN stack** (PostgreSQL, Express, React, Node.js) with Docker for local development and cloud deployment.

---

## Project Architecture

- **Frontend**: Built with **React** and **TypeScript**, using **Axios** for HTTP requests and **TanStack Query** for efficient data fetching, caching, and state management.
- **Backend**: **Node.js** with **Express** for RESTful APIs, implementing security and authentication with **JWT**, and using **Prisma ORM** for efficient database management.
- **Database**: **PostgreSQL**, managed with **Prisma ORM** for relational data management.
- **Deployment**: Frontend on **Vercel**, Backend and Database on **Render**, using **Docker** for backend deployment.

---

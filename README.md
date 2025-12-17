🦈 Sharks Management System

A full-featured Barber Shop Management Platform built to manage branches, barbers, bookings, queues, orders, and customer feedback — all in one scalable system.

[LIVE](https://shark-s-management-system.vercel.app/)

🚀 Project Overview

Sharks Management System is a modern web-based platform designed for barber shop chains.
It covers booking management, branch operations, real-time queue system, and e-commerce orders, with secure authentication and role-based access.

The system is built with scalability, clean architecture, and real-world business logic in mind.

🧱 System Architecture
client/     → Frontend (Angular)
server/     → Backend (ASP.NET Core Web API)
database/   → SQL Server

🛠️ Tech Stack
Backend

ASP.NET Core Web API (.NET 9)

Entity Framework Core

ASP.NET Identity

JWT Authentication

Role-Based Authorization

SQL Server

Cloudinary (Image uploads)

Docker (Deployment)

Render (Hosting)

Frontend

Angular

TypeScript

RxJS

REST API integration


🔐 Authentication & Roles

The system uses JWT + ASP.NET Identity with the following roles:

Admin

Branch Manager

Barber

Customer

Each role has strict backend authorization, ensuring:

No client-side data tampering

Branch managers can only access their own branch

Admin-only operations are fully protected

✂️ Core Features
🏢 Branch Management

Create & update branches

Assign branch managers

Upload branch images

View branch statistics

💇 Barber Management

Assign barbers to branches

Weekly schedules

Chair assignment support

Queue-based service flow

📅 Booking System

Service booking with time slots

Barber & branch selection

Booking statuses:

Pending

Completed

Cancelled

NoShow

Payment tracking

🧍 Queue Management System (Real-Time Logic)

Designed to simulate real barbershop flow:

Chairs per branch

Assign barbers to chairs

Waiting queue with priority

Auto-assign next customer when chair becomes free

Archive completed bookings

Manual enqueue support

🛒 E-Commerce Orders

Product catalog (hair & beard products)

Orders with:

User info

Items

Total price

Payment method

Order status (Pending, Completed)

Order items tracking

⭐ Customer Feedback System

Branch-based ratings (0–5 stars)

IP-based spam protection:

Same IP can submit once every 24 hours

Simple & fast submission

🗃️ Database Design Highlights

Fully normalized schema

Indexed queue tables for fast access

Precision handling for prices (decimal(18,2))

Identity tables integrated with business entities

Designed for analytics (historical bookings & revenue)

🐳 Deployment
Docker

Multi-stage build for optimized image size

Production-ready container

Environment-based configuration

Hosting

Render

Automatic port binding

Secure environment variables

MSSQL external database support

📦 Environment Variables

Example:

ConnectionStrings__DefaultConnection=Server=...;Database=...;
Jwt__Key=your-secret-key
Jwt__Issuer=sharks-api
Jwt__Audience=sharks-client
Cloudinary__CloudName=...
Cloudinary__ApiKey=...
Cloudinary__ApiSecret=...

🧪 Mock Data & Testing

Realistic mock data for:

Branches

Barbers

Bookings (30+ days history)

Orders

Feedback

Designed for analytics & dashboard testing

🎯 Project Goals

Real-world business logic

Secure & scalable architecture

Clean separation of concerns

Ready for future features:

Analytics dashboards

Notifications

Mobile apps

Payments gateways

👨‍💻 Developer

Abanoub Milad
Full Stack Developer
Specialized in:

ASP.NET Core

Angular

System Design

Real-time business systems

📌 Status

✅ Active Development
🚀 Production-ready backend

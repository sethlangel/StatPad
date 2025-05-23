# StatPad

StatPad is a full-stack web application developed for CSC 307
(Software Engineering) under Professor Kubiak during Spring
2025, demonstrating modern web development practices and
technologies. The application implements a robust authentication
system and user management features using industry-standard
tools and frameworks.

## Overview

This project serves as a practical implementation of web
development concepts, showcasing:

- Full-stack development with modern JavaScript frameworks
- Authentication and authorization implementation
- Database integration and management
- API design and implementation
- TypeScript integration
- Mobile-responsive design principles

## Technical Architecture

### Frontend Implementation

- Next.js framework for server-side rendering and routing
- TypeScript for type safety and better development experience
- Tailwind CSS for responsive and maintainable styling
- Capacitor integration for cross-platform mobile support

### Backend Implementation
- Express.js for RESTful API development
- Supabase for authentication and database services
- Node.js runtime environment
- Middleware implementation for request processing

### Sequence Diagrams
![Editor _ Mermaid Chart-2025-05-23-014418](https://github.com/user-attachments/assets/047358ed-633e-406e-bca7-914e6be6f3f1)
![Editor _ Mermaid Chart-2025-05-23-014536](https://github.com/user-attachments/assets/a4047cde-a4d1-429a-abd7-f2703f94607d)
![Editor _ Mermaid Chart-2025-05-23-014549](https://github.com/user-attachments/assets/85b36003-e444-4244-b7c4-9f8b4af58b1b)

## Development Requirements

### System Requirements

- Node.js (v18 or higher)
- npm package manager
- Supabase account and project credentials

### Development Setup

1. Repository Setup:

```bash
git clone https://github.com/yourusername/StatPad.git
cd StatPad
```

2. Dependency Installation:

```bash
npm install
```

3. Environment Configuration:

   - Configure `.env` files in both frontend and backend
     directories
   - Set up Supabase credentials and other environment variables

4. Development Server Initialization:

```bash
npm start
```

## Project Structure

```
StatPad/
├── frontend/           # Next.js frontend implementation
├── backend/           # Express.js backend implementation
├── package.json       # Project configuration and dependencies
└── README.md         # Project documentation
```

## Development Workflow

### Available Commands

- `npm start` - Initializes development environment
- `npm run format` - Enforces code style consistency
- `npm test` - Executes test suite (pending implementation)

### Authentication Implementation

The application implements a secure authentication system using
Supabase, featuring:

- User registration and login
- Protected route implementation
- Session management
- User profile handling

## Academic Context

This project was developed for CSC 307 (Software Engineering)
under the guidance of Professor Kubiak during Spring 2025,
demonstrating practical application of:

- Software development methodologies
- Full-stack web development
- Database design and implementation
- Security best practices
- API design principles
- Team collaboration and version control
- Software engineering best practices

## Documentation

For detailed information about contributing to this project,
please refer to [CONTRIBUTING.md](CONTRIBUTING.md).

# Architecture Documentation

_Last updated: June 4, 2025_

## Monorepo Overview
The `StatPad` project is organized as a monorepo using **npm workspaces**. This approach allows us to develop and manage both the frontend and backend in a unified repository.

```
StatPad/
├── frontend/          # Next.js frontend implementation
├── backend/           # Express.js backend implementation
├── docs/              # Architecture and UML documentation
├── package.json       # Project configuration and dependencies
└── README.md          # Project documentation
```

## Frontend Implementation

- Next.js framework for server-side rendering and routing
- TypeScript for type safety and better development experience
- Tailwind CSS for responsive and maintainable styling
- Capacitor integration for cross-platform mobile support

### Structure
```
frontend/
├── ios/
├── src/
    ├── app/            
    │   ├── home/      
    │   ├── login/      
    │   ├── signup/      
    │   ├── social/      
    │   ├── stats/      
    │   └── watch/      
    ├── components/          
    ├── hooks/          
    ├── public/         
    └── styles/         
```

## Backend Implementation
- Express.js for RESTful API development
- Supabase for authentication and database services
- Node.js runtime environment
- Middleware implementation for request processing

### Structure
```
backend/
├── api/
│   └── index.js         
├── middleware/
│   └── auth.js         
├── routes/
│   └── auth.js
│   └── home.js
│   └── social.js
│   └── stats.js
│   └── users.js
│   └── watch.js
├── supabase-client.js
└── schema.sql
```

### Sequence Diagrams
![Editor _ Mermaid Chart-2025-05-23-014418](https://github.com/user-attachments/assets/047358ed-633e-406e-bca7-914e6be6f3f1)
![Editor _ Mermaid Chart-2025-05-23-014536](https://github.com/user-attachments/assets/a4047cde-a4d1-429a-abd7-f2703f94607d)
![Editor _ Mermaid Chart-2025-05-23-014549](https://github.com/user-attachments/assets/85b36003-e444-4244-b7c4-9f8b4af58b1b)

---

See [uml.md](./uml.md) for diagram-level documentation.
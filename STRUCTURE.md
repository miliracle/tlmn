# Project Folder Structure

Complete folder structure for the Tiến Lên Miền Nam platform.

```
tlmn/
├── .vscode/                    # VS Code settings
│   ├── settings.json
│   └── extensions.json
├── docs/                       # Project documentation
│   ├── core_concept.md
│   └── project_planning.md
│
├── frontend/                   # React + Vite Frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   └── cards/
│   │   │       └── Card.tsx
│   │   ├── pages/             # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── TableLobbyPage.tsx
│   │   │   ├── GameBoardPage.tsx
│   │   │   └── BotEditorPage.tsx
│   │   ├── store/              # Redux Toolkit store
│   │   │   ├── index.ts
│   │   │   └── slices/
│   │   │       ├── uiSlice.ts
│   │   │       └── gameSlice.ts
│   │   ├── hooks/              # Custom React hooks
│   │   │   └── useSocket.ts
│   │   ├── services/          # API and socket services
│   │   │   ├── api.ts
│   │   │   └── socket.ts
│   │   ├── utils/              # Utility functions
│   │   │   └── cardUtils.ts
│   │   ├── types/              # TypeScript types
│   │   │   └── game.ts
│   │   ├── features/           # Feature modules
│   │   ├── router.tsx          # TanStack Router config
│   │   ├── main.tsx            # App entry point
│   │   └── index.css           # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .eslintrc.cjs
│
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── modules/           # Feature modules
│   │   │   ├── auth/         # Authentication module
│   │   │   │   ├── dto/
│   │   │   │   │   ├── register.dto.ts
│   │   │   │   │   └── login.dto.ts
│   │   │   │   ├── guards/
│   │   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   │   └── local-auth.guard.ts
│   │   │   │   ├── strategies/
│   │   │   │   │   ├── jwt.strategy.ts
│   │   │   │   │   └── local.strategy.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.module.ts
│   │   │   ├── bots/          # Bot management module
│   │   │   │   ├── dto/
│   │   │   │   │   └── create-bot.dto.ts
│   │   │   │   ├── bots.controller.ts
│   │   │   │   ├── bots.service.ts
│   │   │   │   └── bots.module.ts
│   │   │   ├── games/         # Game management module
│   │   │   │   ├── games.controller.ts
│   │   │   │   ├── games.service.ts
│   │   │   │   └── games.module.ts
│   │   │   ├── tables/        # Table management module
│   │   │   │   ├── tables.controller.ts
│   │   │   │   ├── tables.service.ts
│   │   │   │   └── tables.module.ts
│   │   │   ├── users/         # User management module
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   └── users.module.ts
│   │   │   ├── websocket/     # WebSocket gateway module
│   │   │   │   ├── websocket.gateway.ts
│   │   │   │   ├── websocket.service.ts
│   │   │   │   └── websocket.module.ts
│   │   │   └── prisma/        # Prisma service module
│   │   │       ├── prisma.service.ts
│   │   │       └── prisma.module.ts
│   │   ├── decorators/        # Custom decorators
│   │   ├── guards/            # Shared guards
│   │   ├── interceptors/       # Interceptors
│   │   ├── utils/             # Utility functions
│   │   │   └── gameEngine.ts
│   │   ├── types/             # TypeScript types
│   │   │   └── game.ts
│   │   ├── app.module.ts     # Root module
│   │   └── main.ts            # Application entry point
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── package.json
│   ├── nest-cli.json
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   ├── .eslintrc.js
│   ├── .prettierrc
│   ├── .gitignore
│   └── env.example
│
├── shared/                     # Shared types and utilities
│   ├── src/
│   │   ├── types/
│   │   │   ├── game.ts
│   │   │   └── card.ts
│   │   ├── utils/
│   │   │   └── cardUtils.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── package.json                # Root workspace config
├── pnpm-workspace.yaml         # pnpm workspace config
├── .gitignore
├── .prettierrc
├── README.md
├── SETUP.md
└── STRUCTURE.md                # This file
```

## Key Technologies

### Frontend
- **React 18+** with Vite
- **@tanstack/react-router** for routing
- **@reduxjs/toolkit** for state management
- **@tanstack/react-query** for server state
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Socket.io-client** for real-time communication
- **Monaco Editor** for bot code editing

### Backend
- **NestJS** with TypeScript
- **Prisma ORM** for database access
- **PostgreSQL** database
- **Socket.io** for WebSocket communication
- **JWT** for authentication
- **Zod** for validation
- **bcrypt** for password hashing

### Shared
- Common TypeScript types
- Shared utility functions
- Game logic utilities

## Package Management

This project uses **pnpm workspaces** to manage multiple packages:
- `frontend` - React application
- `backend` - NestJS application
- `shared` - Shared types and utilities

All packages are managed from the root with pnpm commands.


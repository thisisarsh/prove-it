# Prove IT

![logo](/frontend/public/prove-it-logo-200.png)

## [DOCUMENTATION](https://proveit-documentation-ht6401839-uofw-9d7499a8c37c5706bcc2952bfc.gitlab.io/)

__(!) Please follow branch naming conventions (!)__
\
__(!) Please merge back into 'develop' as soon as your feature works (!)__

## Building the project
Requirements:
- [Node.js (LTS)](https://nodejs.org/en)

### Setting up development environment

#### Clone and install dependencies
```
git clone -b develop git@gitlab.com:ht6401839/uofw/proveit.git
(cd frontend && npm install) && (cd backend && npm install)
```

#### Run TWO terminals
 - Terminal 1 - frontend
    ```
    cd frontend
    npm run dev
    ```
 - Terminal 2 - backend
    ```
    cd backend
    npm run dev
    ```

# File structure
```
/
├── backend
│   ├── controllers
│   └── routes
└── frontend
    └── src
        ├── components
        ├── contexts
        ├── hooks
        ├── routes
        └── styles
```

# Environment Variables

You must have `.env` files in the __/backend__ and in the __/frontend__.

```
/
└── backend
    └── .env    -> place the file here
└── frontend
    └── .env    -> place the file here
```

## Backend
The backend .env file should contain the following text:

```
API_TOKEN=<insert API key>
```

## Frontend
The frontend .env file should contain the following text:

```
VITE_SERVER=http://localhost:5000
```

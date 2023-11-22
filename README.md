# HT React website

## Tech Stack - Frontend
- React + TypeScript + Vite

## Tech Stack - Backend
- Node + Express

1.  Clone repository

- SSH: `git clone git@gitlab.com:ht6401839/uofw/proveit.git`
- HTTPS: `git clone https://gitlab.com/ht6401839/uofw/proveit.git`

2. Install all dependencies\
    `(cd frontend && npm install) && (cd backend && npm install)`

3. Run the dev environment\

Run two terminals:

- Terminal 1 - frontend(client side)

    ```
    cd frontend
    npm run dev
    ```

-  Terminal 2 - backend(server side)
    ```
    cd backend
    node index.js
    ```

### Building for production


# File structure

```
/
├── backend
└── frontend
```

# API access

You must have `.env` files in the /backend and in the /frontend.

```
/
└── backend
    └── .env    -> place the file here
└── frontend
    └── .env    -> place the file here
```

The backend .env file should contain the following text:

```
API_TOKEN=<insert API key>
```
The frontend .env file should contain the following text:

```
VITE_SERVER=https://localhost:5000
```

\*\*This branch acts as an intermediate for the code in development and the code in production.
All other branches are first merged into this branch.
Other branches will be deleted after merging.

After the final code review and testing, the app will be deployed through the main after merging 'develop' into 'main'.

Do not delete this branch.
Do not merge other branches directly into 'main'.\*\*

# HomeTrumpeter Website (New)

## Tech Stack

- React + TypeScript + Vite

## Building the project

Requirements:

- [Node.js (LTS)](https://nodejs.org/en)

### Setting up development environment

1.  Clone repository\

- SSH: `git clone -b react-vite git@gitlab.com:ht6401839/uofw/proveit.git`
- HTTPS: `git clone -b react-vite https://gitlab.com/ht6401839/uofw/proveit.git`

2.  Install all dependencies\
    `cd frontend`
    `npm install`

3.  Run the dev environment\
    `cd frontend`
    `npm run dev`
    `cd backend`
    `node index.js`

# BOTH FRONTEND AND BACKEND MUST BE RUNNING AT THE SAME TIME, USE 2 DIFFERENT TERMINAL

### Building for production

1.  Clone repository\
    `git clone -b react-vite git@gitlab.com:ht6401839/uofw/proveit.git`

2.  Install all dependencies\
    `npm install`

3.  Run the build command - your files will appear in the `/dist` folder\
    `npm run build`

# Dependencies in backend
- express
- axios
- body-parser
- cors
- dotenv

# File structure

```
/
├── backend
└── frontend
```

# API access

We are storing the API key locally in the environment variables to improve security and reduce risks.
You can find the API key in the video that HomeTrumpeter shared on Google Drive.\
\
You must have the `.env` file in the /backend.

```
/
└── backend
    └── .env    -> place the file here
```

The .env file should contain the following text:

```
API_TOKEN=<insert API key>
```

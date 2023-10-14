# React + TypeScript + Vite

## Building the project
Requirements:
- [Node.js (LTS)](https://nodejs.org/en)

### Setting up development environment

   1. Clone repository\
   `git clone -b react-vite git@gitlab.com:ht6401839/uofw/proveit.git`

   2. Install all dependencies\
   `npm install`

   3. Run the dev environment\
   `npm run dev`

### Building for production

   1. Clone repository\
   `git clone -b react-vite git@gitlab.com:ht6401839/uofw/proveit.git`

   2. Install all dependencies\
   `npm install`

   3. Run the build command - your files will appear in the `/dist` folder\
   `npm run build`

# File structure
```
/
├── public
└── src
    ├── assets      -> logos, photos, fonts, etc.
    ├── components  -> nav bar, buttons, text box, etc.
    ├── routes      -> pages that will be accessed by URL (1 .tsx file per page)
    └── styles      -> stylesheets
```
# API access
We are storing the API key locally in the environment variables to improve security and reduce risks.
You can find the API key in the video that HomeTrumpeter shared on Google Drive.\
\
You must have the `.env` file in the **root directory**.
```
/
├── .env    -> place the file here
├── public
└── src
    └── ...
```
The .env file should contain the following text:
```
VITE_HT_API_KEY=<insert api key>
```
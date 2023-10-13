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
    

## Description

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

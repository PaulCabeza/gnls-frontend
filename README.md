# Genlogs User Portal Simulation

## Description

This is a web application that allows users to search for carriers for their logistics needs. It utilizes the Google Maps API for city autocomplete and displays routes on an interactive map. The application also connects to a backend to retrieve information about available carriers.

## Technologies Used

- React JS
- Google Maps API
- Tailwind CSS
- Flowbite
- Jest (for testing)

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v5.6 or higher)

## Project Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/paulcabeza/genlogs-user-portal.git
   cd genlogs-user-portal
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:

   Create a `.env` file in the root of the project and add your API keys:

   ```plaintext
   REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
   REACT_APP_BACKEND_URL=your_backend_url
   ```

   Make sure to replace `your_api_key_here` with your actual Google Maps API key.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## Contact

For more information, you can contact [Paul Cabeza](paulcabezadev@gmail.com).
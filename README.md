# <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png" width="30" height="30"> Gmail Sort

Welcome to **Gmail Sort**! This project helps you sort your Gmail emails into categories such as Primary, Important, Less Important, Spam, and more.

## Overview

Gmail Sort is built using Next.js 14 and provides an intuitive interface for organizing your Gmail inbox. The project is deployed on Vercel, and you can access it [here](https://sortgmail.vercel.app/).

## Features

- **Primary**: Emails that are identified as the most important.
- **Important**: Emails marked as important by the user or the system.
- **Less Important**: Emails that are not crucial and can be read later.
- **Spam**: Emails that are identified as spam.

## Installation

To run this project locally, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/tsahil01/gmail-sort
    cd gmail-sort
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env.local` file in the root directory and add the following variables:

    ```plaintext
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=mysecret
    GEMINI_API_KEY=your-gemini-api-key
    ```

4. **Set up Google Console for OAuth:**

    - Go to the [Google Cloud Console](https://console.cloud.google.com/).
    - Create a new project or select an existing project.
    - Navigate to the **OAuth consent screen** and configure your app details.
    - Go to **Credentials** and create a new OAuth 2.0 Client ID.
    - Set the **Authorized redirect URIs** to `http://localhost:3000/api/auth/callback/google`.
    - Copy the **Client ID** and **Client Secret** to your `.env.local` file.

5. **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Deployment

This project is deployed on Vercel. To deploy your own instance, follow these steps:

1. **Create a Vercel account** at [Vercel](https://vercel.com).
2. **Install Vercel CLI:**

    ```bash
    npm install -g vercel
    ```

3. **Deploy the project:**

    ```bash
    vercel
    ```

    Follow the prompts to deploy your project.

## Usage

1. **Log in with your Google account:**

    - On the homepage, click the "Log in with Google" button.
    - Follow the prompts to allow the app to access your Gmail account.

2. **Enter your Gemini API Key:**

    - If you have a Gemini API Key, enter it when prompted.
    - If you don't have a key, use this one for testing: `AIzaSyBI0gTFb58ULUi-WtLTUyQ4Zpt380526M0`.

3. **Classify your emails:**

    - Once logged in, your emails will appear.
    - Click the "Classify" button to categorize your emails into Primary, Important, Less Important, and Spam.


## Contact

If you have any questions or suggestions, feel free to open an issue or reach out me.

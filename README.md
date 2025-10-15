# Chat App Backend (Firebase)

This is the backend for a chat application, built using Firebase. The project leverages several Firebase services such as Authentication, Cloud Firestore, Realtime Database, and Cloud Functions.

## Project Structure

The project includes the following services:

*   **Authentication**: For user management and authentication.
*   **Cloud Firestore**: A flexible, NoSQL database for storing chat data and other information.
*   **Realtime Database**: A real-time database, which can be used for data requiring rapid synchronization.
*   **Cloud Functions**: Server-side functions that enable business logic without the need for managed servers.

---

## Local Setup and Run

To run the backend locally using Firebase emulators, follow these steps:

### Prerequisites

*   [Node.js](https://nodejs.org/) (It is recommended to match the version defined in the project; currently, the project is configured for Node.js 18 but uses the host's Node.js 22).
*   [Firebase CLI](https://firebase.google.com/docs/cli) installed globally.

---

### Running the Emulators

1.  Navigate to the project's root directory:

    ```bash
    cd chat-app-backened
    ```

2.  Install the Cloud Functions dependencies (if you haven't already):

    ```bash
    cd functions
    npm install
    cd ..
    ```

3.  Start the Firebase emulators:

    ```bash
    firebase emulators:start
    ```

    This action will start the following emulators:

    *   **Authentication Emulator**: `http://127.0.0.1:9099`
    *   **Functions Emulator**: `http://127.0.0.1:5001`
        *   Example API endpoint: `http://127.0.0.1:5001/chatapp-f3bc9/us-central1/api`
    *   **Firestore Emulator**: `http://127.0.0.1:8080`
    *   **Realtime Database Emulator**: `http://127.0.0.1:9000`

    All emulators can be viewed and managed through the Emulator UI at: `http://127.0.0.1:4000/`

---

### 🗂️ Persisting Emulator Data Between Runs

By default, the Firebase emulators start with empty data every time they are run. To prevent losing data (e.g., clients you already added), you can use the `--import` and `--export-on-exit` flags to persist data between emulator sessions.

#### Steps

1.  Create a folder to store emulator data (if it doesn't exist):

    ```bash
    mkdir emulator-backup
    ```

    On Windows PowerShell, use:

    ```powershell
    New-Item -ItemType Directory -Name "emulator-backup"
    ```

2.  Start the emulators with data persistence:

    ```bash
    firebase emulators:start --import=./emulator-backup --export-on-exit
    ```

    Any data added to Firestore, Realtime Database, or Authentication will now be saved when you stop the emulators and reloaded the next time you start them with the same command.

#### ⚠️ Notes

*   Always stop the emulators gracefully using `Ctrl + C` and wait for the confirmation that all emulators have stopped.
*   If the emulators are killed forcefully (e.g., closing the terminal window), data might not be saved.
*   This method works for Firestore, Realtime Database, and Authentication emulators.
*   Make sure to review and adjust Firebase security rules for your development and production environments.

---

### Adding the `serviceAccountKey.json` File

For the backend to interact with Firebase services (especially Cloud Functions), a `serviceAccountKey.json` file containing identification details is required. **This file will be provided separately.**

**Steps to add the `serviceAccountKey.json` file:**

1.  **Obtain the file**: Ensure you have received the `serviceAccountKey.json` file from the code provider.
2.  **Place the file in the correct location**:
    *   Place the `serviceAccountKey.json` file directly in the **root directory** of your `chat-app-backend` project.

    **⚠️ Important Security Warning**: This file grants full administrative access to your Firebase project. **Never commit this file to a public repository (such as GitHub).** It must be handled with extreme care and excluded from version control using a `.gitignore` file.

---

### Deployment

To deploy the project to a real Firebase environment, use the command:

```bash
firebase deploy

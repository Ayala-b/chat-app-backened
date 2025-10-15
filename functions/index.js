const admin = require('firebase-admin');
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

// Initialize Firebase Admin SDK
admin.initializeApp();
console.log("admin.firestore.FieldValue:", admin.firestore.FieldValue);

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Middleware for token verification (authorization)
app.use(async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    let idToken;

    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        idToken = authorizationHeader.split('Bearer ')[1];
    }

    if (!idToken) {
        return res.status(401).send('Unauthorized: No token provided');
    }

    if (idToken.startsWith('mock-token-')) {
        const userUid = idToken.split('mock-token-')[1];
        if (userUid) {
            req.user = { uid: userUid, isEmulator: true };
            console.log("Emulator detected: Mock token used for UID:", userUid);
            return next();
        } else {
            return res.status(401).send('Unauthorized: Invalid mock token format');
        }
    } else {
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            req.user = decodedToken;
            console.log("Production token verified for UID:", decodedToken.uid);
            return next();
        } catch (error) {
            return res.status(401).send('Unauthorized: Invalid or expired ID token');
        }
    }
});

// Route for creating a new client
app.post('/clients', async (req, res) => {
    try {
        const { name, phone, email } = req.body;
        const userId = req.user.uid;

        if (!name || !phone || !email) {
            return res.status(400).send('Missing client data');
        }

        // Check for duplicate clients by email for the current user
        const clientsRef = admin.firestore().collection('users').doc(userId).collection('clients');
        const existingClientQuery = await clientsRef
            .where('email', '==', email)
            .limit(1)
            .get();

        if (!existingClientQuery.empty) {
            return res.status(409).send({ error: 'Client with this email already exists for this user.' });
        }

        // Set creation timestamp, using serverTimestamp for production
        const createdAt = req.user.isEmulator
            ? new Date()
            : admin.firestore.FieldValue.serverTimestamp();

        await clientsRef.add({
            name,
            phone,
            email,
            createdAt
        });

        return res.status(201).send({ message: 'Client added successfully!', userId });
    } catch (error) {
        console.error('Error in /clients endpoint:', error);
        return res.status(500).send({ error: 'Failed to add client', details: error.message });
    }
});

exports.api = functions.https.onRequest(app);
const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

admin.initializeApp();

const app = express();

// Enable CORS
app.use(cors({ origin: true })); 

// Parse JSON bodies
app.use(express.json());

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(403).json({ error: 'Unauthorized: No token provided or malformed.' });
  }
  const idToken = req.headers.authorization.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying ID Token:", error);
    return res.status(403).json({ error: 'Unauthorized: Invalid token.' });
  }
};

// POST /clients endpoint
app.post('/clients', authMiddleware, async (req, res) => {
    const userUid = req.user.uid;
    const { name, phone, email } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({ error: 'Missing client data: name, phone, and email are required.' });
    }

    try {
        const clientsRef = admin.firestore().collection('clients');

        // Check if client with the same email already exists
        const existingClientSnapshot = await clientsRef
            .where('email', '==', email)
            .get();

        if (!existingClientSnapshot.empty) {
            return res.status(400).json({ error: 'Client with this email already exists.' });
        }

        // Add new client
        const newClientRef = clientsRef.doc();
        await newClientRef.set({
            name,
            phone,
            email,
            userId: userUid,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return res.status(201).json({ id: newClientRef.id, message: 'Client added successfully' });
    } catch (error) {
        console.error("Error adding client:", error);
        return res.status(500).json({ error: 'Failed to add client', details: error.message });
    }
});

exports.api = functions.https.onRequest(app);

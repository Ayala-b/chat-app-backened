const admin = require("firebase-admin");

// אתחול Firebase Admin עם קובץ service account
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid = "yikIAJWYkEhDOkBk40gmV730Rcj2"; // UID של המשתמש שרוצה להיות מנהל

async function generateCustomToken() {
  try {
    const customToken = await admin.auth().createCustomToken(uid);
    console.log("Custom Token:", customToken);
    console.log("כעת אפשר להשתמש ב-Custom Token כדי לקבל ID Token דרך Firebase SDK ב-client");
    process.exit();
  } catch (error) {
    console.error("Error creating custom token:", error);
    process.exit(1);
  }
}

generateCustomToken();

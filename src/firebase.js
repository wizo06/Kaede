const serviceAccount = require("../config/serviceAccountKey.json");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp({
  credential: cert(serviceAccount),
});

exports.db = getFirestore();

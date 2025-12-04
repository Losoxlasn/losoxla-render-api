require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

// ---- Health Check Render ----
app.get('/ping', (req, res) => {
  res.status(200).send('ok');
});

// ---- WhatsApp Webhook UltraMsg ----
app.post('/whatsapp', (req, res) => {
  const { message, from } = req.body;

  if (!message || !from) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  console.log("WhatsApp webhook received:", message, "from:", from);
  res.status(200).json({ status: "received" });
});

// ---- Flutterwave Webhook sécurisé ----
app.post('/flutterwave', (req, res) => {
  const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
  const signature = req.headers["verif-hash"];

  if (!signature || signature !== secretHash) {
    console.log("Flutterwave signature invalid");
    return res.status(403).send("Webhook verification failed");
  }

  console.log("Flutterwave webhook valid:", req.body);
  res.status(200).send("Webhook received");
});

// ---- Lancement serveur Render (obligatoire PORT env) ----
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Server running on port", port);
});

const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const app = express();

app.use(express.json());

const MERCHANT_ID = "YOUR_MERCHANT_ID";
const SALT_KEY = "YOUR_SALT_KEY";
const SALT_INDEX = 1;



app.post("/create-payment", async (req, res) => {
    const { amount, orderId } = req.body;
  
    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: orderId,
      merchantUserId: "USER001",
      amount: amount * 100,
      redirectUrl: "http://localhost:3000/payment-success",
      redirectMode: "REDIRECT",
      callbackUrl: "http://localhost:5000/payment-callback",
      mobileNumber: "9999999999",
      paymentInstrument: { type: "PAY_PAGE" }
    };
  
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
  
    const checksum =
      crypto
        .createHash("sha256")
        .update(base64Payload + "/pg/v1/pay" + SALT_KEY)
        .digest("hex") +
      "###" +
      SALT_INDEX;
  
    const response = await axios.post(
      "https://api.phonepe.com/apis/hermes/pg/v1/pay",
      { request: base64Payload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum
        }
      }
    );
  
    res.json(response.data);
  });
  
const crypto = require("crypto");

const SECRET = process.env.QR_TOKEN_SECRET;

function b64url(str) {
  return Buffer.from(str, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function b64urlDecode(b64) {
  const pad = 4 - (b64.length % 4 || 4);
  const normalized = b64.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad);
  return Buffer.from(normalized, "base64").toString("utf8");
}

function sign(payloadB64) {
  return crypto
    .createHmac("sha256", SECRET)
    .update(payloadB64)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

// token = payload.signature
function createToken(payloadObj) {
  if (!SECRET) throw new Error("QR_TOKEN_SECRET is missing in .env");
  const payload = b64url(JSON.stringify(payloadObj));
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

function verifyToken(token) {
  if (!SECRET) throw new Error("QR_TOKEN_SECRET is missing in .env");
  if (!token || typeof token !== "string" || !token.includes(".")) {
    throw new Error("Invalid token format");
  }

  const [payload, sig] = token.split(".");
  const expected = sign(payload);
  if (sig !== expected) throw new Error("Invalid token signature");

  const obj = JSON.parse(b64urlDecode(payload));
  if (!obj.exp || Date.now() > obj.exp) throw new Error("Token expired");
  if (!obj.sid || !obj.nonce) throw new Error("Token missing fields");

  return obj; // { sid, nonce, exp }
}

module.exports = { createToken, verifyToken };

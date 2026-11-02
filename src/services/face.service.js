// src/services/face.service.js

const MAX_IMAGE_BYTES = Number(process.env.MAX_FACE_IMAGE_BYTES || 2 * 1024 * 1024); // 2MB default

function isProbablyBase64Image(str) {
  if (typeof str !== "string") return false;

  const trimmed = str.trim();
  const base64Part = trimmed.startsWith("data:image/") ? trimmed.split(",")[1] : trimmed;

  // basic sanity
  if (!base64Part || base64Part.length < 50) return false;

  // allow standard base64 and base64url-ish chars
  return /^[A-Za-z0-9+/=_-]+$/.test(base64Part);
}

function base64ToBuffer(imageBase64) {
  const trimmed = String(imageBase64).trim();
  const base64Part = trimmed.startsWith("data:image/") ? trimmed.split(",")[1] : trimmed;

  const buf = Buffer.from(base64Part, "base64");

  // extra validation
  if (!buf || buf.length === 0) {
    throw new Error("Decoded image is empty");
  }
  if (buf.length > MAX_IMAGE_BYTES) {
    throw new Error(`Image too large (max ${MAX_IMAGE_BYTES} bytes)`);
  }

  return buf;
}

/**
 * DEV STUB:
 * - Validates base64 is decodable to bytes
 * - If FACE_STUB_MODE === "true" (and not production), returns dummy 128 vector
 * - Otherwise returns null (feature not implemented)
 */
async function extractDescriptorFromBase64(imageBase64) {
  if (!imageBase64) throw new Error("imageBase64 required");
  if (!isProbablyBase64Image(imageBase64)) throw new Error("Invalid base64 image format");

  // validate base64 decodes
  base64ToBuffer(imageBase64);

  // DEV ONLY: return dummy vector so controller continues
  // Recommended: don't allow this in production
  const stubOn = process.env.FACE_STUB_MODE === "true";
  const isProd = process.env.NODE_ENV === "production";

  if (stubOn && !isProd) {
    return Array.from({ length: 128 }, () => 0);
  }

  // Not implemented => treat as "no face detected"
  return null;
}

function distance(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) throw new Error("distance expects arrays");
  if (a.length === 0 || b.length === 0) throw new Error("distance arrays cannot be empty");
  if (a.length !== b.length) throw new Error(`length mismatch: ${a.length} vs ${b.length}`);

  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const x = Number(a[i]);
    const y = Number(b[i]);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error(`non-numeric value at index ${i}`);
    }
    const d = x - y;
    sum += d * d;
  }
  return Math.sqrt(sum);
}

module.exports = { extractDescriptorFromBase64, distance };

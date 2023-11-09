import { ENV } from "./constants";
import logger from "./logger";
const ALGORITHM = "AES-GCM";
const SALT_LENGTH = 22;
const IV_LENGTH = 12;
const AUTH_LENGTH = 16;
const ITERATIONS = 2 ** 16;
const HMAC_ALG = "SHA-256";
const KEY_BYTES = 32; // bytes to bit * 8

export async function encrypt(plaintext: string) {
  const textEncode = new TextEncoder().encode(plaintext);
  const salt: Uint8Array = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv: Uint8Array = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const keyAB: ArrayBuffer = base64ToArrayBuffer(ENV.CRYPTO_SECRET_KEY);
  const keyMaterial: CryptoKey = await crypto.subtle.importKey("raw", keyAB, "PBKDF2", false, [
    "deriveBits",
    "deriveKey",
  ]);
  const deriveKey: CryptoKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: ITERATIONS,
      hash: HMAC_ALG,
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_BYTES * 8 },
    true,
    ["encrypt", "decrypt"]
  );
  const encryptTextTagAB: ArrayBuffer = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv: iv,
      tagLength: AUTH_LENGTH * 8,
    },
    deriveKey,
    textEncode
  );
  const encryptTextTagU8A: Uint8Array = new Uint8Array(encryptTextTagAB);
  let result: Uint8Array = new Uint8Array(SALT_LENGTH + IV_LENGTH + encryptTextTagU8A.length);
  result.set(salt);
  result.set(iv, SALT_LENGTH);
  result.set(encryptTextTagU8A, SALT_LENGTH + IV_LENGTH);
  return arrayBufferToBase64(result.buffer);
}

export async function decrypt(text: string) {
  const textAB = new Uint8Array(base64ToArrayBuffer(text));
  const salt: Uint8Array = textAB.slice(0, SALT_LENGTH);
  const iv = textAB.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const encryptText: Uint8Array = textAB.slice(SALT_LENGTH + IV_LENGTH);

  const keyAB: ArrayBuffer = base64ToArrayBuffer(ENV.CRYPTO_SECRET_KEY);
  const keyMaterial: CryptoKey = await crypto.subtle.importKey("raw", keyAB, "PBKDF2", false, [
    "deriveBits",
    "deriveKey",
  ]);

  const deriveKey: CryptoKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: ITERATIONS,
      hash: HMAC_ALG,
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_BYTES * 8 },
    true,
    ["encrypt", "decrypt"]
  );

  try {
    const decryptTextAB: ArrayBuffer = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: iv,
        tagLength: AUTH_LENGTH * 8,
      },
      deriveKey,
      encryptText
    );
    const plaintext = new TextDecoder().decode(decryptTextAB);
    return plaintext;
  } catch (e) {
    logger.error(`[cryptor][decrypt] error: ${e}`);
    return "";
  }
}

export function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function base64ToArrayBuffer(base64) {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

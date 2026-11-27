export function generateToken() {
  const bytes = crypto.getRandomValues(
    new Uint8Array(32)
  );

  return Array.from(bytes)
    .map((byte) =>
      byte.toString(16).padStart(2, "0")
    )
    .join("");
}

export async function sha256(value: string) {
  const encoded = new TextEncoder().encode(value);

  const buffer = await crypto.subtle.digest(
    "SHA-256",
    encoded
  );

  return Array.from(new Uint8Array(buffer))
    .map((byte) =>
      byte.toString(16).padStart(2, "0")
    )
    .join("");
}

export async function verifyAccessKey(
  accessKey: string,
  storedHash: string
) {
  if (!/^[a-f0-9]{64}$/.test(storedHash)) {
    return false;
  }

  const calculatedHash = await sha256(accessKey);

  let difference = 0;

  for (let i = 0; i < 64; i++) {
    difference |=
      calculatedHash.charCodeAt(i) ^
      storedHash.charCodeAt(i);
  }

  return difference === 0;
}
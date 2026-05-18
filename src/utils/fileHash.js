export async function generateFileHash(file) {
  const arrayBuffer = await file.arrayBuffer();

  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);

  const hashArray = Array.from(new Uint8Array(hashBuffer));

  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

export function generateSimulatedFileReference(hash) {
  return `simulated-ipfs://bafy-demo-${hash.slice(0, 24)}`;
}
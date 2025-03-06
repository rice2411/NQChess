import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Đường dẫn đến service-account.json
const serviceAccountPath = path.resolve(
  process.cwd(),
  "src/config/firebase-admin.json"
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"))
    ),
  });
}

export default admin;

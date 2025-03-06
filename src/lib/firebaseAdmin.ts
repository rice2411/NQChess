import admin from "firebase-admin";

// Đường dẫn đến service-account.json
const serviceAccountPath = {
  type: "service_account",
  project_id: "nqchess-39213",
  private_key_id: "546d46aa8d68563977858fa080fee6a783030074",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDp7t8YgBfjyjyL\nzkBpgzHP4sVHeEgWjKxX2c33SJkB08XKpwSrXWo7/uldtfrHgUzytqDTSwW0z6Mh\nO8paULqJdZq5aunoiJwfKT8b0KclkRzi2t7Cwww8fV0ongdTy3IczTY1zOW/AscL\nxZ6nLzsdZwGR5+xgTrnFSIArtZb8jTZuHu7+d02FD2JmTgsGGgMXPZHULDJLp779\n/G3wBL+hWmrZQykzwE4+6G36sBv/QgA8AUfLVtfgUezcoJ9HH3Ij5SJfeF3+Ft7S\nJ0kqZMsxpVu1q7V9brtKHyqC6WnQywNpPbygVYvih5QgykBs6y0BLAhnBtyYyMGu\nt37HMt+zAgMBAAECggEACDBhT+lqrKyE2mdccDUfARt7nh5doP3IqgSeW1SHwqgd\nVD7s1hYy5KnDlTu3F9UfZ/RbrznWQneYSs6zLTPb687u8nmweYA6vYkt7oqAfLtW\niwcautpQFdf/na82gMjuPt2HfcelQpQAJW8uuBnaVGj+2ugxqUdoOmSTfrQ1y7O7\n/LznQuYKSlvoYTO5ye+9clFPnuDnEJ4M7fbmz8acsnpjx1b5ZNLnwBKAS2JiHyFZ\ndQR5xRDRyGa7m3uaF2HObPdl/VsDjQHtvReTAi5r8AnuqSj1o0MqV808OQw3AtEB\nS26Ixsd+kGFfgsMEFPOF4HdatBYogOenYlUiZ9wkFQKBgQD1b17HMat0jhhAONZX\n/PKlgg8bgqRkaEBfmGk/1sO4HuX2ppQXrW7ur/MI3/A6HCf9thgV/EiDNIhvbiVv\nlj9FqLbGtNTh/bzgwV5836FN9foD2voehEntzW0InPzxkzpUsYHw+y38a0Ebcrl4\nxIu9srMtbm3HLAcizIRFDi0K5QKBgQD0AMC2p2ZDaWUJ/PPXYGStYT7755Ng4kGm\noAJ+rp9JVgiOtilOEJQTXYjV1s9pNDEPvhDB5pKF2z9E+0Myx6tlUraOKy/VpA1v\nRMSL5W53Bpr98Rc7L7tgyTxscbGekTd5f2HoQDsRiPNGzc8llKp6VhcMd3g60XJE\ntDSX/wBetwKBgQC0ryuwK2HU6bLyvKUXm5EqxUfH8fKCNLmHZtW8+KeXia+0WEfX\n8ocjUwbxdqMMtKPAROkQbm0Xonn6xrTqpEqqRp1gRcofIUSGlfSwq5W9piNL6U6P\nXsZqOfxWBfS1B7U+mntV5CSjmnYQ9fGS9ecGXWNJQ+2vXjtWpAeQKvJ//QKBgQCb\nOY9fo4bvA7F/dSg6r9vcYK0M2/lp/QX+1nQ/2x8CLHUtNL16KBnLaAmQ4CL6rnU3\nqpZGhERaW2wYmi/ZsiRbRQ9VyiuYIdFaI8lVphNsLQuU2TcKNAdkPyDtbDauxXsh\nE+RZN+Nb+F+rf2p0YetCAFqRV79oy62B/5Ilz9eQaQKBgQC/+rznTAcf3sKJBzJX\nEtIfzU1ffCpHCD35h7NwIBcmcrIjKU2yjql/BFcXFScBVBd61C/sBUTRn5IhGc6x\nIRsKk4ikCHd/TM+ZWxeeinfMejsM3Fr/IuXoj03sesLHipsPLTrtus3xWpxYWbKI\nXTSa3MIFHziR1X0ewZ99/6Wlpw==\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@nqchess-39213.iam.gserviceaccount.com",
  client_id: "100497248622224482727",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40nqchess-39213.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(JSON.stringify(serviceAccountPath))
    ),
  });
}

export default admin;

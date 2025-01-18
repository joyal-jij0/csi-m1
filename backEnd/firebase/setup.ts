import admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

const serviceAccount = require('./csi-m1-firebase-adminsdk.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount)
});

export default admin;
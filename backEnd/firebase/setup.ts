import admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

const {firebasedata} = require('./data');

admin.initializeApp({
    credential: admin.credential.cert(firebasedata as ServiceAccount)
});

export default admin;
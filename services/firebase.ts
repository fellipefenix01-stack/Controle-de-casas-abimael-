import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// CONFIGURAÇÃO DO FIREBASE
// Substitua os valores abaixo pelos dados do seu projeto no console do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "controle-imoveis-abimael",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
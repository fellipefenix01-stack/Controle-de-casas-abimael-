import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { House, HouseStatus } from '../types';

const COLLECTION_NAME = 'imoveis';

export const houseService = {
  // Ler todos os imóveis
  getAll: async (): Promise<House[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as House));
    } catch (error) {
      console.error("Erro ao buscar imóveis:", error);
      throw error;
    }
  },

  // Adicionar novo imóvel
  add: async (house: Omit<House, 'id'>): Promise<House> => {
    try {
      // Cria uma referência de documento para gerar o ID automaticamente
      const docRef = await addDoc(collection(db, COLLECTION_NAME), house);
      return { id: docRef.id, ...house };
    } catch (error) {
      console.error("Erro ao adicionar imóvel:", error);
      throw error;
    }
  },

  // Atualizar imóvel existente (status, preço, nome, descrição, etc)
  update: async (house: House): Promise<void> => {
    try {
      const { id, ...data } = house;
      const houseRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(houseRef, data);
    } catch (error) {
      console.error("Erro ao atualizar imóvel:", error);
      throw error;
    }
  },

  // Deletar imóvel
  delete: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Erro ao deletar imóvel:", error);
      throw error;
    }
  }
};
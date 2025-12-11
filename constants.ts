import { House } from './types';

export const INITIAL_HOUSES: House[] = [
  {
    id: '1',
    name: 'Mansão Alphaville',
    price: 'R$ 3.500.000',
    description: 'Casa de alto padrão com 5 suítes, área gourmet completa e piscina aquecida.',
    address: 'Alphaville, Barueri - SP',
    coverImage: 'https://picsum.photos/800/600?random=1',
    status: 'traffic',
    gallery: [
      { id: 'g1', type: 'image', url: 'https://picsum.photos/800/600?random=11' },
      { id: 'g2', type: 'image', url: 'https://picsum.photos/800/600?random=12' }
    ],
    features: ['Piscina', '5 Suítes', 'Automação']
  },
  {
    id: '2',
    name: 'Cobertura Jardins',
    price: 'R$ 2.200.000',
    description: 'Cobertura duplex com vista panorâmica da cidade e acabamento em mármore.',
    address: 'Jardins, São Paulo - SP',
    coverImage: 'https://picsum.photos/800/600?random=2',
    status: 'highlight',
    gallery: [],
    features: ['Vista Panorâmica', 'Duplex', 'Jacuzzi']
  },
  {
    id: '3',
    name: 'Sobrado Moderno',
    price: 'R$ 950.000',
    description: 'Sobrado recém construído em condomínio fechado, ideal para famílias.',
    address: 'Granja Viana, Cotia - SP',
    coverImage: 'https://picsum.photos/800/600?random=3',
    status: 'catalog',
    gallery: [],
    features: ['Condomínio Fechado', '3 Quartos', 'Quintal']
  },
  {
    id: '4',
    name: 'Loft Industrial',
    price: 'R$ 680.000',
    description: 'Loft estilo industrial no centro, pé direito duplo.',
    address: 'Centro, Curitiba - PR',
    coverImage: 'https://picsum.photos/800/600?random=4',
    status: 'catalog',
    gallery: [],
    features: ['Pé direito duplo', 'Conceito Aberto']
  }
];
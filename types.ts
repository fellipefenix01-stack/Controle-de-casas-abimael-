export type HouseStatus = 'traffic' | 'highlight' | 'catalog' | 'sold';

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
}

export interface House {
  id: string;
  name: string;
  price: string;
  description: string;
  address: string;
  coverImage: string;
  status: HouseStatus;
  gallery: MediaItem[];
  features: string[];
}

export interface ColumnType {
  id: HouseStatus;
  title: string;
  description: string;
  color: string;
  iconColor: string;
}

export const COLUMNS: ColumnType[] = [
  {
    id: 'traffic',
    title: 'Tráfego Pago',
    description: 'Imóveis prioritários para campanhas.',
    color: 'bg-gold-400/10 border-gold-400/40 text-gold-400',
    iconColor: 'text-gold-400'
  },
  {
    id: 'highlight',
    title: 'Destaque Premium',
    description: 'Produção visual para reels e stories.',
    color: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
    iconColor: 'text-purple-400'
  },
  {
    id: 'catalog',
    title: 'Catálogo Geral',
    description: 'Disponíveis na carteira.',
    color: 'bg-blue-500/5 border-blue-500/20 text-blue-300',
    iconColor: 'text-blue-400'
  },
  {
    id: 'sold',
    title: 'Vendidos',
    description: 'Negociados ou arquivados.',
    color: 'bg-white/5 border-white/10 text-zinc-500',
    iconColor: 'text-zinc-600'
  }
];
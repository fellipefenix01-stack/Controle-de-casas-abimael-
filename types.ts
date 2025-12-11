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
}

export const COLUMNS: ColumnType[] = [
  {
    id: 'traffic',
    title: 'Tráfego Pago',
    description: 'Imóveis prioritários para campanhas de anúncios.',
    color: 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
  },
  {
    id: 'highlight',
    title: 'Destaque de Conteúdo',
    description: 'Imóveis para reels, stories e produção visual.',
    color: 'bg-purple-500/10 border-purple-500/50 text-purple-400'
  },
  {
    id: 'catalog',
    title: 'Catálogo Geral',
    description: 'Demais imóveis disponíveis na carteira.',
    color: 'bg-blue-500/10 border-blue-500/50 text-blue-400'
  },
  {
    id: 'sold',
    title: 'Vendidos / Retirados',
    description: 'Imóveis negociados ou removidos.',
    color: 'bg-slate-500/10 border-slate-500/50 text-slate-400'
  }
];
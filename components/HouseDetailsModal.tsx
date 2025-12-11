import React, { useRef } from 'react';
import { House, MediaItem, COLUMNS, HouseStatus } from '../types';
import { Button } from './Button';
import { Trash2, Plus, Image as ImageIcon, Video, ChevronDown, Check, Pencil } from 'lucide-react';

interface HouseDetailsModalProps {
  house: House;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedHouse: House) => void;
  onDelete: (houseId: string) => void;
}

export const HouseDetailsModal: React.FC<HouseDetailsModalProps> = ({ house, isOpen, onClose, onUpdate, onDelete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir este imóvel?")) {
      onDelete(house.id);
      onClose();
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ ...house, status: e.target.value as HouseStatus });
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...house, name: e.target.value });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...house, price: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...house, description: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newMediaItems: MediaItem[] = (Array.from(e.target.files) as File[]).map(file => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video') ? 'video' : 'image'
      }));

      const updatedHouse = {
        ...house,
        gallery: [...house.gallery, ...newMediaItems]
      };
      onUpdate(updatedHouse);
    }
  };

  const removeMedia = (mediaId: string) => {
    const updatedHouse = {
      ...house,
      gallery: house.gallery.filter(m => m.id !== mediaId)
    };
    onUpdate(updatedHouse);
  };

  return (
    <div className="space-y-8 pb-4">
      {/* Header Info */}
      <div className="relative h-56 md:h-72 rounded-lg overflow-hidden group shadow-lg shadow-black/50 border border-luxury-border">
        <img src={house.coverImage} alt={house.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
        
        <div className="absolute bottom-6 left-6 right-6">
            <div className="relative group/name mb-2">
                <input 
                    value={house.name}
                    onChange={handleNameChange}
                    className="w-full bg-transparent text-2xl md:text-3xl font-serif font-bold text-white leading-tight tracking-wide focus:outline-none focus:bg-black/40 rounded px-2 -ml-2 border border-transparent focus:border-white/10 transition-all placeholder-white/50"
                    placeholder="Nome do Imóvel"
                />
                <Pencil size={14} className="absolute right-full top-1/2 -translate-y-1/2 mr-2 text-white/30 opacity-0 group-hover/name:opacity-100 transition-opacity hidden md:block" />
            </div>

            <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/30 px-3 py-1 rounded backdrop-blur-md group/price hover:bg-black/40 transition-colors cursor-text">
                <input
                    value={house.price}
                    onChange={handlePriceChange}
                    className="bg-transparent text-gold-400 font-semibold focus:outline-none min-w-[100px] w-auto"
                    placeholder="Valor (R$)"
                />
                <Pencil size={12} className="text-gold-500/50 group-hover/price:text-gold-400 transition-colors" />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
            <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-gold-600 font-bold mb-3 flex items-center gap-2">
                    Sobre o Imóvel
                    <div className="h-px bg-luxury-border flex-1"></div>
                </h4>
                <div className="relative group/desc">
                    <textarea 
                        value={house.description || ""}
                        onChange={handleDescriptionChange}
                        rows={6}
                        className="w-full text-gray-300 leading-relaxed bg-luxury-800/30 p-5 rounded-lg border border-luxury-border text-sm md:text-base font-light focus:outline-none focus:ring-1 focus:ring-gold-500/50 focus:bg-luxury-800/50 transition-all resize-none"
                        placeholder="Adicione uma descrição detalhada..."
                    />
                     <div className="absolute top-3 right-3 opacity-0 group-hover/desc:opacity-100 transition-opacity pointer-events-none">
                        <Pencil size={14} className="text-gray-500" />
                     </div>
                </div>
            </div>
            
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs uppercase tracking-[0.2em] text-gold-600 font-bold">Galeria de Mídia</h4>
                    <span className="text-xs text-gray-500 font-mono">{house.gallery.length} ITENS</span>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {/* Add Button */}
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square bg-luxury-800/50 border border-dashed border-luxury-border rounded-lg flex flex-col items-center justify-center text-gray-500 hover:text-gold-400 hover:border-gold-500/50 hover:bg-luxury-800 transition-all group"
                    >
                        <Plus size={24} className="group-hover:scale-110 transition-transform"/>
                        <span className="text-[10px] mt-2 uppercase tracking-wider font-medium">Adicionar</span>
                    </button>
                    <input 
                        type="file" 
                        multiple 
                        accept="image/*,video/*" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileUpload}
                    />

                    {/* Gallery Items */}
                    {house.gallery.map(media => (
                        <div key={media.id} className="relative aspect-square group rounded-lg overflow-hidden bg-black ring-1 ring-white/10">
                            {media.type === 'video' ? (
                                <video src={media.url} className="w-full h-full object-cover opacity-80" />
                            ) : (
                                <img src={media.url} alt="Gallery" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                            )}
                            
                            <div className="absolute top-1 right-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button 
                                    onClick={() => removeMedia(media.id)}
                                    className="bg-black/80 p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-black backdrop-blur-md border border-red-900/30"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                            <div className="absolute bottom-1 left-1 pointer-events-none">
                                {media.type === 'video' ? <Video size={12} className="text-white drop-shadow-md"/> : <ImageIcon size={12} className="text-white drop-shadow-md"/>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-luxury-800/30 p-5 rounded-lg border border-luxury-border space-y-4">
                <h4 className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold mb-2">Ficha Técnica</h4>
                
                <div className="space-y-4">
                    <div className="space-y-1">
                        <span className="text-xs text-gold-600 font-medium">LOCALIZAÇÃO</span>
                        <div className="text-sm text-gray-200">{house.address}</div>
                    </div>

                    <div className="space-y-1">
                        <span className="text-xs text-gold-600 font-medium">STATUS ATUAL</span>
                        <div className="relative group">
                           <select 
                             value={house.status} 
                             onChange={handleStatusChange}
                             className="w-full bg-luxury-950 text-gray-200 pl-3 pr-8 py-2.5 rounded border border-luxury-border appearance-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 focus:outline-none transition-all cursor-pointer hover:border-gray-600 text-sm"
                           >
                             {COLUMNS.map(col => (
                               <option key={col.id} value={col.id}>{col.title}</option>
                             ))}
                           </select>
                           <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-gold-400 transition-colors" size={14} />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold mb-3">Destaques</h4>
                <div className="flex flex-wrap gap-2">
                    {house.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs bg-luxury-800/50 text-gray-300 px-3 py-1.5 rounded-full border border-luxury-border">
                            <Check size={10} className="text-gold-500" />
                            {f}
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-6 border-t border-luxury-border/50">
                <Button variant="danger" className="w-full" onClick={handleDelete} icon={<Trash2 size={16}/>}>
                    Remover Imóvel
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};
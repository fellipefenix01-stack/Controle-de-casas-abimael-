import React, { useRef } from 'react';
import { House, MediaItem, COLUMNS, HouseStatus } from '../types';
import { Button } from './Button';
import { Trash2, Plus, Image as ImageIcon, Video, ChevronDown } from 'lucide-react';

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
    <div className="space-y-6 pb-6">
      {/* Header Info */}
      <div className="relative h-48 md:h-64 rounded-xl overflow-hidden group">
        <img src={house.coverImage} alt={house.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl md:text-2xl font-bold text-white leading-tight mb-1">{house.name}</h3>
            <p className="text-blue-400 font-semibold">{house.price}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
            <div>
                <h4 className="text-sm uppercase tracking-wider text-slate-500 font-bold mb-2">Sobre o Imóvel</h4>
                <p className="text-slate-300 leading-relaxed bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 text-sm md:text-base">
                    {house.description || "Sem descrição disponível."}
                </p>
            </div>
            
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm uppercase tracking-wider text-slate-500 font-bold">Galeria de Mídia</h4>
                    <span className="text-xs text-slate-500">{house.gallery.length} itens</span>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {/* Add Button */}
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square bg-slate-800 border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 hover:bg-slate-700 transition-all"
                    >
                        <Plus size={24} />
                        <span className="text-xs mt-1">Add</span>
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
                        <div key={media.id} className="relative aspect-square group rounded-lg overflow-hidden bg-black">
                            {media.type === 'video' ? (
                                <video src={media.url} className="w-full h-full object-cover opacity-80" />
                            ) : (
                                <img src={media.url} alt="Gallery" className="w-full h-full object-cover" />
                            )}
                            
                            <div className="absolute top-1 right-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => removeMedia(media.id)}
                                    className="bg-red-500/80 p-1.5 rounded-full text-white hover:bg-red-600 backdrop-blur-sm"
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
            <div>
                <h4 className="text-sm uppercase tracking-wider text-slate-500 font-bold mb-2">Detalhes</h4>
                <ul className="space-y-3">
                    <li className="flex flex-col gap-1 text-sm py-2 border-b border-slate-700">
                        <span className="text-slate-400 text-xs">Localização</span>
                        <span className="text-white">{house.address}</span>
                    </li>
                    <li className="flex flex-col gap-1 text-sm py-2 border-b border-slate-700">
                        <span className="text-slate-400 text-xs">Status (Coluna)</span>
                        <div className="relative">
                           <select 
                             value={house.status} 
                             onChange={handleStatusChange}
                             className="w-full bg-slate-800 text-white p-2 rounded border border-slate-600 appearance-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                           >
                             {COLUMNS.map(col => (
                               <option key={col.id} value={col.id}>{col.title}</option>
                             ))}
                           </select>
                           <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>
                    </li>
                </ul>
            </div>

            <div>
                <h4 className="text-sm uppercase tracking-wider text-slate-500 font-bold mb-2">Comodidades</h4>
                <div className="flex flex-wrap gap-2">
                    {house.features.map((f, i) => (
                        <span key={i} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-md border border-slate-600">
                            {f}
                        </span>
                    ))}
                </div>
            </div>

            <div className="pt-4">
                <Button variant="danger" className="w-full" onClick={handleDelete} icon={<Trash2 size={16}/>}>
                    Remover Imóvel
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};
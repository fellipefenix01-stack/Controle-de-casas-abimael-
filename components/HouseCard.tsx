import React from 'react';
import { House, HouseStatus, COLUMNS } from '../types';
import { GripVertical, MapPin, Image as ImageIcon, ArrowRightLeft, Star } from 'lucide-react';

interface HouseCardProps {
  house: House;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, houseId: string) => void;
  onClick: (house: House) => void;
  onMove: (status: HouseStatus) => void;
}

export const HouseCard: React.FC<HouseCardProps> = ({ house, onDragStart, onClick, onMove }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, house.id)}
      className="group bg-luxury-800/80 border border-luxury-border hover:border-gold-500/50 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing shadow-lg hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 relative flex flex-col backdrop-blur-sm"
    >
      <div 
        onClick={() => onClick(house)} 
        className="cursor-pointer"
      >
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
          <div className="bg-black/70 backdrop-blur-md p-1.5 rounded text-gold-400 border border-gold-500/20">
            <GripVertical size={14} />
          </div>
        </div>

        {/* Image Container */}
        <div className="relative h-44 w-full overflow-hidden">
          <img 
            src={house.coverImage} 
            alt={house.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 saturate-[0.9] group-hover:saturate-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
             <div className="flex items-center justify-between mb-1">
                <span className="text-gold-400 font-serif font-semibold text-lg drop-shadow-md tracking-wide">{house.price}</span>
             </div>
            <h3 className="text-white font-medium text-base leading-tight truncate drop-shadow-sm group-hover:text-gold-200 transition-colors">{house.name}</h3>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 pt-3 pb-2 space-y-3">
          <div className="flex items-start text-gray-400 text-xs">
            <MapPin size={12} className="mr-1.5 mt-0.5 shrink-0 text-gold-600" />
            <span className="truncate opacity-80">{house.address}</span>
          </div>

          {/* Features Tags */}
          <div className="flex flex-wrap gap-1.5">
            {house.features.slice(0, 2).map((feature, idx) => (
              <span key={idx} className="bg-luxury-900 border border-luxury-border px-2 py-1 rounded text-[10px] uppercase tracking-wider text-gray-300 font-medium">
                {feature}
              </span>
            ))}
            {house.features.length > 2 && (
              <span className="bg-luxury-900 border border-luxury-border px-2 py-1 rounded text-[10px] text-gray-400">
                +{house.features.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile/Quick Action Move Buttons */}
      <div className="p-2 border-t border-luxury-border bg-luxury-900/50 grid grid-cols-3 gap-1 mt-auto">
         {COLUMNS.filter(col => col.id !== house.status).slice(0, 3).map(col => (
           <button
             key={col.id}
             onClick={(e) => { e.stopPropagation(); onMove(col.id); }}
             className="flex items-center justify-center py-1.5 rounded hover:bg-white/5 transition-colors text-[10px] text-gray-500 hover:text-gold-400 group/btn"
             title={`Mover para ${col.title}`}
           >
             <ArrowRightLeft size={10} className="mr-1 group-hover/btn:text-gold-500" />
             <span className="truncate">{col.title.split(' ')[0]}</span>
           </button>
         ))}
      </div>
    </div>
  );
};
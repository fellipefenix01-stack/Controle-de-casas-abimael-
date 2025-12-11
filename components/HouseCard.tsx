import React from 'react';
import { House, HouseStatus, COLUMNS } from '../types';
import { GripVertical, MapPin, Image as ImageIcon, ArrowRightLeft } from 'lucide-react';

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
      className="group bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing shadow-lg hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300 relative flex flex-col"
    >
      <div 
        onClick={() => onClick(house)} 
        className="cursor-pointer"
      >
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
          <div className="bg-black/50 backdrop-blur-sm p-1 rounded-md text-white">
            <GripVertical size={16} />
          </div>
        </div>

        <div className="relative h-40 w-full overflow-hidden">
          <img 
            src={house.coverImage} 
            alt={house.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-4 pt-12">
            <h3 className="text-white font-bold text-lg leading-tight truncate">{house.name}</h3>
          </div>
        </div>
        
        <div className="p-4 pb-2 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-blue-400 font-bold">{house.price}</span>
            <div className="flex items-center text-slate-400 text-xs">
              <ImageIcon size={12} className="mr-1" />
              {house.gallery.length}
            </div>
          </div>
          
          <div className="flex items-start text-slate-400 text-xs">
            <MapPin size={12} className="mr-1 mt-0.5 shrink-0" />
            <span className="truncate">{house.address}</span>
          </div>

          <div className="pt-2 flex flex-wrap gap-1">
            {house.features.slice(0, 2).map((feature, idx) => (
              <span key={idx} className="bg-slate-700/50 px-2 py-0.5 rounded text-[10px] text-slate-300">
                {feature}
              </span>
            ))}
            {house.features.length > 2 && (
              <span className="bg-slate-700/50 px-2 py-0.5 rounded text-[10px] text-slate-300">
                +{house.features.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile/Quick Action Move Buttons */}
      <div className="p-2 border-t border-slate-700/50 bg-slate-800/50 grid grid-cols-2 gap-2 mt-auto">
         {COLUMNS.filter(col => col.id !== house.status).map(col => (
           <button
             key={col.id}
             onClick={(e) => { e.stopPropagation(); onMove(col.id); }}
             className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded hover:bg-slate-700 transition-colors text-[10px] font-medium text-slate-400 hover:text-white border border-transparent hover:border-slate-600"
           >
             <ArrowRightLeft size={10} />
             {col.title.split(' ')[0]}
           </button>
         ))}
      </div>
    </div>
  );
};
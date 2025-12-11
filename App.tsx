import React, { useState, useEffect } from 'react';
import { COLUMNS, House, HouseStatus } from './types';
import { INITIAL_HOUSES } from './constants';
import { HouseCard } from './components/HouseCard';
import { AddHouseModal } from './components/AddHouseModal';
import { HouseDetailsModal } from './components/HouseDetailsModal';
import { Modal } from './components/Modal';
import { Button } from './components/Button';
import { Plus, LayoutDashboard, Search, Diamond } from 'lucide-react';

export default function App() {
  // Initialize from LocalStorage or fallback to INITIAL_HOUSES
  const [houses, setHouses] = useState<House[]>(() => {
    try {
      const savedData = localStorage.getItem('abimael-houses-data');
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (e) {
      console.error("Failed to load local data", e);
    }
    return INITIAL_HOUSES;
  });

  // Persistence Effect
  useEffect(() => {
    localStorage.setItem('abimael-houses-data', JSON.stringify(houses));
  }, [houses]);

  const [draggedHouseId, setDraggedHouseId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<HouseStatus | null>(null);
  
  // Mobile Tab State
  const [activeTab, setActiveTab] = useState<HouseStatus>('traffic');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, houseId: string) => {
    setDraggedHouseId(houseId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: HouseStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    // Optional: logic for leaving drop zone
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: HouseStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedHouseId) {
      handleMoveHouse(draggedHouseId, status);
      setDraggedHouseId(null);
    }
  };

  // --- Actions ---
  const handleMoveHouse = (houseId: string, newStatus: HouseStatus) => {
    setHouses(prev => prev.map(h => 
      h.id === houseId ? { ...h, status: newStatus } : h
    ));
  };

  const handleAddHouse = (newHouse: House) => {
    setHouses(prev => [newHouse, ...prev]);
  };

  const handleUpdateHouse = (updatedHouse: House) => {
    setHouses(prev => prev.map(h => h.id === updatedHouse.id ? updatedHouse : h));
    setSelectedHouse(updatedHouse);
  };

  const handleDeleteHouse = (houseId: string) => {
    setHouses(prev => prev.filter(h => h.id !== houseId));
    setSelectedHouse(null);
  };

  // --- Filtering ---
  const filteredHouses = houses.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[100dvh] flex flex-col bg-luxury-950 text-slate-200 font-sans selection:bg-gold-500/30 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-luxury-800 to-luxury-950">
      {/* Header */}
      <header className="shrink-0 bg-luxury-900/90 backdrop-blur-md border-b border-gold-500/10 z-40 relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
        <div className="max-w-[1900px] mx-auto px-4 lg:px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(212,175,55,0.2)] shrink-0 border border-gold-300">
              <Diamond size={22} className="fill-black/10 stroke-[1.5]" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-white text-xl md:text-2xl leading-none tracking-tight">Abimael Sales</h1>
              <span className="text-[10px] md:text-xs text-gold-500 font-semibold tracking-[0.2em] uppercase block mt-1">Gestor de Imóveis de Luxo</span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 justify-end">
             <div className="relative hidden sm:block group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gold-500 transition-colors w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Buscar no catálogo..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-luxury-800 border border-luxury-border rounded-full pl-9 pr-4 py-2 text-sm w-48 lg:w-72 focus:ring-1 focus:ring-gold-500 focus:border-gold-500 focus:outline-none transition-all placeholder:text-gray-600"
                />
             </div>
             
             <Button onClick={() => setIsAddModalOpen(true)} className="md:px-5 px-3 py-2 h-10 md:h-11 shadow-lg shadow-black/40">
               <span className="hidden md:inline font-semibold">Novo Imóvel</span>
               <Plus size={20} className="md:hidden"/>
             </Button>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 py-3 bg-luxury-900 border-b border-luxury-border flex justify-between items-center gap-2">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3 h-3" />
            <input 
              type="text" 
              placeholder="Buscar imóvel..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-luxury-800 border border-luxury-border rounded-full pl-8 pr-3 py-2 text-xs w-full focus:ring-1 focus:ring-gold-500 outline-none text-white"
            />
         </div>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden shrink-0 bg-luxury-900 border-b border-luxury-border overflow-x-auto scrollbar-hide">
        <div className="flex p-2 gap-2 min-w-full">
          {COLUMNS.map(col => {
            const isActive = activeTab === col.id;
            const count = filteredHouses.filter(h => h.status === col.id).length;
            return (
              <button
                key={col.id}
                onClick={() => setActiveTab(col.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-medium transition-all whitespace-nowrap border ${
                  isActive 
                    ? 'bg-luxury-800 text-gold-400 border-gold-500/30 shadow-md' 
                    : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                {col.title.split(' ')[0]}
                <span className={`px-1.5 py-0.5 rounded text-[9px] ${isActive ? 'bg-gold-500 text-black font-bold' : 'bg-luxury-950 text-gray-500'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Board */}
      <main className="flex-1 overflow-hidden p-4 md:p-8 max-w-[1900px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-full">
          {COLUMNS.map(column => {
            const columnHouses = filteredHouses.filter(h => h.status === column.id);
            const isOver = dragOverColumn === column.id;
            
            // Logic to toggle visibility on mobile
            const isVisibleOnMobile = activeTab === column.id;
            const displayClass = isVisibleOnMobile ? 'flex' : 'hidden md:flex';

            return (
              <div 
                key={column.id}
                className={`${displayClass} flex-col rounded-2xl transition-all duration-300 h-full max-h-full ${
                  isOver ? 'bg-luxury-800/40 ring-1 ring-gold-500/30' : 'bg-luxury-900/20'
                } border border-white/5 backdrop-blur-sm`}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div className={`p-4 md:p-5 border-b border-white/5 rounded-t-2xl bg-gradient-to-b from-white/5 to-transparent`}>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className={`font-serif font-bold text-lg tracking-wide flex items-center gap-2 ${column.iconColor}`}>
                      {column.title}
                    </h2>
                    <span className="bg-luxury-950/80 border border-white/10 text-gray-300 text-xs font-bold px-2.5 py-1 rounded-full shadow-inner">
                      {columnHouses.length}
                    </span>
                  </div>
                  <div className={`h-0.5 w-8 rounded-full bg-gradient-to-r from-current to-transparent opacity-50 ${column.iconColor} mb-2`}></div>
                  <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">{column.description}</p>
                </div>

                {/* Drop Zone / List */}
                <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 custom-scrollbar">
                  {columnHouses.length === 0 ? (
                    <div className="h-40 border border-dashed border-luxury-border rounded-xl flex flex-col items-center justify-center text-gray-600 p-6 text-center bg-luxury-900/20">
                      <p className="text-sm font-medium">Lista Vazia</p>
                      <p className="text-xs opacity-60 mt-1">Arraste um imóvel para cá</p>
                    </div>
                  ) : (
                    columnHouses.map(house => (
                      <HouseCard 
                        key={house.id} 
                        house={house} 
                        onDragStart={handleDragStart}
                        onClick={setSelectedHouse}
                        onMove={(status) => handleMoveHouse(house.id, status)}
                      />
                    ))
                  )}
                  <div className="h-12 md:h-2"></div> {/* Spacer for mobile bottom area */}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Modals */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Adicionar Novo Imóvel"
      >
        <AddHouseModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={handleAddHouse} 
        />
      </Modal>

      {selectedHouse && (
        <Modal
          isOpen={!!selectedHouse}
          onClose={() => setSelectedHouse(null)}
          title="Detalhes do Imóvel"
        >
          <HouseDetailsModal 
            house={selectedHouse}
            isOpen={!!selectedHouse}
            onClose={() => setSelectedHouse(null)}
            onUpdate={handleUpdateHouse}
            onDelete={handleDeleteHouse}
          />
        </Modal>
      )}
    </div>
  );
}
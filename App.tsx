import React, { useState, useEffect } from 'react';
import { COLUMNS, House, HouseStatus } from './types';
import { INITIAL_HOUSES } from './constants';
import { HouseCard } from './components/HouseCard';
import { AddHouseModal } from './components/AddHouseModal';
import { HouseDetailsModal } from './components/HouseDetailsModal';
import { Modal } from './components/Modal';
import { Button } from './components/Button';
import { Plus, LayoutDashboard, Search } from 'lucide-react';

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
    <div className="h-[100dvh] flex flex-col bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* Header */}
      <header className="shrink-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-40">
        <div className="max-w-[1800px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
              <LayoutDashboard size={20} />
            </div>
            <div className="hidden md:block">
              <h1 className="font-bold text-white text-lg leading-none">Abimael Sales</h1>
              <span className="text-xs text-slate-400 font-medium tracking-wide">GESTOR DE IMÓVEIS</span>
            </div>
            <div className="md:hidden">
              <h1 className="font-bold text-white text-base leading-none">Abimael Sales</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end">
             <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-full pl-9 pr-4 py-1.5 text-sm w-32 md:w-48 lg:w-64 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
             </div>
             
             <Button onClick={() => setIsAddModalOpen(true)} className="md:px-4 px-3 py-1.5 h-9 md:h-10 text-xs md:text-sm whitespace-nowrap">
               <span className="hidden md:inline">Novo Imóvel</span>
               <Plus size={18} className="md:hidden"/>
             </Button>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 py-2 bg-slate-900 border-b border-slate-800 flex justify-between items-center gap-2">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-3 h-3" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-full pl-8 pr-3 py-1 text-xs w-full focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
         </div>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden shrink-0 bg-slate-900/50 border-b border-slate-800 overflow-x-auto scrollbar-hide">
        <div className="flex p-1 gap-1 min-w-full">
          {COLUMNS.map(col => {
            const isActive = activeTab === col.id;
            const count = filteredHouses.filter(h => h.status === col.id).length;
            return (
              <button
                key={col.id}
                onClick={() => setActiveTab(col.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${col.color.split(' ')[2].replace('text-', 'bg-')}`} />
                {col.title.split(' ')[0]}
                <span className="bg-slate-950/50 px-1.5 py-0.5 rounded text-[10px] opacity-60">
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Board */}
      <main className="flex-1 overflow-hidden p-4 md:p-6 max-w-[1800px] mx-auto w-full">
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
                className={`${displayClass} flex-col rounded-2xl transition-colors duration-300 h-full max-h-full ${
                  isOver ? 'bg-slate-800/80 ring-2 ring-blue-500/50' : 'bg-slate-900/40'
                }`}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div className={`p-4 border-b border-slate-800/50 rounded-t-2xl ${column.color.split(' ')[0]}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h2 className={`font-bold text-lg ${column.color.split(' ')[2]}`}>
                      {column.title}
                    </h2>
                    <span className="bg-slate-900/50 text-slate-300 text-xs font-bold px-2 py-1 rounded-md">
                      {columnHouses.length}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 opacity-80 line-clamp-1">{column.description}</p>
                </div>

                {/* Drop Zone / List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                  {columnHouses.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-600 text-sm italic p-4 text-center">
                      Arraste ou mova um imóvel para cá
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
                  <div className="h-12 md:h-4"></div> {/* Spacer for mobile bottom area */}
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
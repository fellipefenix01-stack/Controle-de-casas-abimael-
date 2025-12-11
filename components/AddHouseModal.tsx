import React, { useState } from 'react';
import { House, HouseStatus } from '../types';
import { Button } from './Button';
import { Wand2, Loader2, Upload, DollarSign, MapPin, Tag } from 'lucide-react';
import { generateHouseDescription } from '../services/geminiService';

interface AddHouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (house: House) => void;
}

export const AddHouseModal: React.FC<AddHouseModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    address: '',
    description: '',
    features: '',
    coverImage: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPreviewImage(url);
      setFormData(prev => ({ ...prev, coverImage: url }));
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.name || !formData.price) {
      alert("Preencha Nome e Preço para gerar a descrição.");
      return;
    }
    
    setIsGenerating(true);
    const desc = await generateHouseDescription(formData.name, formData.features, formData.price);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Default image if none selected
    const finalImage = formData.coverImage || `https://picsum.photos/800/600?random=${Math.random()}`;

    const newHouse: House = {
      id: crypto.randomUUID(),
      name: formData.name,
      price: formData.price,
      address: formData.address,
      description: formData.description,
      features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
      coverImage: finalImage,
      status: 'catalog', // Default to catalog
      gallery: []
    };

    onAdd(newHouse);
    onClose();
    // Reset form
    setFormData({ name: '', price: '', address: '', description: '', features: '', coverImage: '' });
    setPreviewImage(null);
  };

  if (!isOpen) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider font-bold text-gold-600">Nome do Imóvel</label>
          <input
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Mansão Vista Real"
            className="w-full bg-luxury-950 border border-luxury-border rounded-lg p-3 text-white focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all placeholder:text-gray-700"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider font-bold text-gold-600 flex items-center gap-1">
            Preço
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              required
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="1.500.000"
              className="w-full bg-luxury-950 border border-luxury-border rounded-lg pl-9 pr-3 py-3 text-white focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all placeholder:text-gray-700"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-wider font-bold text-gold-600">Endereço</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Endereço completo do imóvel"
            className="w-full bg-luxury-950 border border-luxury-border rounded-lg pl-9 pr-3 py-3 text-white focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all placeholder:text-gray-700"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-wider font-bold text-gold-600">Características</label>
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            name="features"
            value={formData.features}
            onChange={handleChange}
            placeholder="Piscina, 4 Suítes, Garagem Subterrânea (separe por vírgula)"
            className="w-full bg-luxury-950 border border-luxury-border rounded-lg pl-9 pr-3 py-3 text-white focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all placeholder:text-gray-700"
          />
        </div>
      </div>

      <div className="space-y-2 pt-2">
         <div className="flex justify-between items-center">
            <label className="text-xs uppercase tracking-wider font-bold text-gold-600">Descrição</label>
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={isGenerating}
              className="text-xs flex items-center gap-1.5 text-purple-400 hover:text-purple-300 disabled:opacity-50 transition-colors bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20"
            >
              {isGenerating ? <Loader2 className="animate-spin w-3 h-3"/> : <Wand2 className="w-3 h-3"/>}
              Gerar com IA
            </button>
         </div>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Descrição detalhada do imóvel..."
          className="w-full bg-luxury-950 border border-luxury-border rounded-lg p-3 text-white focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all placeholder:text-gray-700 resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-wider font-bold text-gold-600">Foto de Capa</label>
        <div className="flex items-center gap-4 p-4 border border-dashed border-luxury-border rounded-lg bg-luxury-900/30">
            <label className="flex items-center gap-2 cursor-pointer bg-luxury-800 hover:bg-luxury-700 text-white px-4 py-2.5 rounded-lg transition-colors border border-luxury-border shadow-sm">
                <Upload size={16} />
                <span className="text-sm font-medium">Escolher Arquivo</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            {previewImage && (
                <div className="h-16 w-16 rounded overflow-hidden border border-gold-500/30 shadow-md">
                    <img src={previewImage} alt="Preview" className="h-full w-full object-cover" />
                </div>
            )}
            {!previewImage && <span className="text-xs text-gray-500 italic">Nenhuma imagem selecionada</span>}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-luxury-border">
        <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button type="submit">Salvar Imóvel</Button>
      </div>
    </form>
  );
};
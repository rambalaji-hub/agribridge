import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  PlusCircle, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Building2, 
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MarketplaceListing, CropType } from '../../types';
import { OFFICIAL_CROPS } from '../../data/mockData';

export const SurplusMarketplaceView: React.FC = () => {
  const { 
    marketplaceListings, 
    createMarketplaceListing, 
    openDetailDrawer, 
    currentUser,
    createMarketplaceOrder
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Listing Form State
  const [newCrop, setNewCrop] = useState<CropType>('Tomato');
  const [newQty, setNewQty] = useState(40);
  const [newPrice, setNewPrice] = useState(1650);
  const [newDesc, setNewDesc] = useState('Freshly harvested Grade-A hybrid tomatoes, sorted and packed in 25kg crates.');
  const [newLocation, setNewLocation] = useState(currentUser?.location || 'Karnal, Haryana');

  const filteredListings = marketplaceListings.filter(item => {
    const matchesSearch = item.crop.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.farmerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    const cropMeta = OFFICIAL_CROPS.find(c => c.name === newCrop);
    createMarketplaceListing({
      farmerId: currentUser?.id || 'farmer-01',
      farmerName: currentUser?.name || 'Sardar Ramesh Kumar',
      crop: newCrop,
      category: cropMeta?.category || 'Vegetables',
      quantityQuintals: newQty,
      pricePerQuintal: newPrice,
      location: newLocation,
      harvestDate: 'Harvested September 2026',
      imageUrl: cropMeta?.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600',
      description: newDesc,
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Informative Header with Clarification */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300">
              Auxiliary Direct Trading Channel
            </span>
            <span className="text-xs text-slate-400">&bull; ONDC Agriculture Compatible</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Direct Farmer-to-Buyer Surplus Marketplace
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5 leading-relaxed">
            Sell non-procured surplus produce, perishable vegetables, and specialty varieties directly to verified food processors, aggregators, and institutional bulk buyers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Surplus Lot</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crops, regions, farmers..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'Food Grains', 'Pulses', 'Oilseeds', 'Vegetables', 'Fruits', 'Commercial Crops'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Commodities' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Marketplace Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredListings.map(item => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
          >
            {/* Image Banner */}
            <div className="relative aspect-video bg-slate-100">
              <img
                src={item.imageUrl}
                alt={item.crop}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                {item.category}
              </div>
              <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-sm">
                ₹{item.pricePerQuintal} <span className="text-[10px] font-normal">/ Qtl</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {item.crop}
                  </h3>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {item.quantityQuintals} Quintals
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="flex items-center justify-between">
                  <span>Farmer:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{item.farmerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Location:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{item.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Harvesting:</span>
                  <span className="text-slate-700 dark:text-slate-300">{item.harvestDate}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => openDetailDrawer('crop', item)}
                  className="flex-1 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  View Lot Specs
                </button>
                {currentUser?.role === 'buyer' && (
                  <button
                    onClick={() => createMarketplaceOrder(item.id, Math.min(20, item.quantityQuintals), item.pricePerQuintal, 'Tomorrow, 10:00 AM')}
                    className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                  >
                    Direct Purchase
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Surplus Lot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  List Surplus Farm Produce
                </h3>
                <p className="text-xs text-slate-500">Post available lot directly to verified registered buyers</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Crop</label>
                <select
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value as CropType)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                >
                  {OFFICIAL_CROPS.map(c => (
                    <option key={c.id} value={c.name}>{c.name} ({c.category})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Available Quantity (Qtl)</label>
                  <input
                    type="number"
                    min={1}
                    value={newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Expected Price (₹ / Qtl)</label>
                  <input
                    type="number"
                    min={100}
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Lot Description & Packaging</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Farm Pickup Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Publish Listing to Buyers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

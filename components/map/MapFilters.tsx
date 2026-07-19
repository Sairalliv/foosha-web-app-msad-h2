'use client'

import { Search, Filter, X } from 'lucide-react'
import { useState } from 'react'

interface MapFiltersProps {
  categories: string[]
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function MapFilters({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  searchQuery,
  onSearchChange
}: MapFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2 max-w-sm w-full pr-4">
      {/* Search Bar */}
      <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-2 flex items-center border border-white/20">
        <div className="p-2 text-emerald-600 bg-emerald-50 rounded-xl mr-2">
          <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Search locations in Cebu..." 
          className="w-full bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm font-medium"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button 
            onClick={() => onSearchChange('')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Toggle Mobile */}
      <button 
        className="md:hidden bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-3 flex items-center justify-center gap-2 border border-white/20 font-semibold text-sm text-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter size={16} className="text-emerald-600" />
        {isOpen ? 'Hide Filters' : 'Show Filters'}
      </button>

      {/* Categories Panel */}
      <div className={`${isOpen ? 'flex' : 'hidden'} md:flex flex-col gap-2 bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-4 border border-white/20`}>
        <div className="flex items-center gap-2 mb-2">
          <Filter size={16} className="text-emerald-600" />
          <h3 className="font-bold text-gray-900 text-sm">Filter by Type</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              selectedCategory === null 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' 
                : 'bg-white text-gray-600 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200'
            }`}
          >
            All Locations
          </button>
          
          {categories.map(category => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                selectedCategory === category 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' 
                  : 'bg-white text-gray-600 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

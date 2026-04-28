'use client';

import { OutfitResult } from '@/lib/types';
import { ItemCard } from './item-card';
import { Bookmark } from 'lucide-react';

interface OutfitCardProps {
  outfit: OutfitResult;
  onSave: (id: string) => void;
}

export function OutfitCard({ outfit, onSave }: OutfitCardProps) {
  return (
    <div className="bg-card border border-border p-4">
      <div className="flex items-start justify-between mb-4">
        <button
          onClick={() => onSave(outfit.id)}
          className="p-1.5 hover:bg-muted transition-colors"
          aria-label={outfit.saved ? 'Remove from saved' : 'Save outfit'}
        >
          <Bookmark
            className={`w-5 h-5 ${outfit.saved ? 'fill-foreground' : ''}`}
          />
        </button>
        <h3 className="text-base font-medium text-foreground flex-1 text-center px-2">
          {outfit.title}
        </h3>
        <span className="text-sm font-medium text-foreground bg-muted px-2 py-1">
          ${outfit.totalCost}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {outfit.items.map((item, index) => (
          <ItemCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

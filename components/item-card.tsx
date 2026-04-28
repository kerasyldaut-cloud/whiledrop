'use client';

import { ClothingItem } from '@/lib/types';
import Image from 'next/image';

interface ItemCardProps {
  item: ClothingItem;
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <div className="flex gap-3 p-3 border border-border">
      <div className="relative w-20 h-20 flex-shrink-0 bg-muted">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">
          {item.type}
        </span>
        <span className="text-sm font-medium text-foreground truncate mt-0.5">
          {item.name}
        </span>
        <span className="text-sm text-foreground mt-auto">
          ${item.price}
        </span>
      </div>
      <a
        href={item.buyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="self-end px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
      >
        Buy
      </a>
    </div>
  );
}

'use client'

import { useState } from 'react'
import { mockCards, type Card } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>(mockCards)
  const [selectedCard, setSelectedCard] = useState<Card>(mockCards[0])

  function toggleFreeze(cardId: string) {
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? { ...c, status: c.status === 'active' ? 'frozen' : 'active' }
          : c
      )
    )
    if (selectedCard.id === cardId) {
      setSelectedCard((prev) => ({
        ...prev,
        status: prev.status === 'active' ? 'frozen' : 'active',
      }))
    }
  }

  const selected = cards.find((c) => c.id === selectedCard.id) ?? cards[0]

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">My Cards</h1>
        <p className="text-white/40 text-sm mt-1">{cards.length} cards</p>
      </div>

      {/* Card Selector */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => setSelectedCard(card)}
            className={cn(
              'relative shrink-0 w-72 h-44 rounded-2xl p-5 text-left transition-all overflow-hidden',
              `bg-gradient-to-br ${card.color}`,
              selected.id === card.id
                ? 'ring-2 ring-white/30 scale-[1.02]'
                : 'opacity-70 hover:opacity-90'
            )}
          >
            {card.status === 'frozen' && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
                <span className="text-white/80 font-semibold text-sm">❄ Frozen</span>
              </div>
            )}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-0 flex flex-col h-full">
              <div className="flex justify-between items-start mb-auto">
                <span className="text-white/70 text-xs capitalize font-medium">
                  {card.card_type} card
                </span>
                <span className="text-white text-xs font-semibold">{card.network}</span>
              </div>
              <div>
                <p className="text-white/80 font-mono text-sm tracking-widest mb-2">{card.card_number}</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-white/50 text-xs">Card Holder</p>
                    <p className="text-white font-medium text-sm">{card.card_holder}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/50 text-xs">Expires</p>
                    <p className="text-white font-mono text-sm">{card.expiry}</p>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}

        {/* Add Card Button */}
        <button className="shrink-0 w-72 h-44 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-white/30 hover:text-white/60 hover:border-white/20 transition-all">
          <span className="text-3xl">+</span>
          <span className="text-sm">Add new card</span>
        </button>
      </div>

      {/* Selected Card Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: selected.status === 'active' ? 'Freeze Card' : 'Unfreeze Card',
            icon: selected.status === 'active' ? '❄' : '🔥',
            action: () => toggleFreeze(selected.id),
            color: selected.status === 'active' ? 'text-blue-400' : 'text-orange-400',
          },
          { label: 'View PIN', icon: '🔑', action: () => alert('PIN: ****'), color: 'text-yellow-400' },
          { label: 'Set Limits', icon: '⚙', action: () => {}, color: 'text-violet-400' },
          { label: 'Report Lost', icon: '⚠', action: () => {}, color: 'text-red-400' },
        ].map((action) => (
          <button
            key={action.label}
            onClick={action.action}
            className="glass glass-hover rounded-xl p-4 flex flex-col items-center gap-2 transition-all"
          >
            <span className="text-2xl">{action.icon}</span>
            <span className={`text-xs font-medium ${action.color}`}>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Card Details */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="text-white font-semibold mb-4">Card Details</h2>
        {[
          { label: 'Card Number', value: selected.card_number },
          { label: 'Card Holder', value: selected.card_holder },
          { label: 'Expiry Date', value: selected.expiry },
          { label: 'Card Type', value: selected.card_type.charAt(0).toUpperCase() + selected.card_type.slice(1) },
          { label: 'Network', value: selected.network },
          {
            label: 'Status',
            value: selected.status.charAt(0).toUpperCase() + selected.status.slice(1),
            color: selected.status === 'active' ? 'text-emerald-400' : 'text-blue-400',
          },
        ].map((detail) => (
          <div key={detail.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
            <span className="text-white/40 text-sm">{detail.label}</span>
            <span className={`text-sm font-medium ${detail.color ?? 'text-white/80'}`}>{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

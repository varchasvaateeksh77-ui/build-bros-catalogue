import React, { useRef, useState } from 'react';
import { SectionLabel } from '../ui/Pill';
import { Tabs, TabOption } from '../ui/Tabs';
import { PhoneWindow } from '../windows/PhoneWindow';
import { ReceptionWindow } from '../windows/ReceptionWindow';
import { KitchenWindow } from '../windows/KitchenWindow';
import {
  CartEntry,
  DishItem,
  OrderStatus,
  OrderTicket,
  ServiceLevel,
  VENUE_MENUS,
  VenueType,
  WaiterNotification,
  calculateCartTotal,
} from '../windows/demoStore';
import { Flip } from '../../lib/gsap';
import { soundFX, useSoundEffects } from '../../lib/soundEffects';

const LEVEL_TABS: TabOption<ServiceLevel>[] = [
  { id: 1, label: 'Digital menu' },
  { id: 2, label: 'Waiter call' },
  { id: 3, label: 'Full ordering' },
];

const VENUE_TABS: TabOption<VenueType>[] = [
  { id: 'Cafe', label: 'Cafe' },
  { id: 'Restaurant', label: 'Restaurant' },
  { id: 'Bakery', label: 'Bakery' },
];

export const Demo: React.FC = () => {
  const [level, setLevel] = useState<ServiceLevel>(3);
  const [venue, setVenue] = useState<VenueType>('Cafe');
  const stageGridRef = useRef<HTMLDivElement | null>(null);
  const { soundEnabled, toggleSound } = useSoundEffects();

  const [cart, setCart] = useState<CartEntry[]>(() => [
    { dish: VENUE_MENUS.Cafe[0], qty: 2 },
    { dish: VENUE_MENUS.Cafe[2], qty: 1 },
  ]);

  const [waiterAlert, setWaiterAlert] = useState<WaiterNotification | null>({
    id: 'w-init',
    table: 5,
    status: 'Needs you',
    itemsSummary: '2x Flat white, 1x Smash burger',
    total: 16.5,
  });

  const [ticket, setTicket] = useState<OrderTicket | null>(() => ({
    ticketNumber: '#0412',
    table: 5,
    items: [
      { dish: VENUE_MENUS.Cafe[0], qty: 2 },
      { dish: VENUE_MENUS.Cafe[2], qty: 1 },
    ],
    total: 16.5,
    receptionConfirmed: false,
    kitchenStatus: 'New',
  }));

  const [phoneOrderStatus, setPhoneOrderStatus] = useState<OrderStatus>('Sent');

  const handleLevelChange = (newLevel: ServiceLevel) => {
    soundFX.play('tap');
    setLevel(newLevel);
  };

  const handleVenueChange = (newVenue: VenueType) => {
    soundFX.play('tap');
    const state = stageGridRef.current ? Flip.getState(stageGridRef.current.children) : null;
    setVenue(newVenue);
    const defaultDishes = VENUE_MENUS[newVenue];
    const initialCart = [
      { dish: defaultDishes[0], qty: 1 },
      { dish: defaultDishes[1], qty: 1 },
    ];
    setCart(initialCart);
    setWaiterAlert(null);
    setTicket(null);
    setPhoneOrderStatus('Idle');

    if (state) {
      requestAnimationFrame(() => {
        Flip.from(state, { duration: 0.3, ease: 'power3.out' });
      });
    }
  };

  const handleAddDish = (dish: DishItem) => {
    soundFX.play('cartAdd');
    setCart((prev) => {
      const existing = prev.find((c) => c.dish.id === dish.id);
      if (existing) {
        return prev.map((c) => (c.dish.id === dish.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { dish, qty: 1 }];
    });
  };

  const handleRemoveDish = (dishId: string) => {
    soundFX.play('cartRemove');
    setCart((prev) =>
      prev
        .map((c) => (c.dish.id === dishId ? { ...c, qty: c.qty - 1 } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const handleCallWaiter = () => {
    soundFX.play('waiterCall');
    const summary = cart.map((c) => `${c.qty}x ${c.dish.name}`).join(', ');
    setWaiterAlert({
      id: `w-${Date.now()}`,
      table: 5,
      status: 'Needs you',
      itemsSummary: summary || 'Table 5 request',
      total: calculateCartTotal(cart),
    });
  };

  const handleAcknowledgeWaiter = () => {
    soundFX.play('served');
    setWaiterAlert((prev) => (prev ? { ...prev, status: 'Order taken' } : null));
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    soundFX.play('ticketSent');
    const newTicket: OrderTicket = {
      ticketNumber: '#0412',
      table: 5,
      items: [...cart],
      total: calculateCartTotal(cart),
      receptionConfirmed: false,
      kitchenStatus: 'New',
    };
    setTicket(newTicket);
    setPhoneOrderStatus('Sent');
  };

  const handleConfirmReception = () => {
    soundFX.play('tap');
    setTicket((prev) => (prev ? { ...prev, receptionConfirmed: true } : null));
  };

  const handleAdvanceKitchen = () => {
    if (!ticket) return;
    const nextMap: Record<OrderTicket['kitchenStatus'], OrderTicket['kitchenStatus']> = {
      New: 'Cooking',
      Cooking: 'Ready',
      Ready: 'Served',
      Served: 'Served',
    };
    const nextStatus = nextMap[ticket.kitchenStatus];
    soundFX.play(nextStatus === 'Served' ? 'served' : 'kitchenReady');
    setTicket({ ...ticket, kitchenStatus: nextStatus });
    setPhoneOrderStatus(nextStatus === 'New' ? 'Sent' : nextStatus);
  };

  return (
    <section id="demo" className="py-16 md:py-24 px-[14px] md:px-6 bg-[#F7F2ED]">
      <div className="max-w-[1200px] mx-auto">
        <div className="max-w-[680px] mb-8">
          <SectionLabel text="Try it" />
          <h2
            className="text-[30px] md:text-[48px] font-semibold text-[#1A0C06] leading-[1.06] tracking-[-0.035em] m-0 mb-3"
            style={{ textWrap: 'balance' }}
          >
            Try table five yourself.
          </h2>
          <p className="text-[16px] md:text-[18px] leading-[1.5] text-[#6C625C] m-0">
            Pick a service level and a sample venue. Add dishes to the cart on the
            phone and watch the staff screens respond right next to it.
          </p>
        </div>

        {/* White Demo Stage */}
        <div className="bg-[#FFFFFF] rounded-[24px] border border-[#E3D9D3] p-5 md:p-8 flex flex-col gap-8">
          {/* Two rows of chips: Level tabs, Venue chips, and Sound toggle */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E3D9D3]">
            <div className="flex flex-col gap-2">
              <span className="text-[12px] font-mono-code font-semibold uppercase text-[#6C625C]">
                Service level
              </span>
              <Tabs
                options={LEVEL_TABS}
                activeId={level}
                onChange={handleLevelChange}
                ariaLabel="Demo service level"
              />
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-mono-code font-semibold uppercase text-[#6C625C]">
                  Sample venue (Demo data)
                </span>
                <Tabs
                  options={VENUE_TABS}
                  activeId={venue}
                  onChange={handleVenueChange}
                  ariaLabel="Demo sample venue"
                  variant="underline"
                  className="border-b-0 pb-0"
                />
              </div>

              <button
                type="button"
                onClick={toggleSound}
                aria-pressed={soundEnabled}
                className="px-3 py-1.5 rounded-[10px] bg-[#F3ECE5] hover:bg-[#FFEEE3] border border-[#E3D9D3] text-[12px] font-mono-code font-semibold text-[#1A0C06] cursor-pointer transition-colors"
              >
                {soundEnabled ? 'Sound FX: On' : 'Sound FX: Off'}
              </button>
            </div>
          </div>

          {/* Windows stage */}
          <div
            ref={stageGridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start justify-items-center bg-[#F7F2ED] p-5 md:p-8 rounded-[20px] border border-[#E3D9D3]"
          >
            {/* Guest Phone (all levels) */}
            <PhoneWindow
              level={level}
              dishes={VENUE_MENUS[venue]}
              cart={cart}
              onAddDish={handleAddDish}
              onRemoveDish={handleRemoveDish}
              onCallWaiter={handleCallWaiter}
              onPlaceOrder={handlePlaceOrder}
              waiterCalled={Boolean(waiterAlert)}
              waiterAcknowledged={waiterAlert?.status === 'Order taken'}
              orderStatus={phoneOrderStatus}
              ticketNumber={ticket?.ticketNumber || '#0412'}
            />

            {/* Level 1 note */}
            {level === 1 && (
              <div className="md:col-span-1 lg:col-span-2 bg-[#FFFFFF] rounded-[20px] border border-[#E3D9D3] p-6 max-w-[540px] w-full self-center">
                <span className="px-2.5 py-0.5 rounded-[6px] bg-[#FFEEE3] text-[#C03E0A] font-mono-code text-[12px] font-semibold">
                  Level 1 · Digital menu
                </span>
                <h3 className="text-[22px] font-semibold text-[#1A0C06] mt-3 mb-2">
                  Browse categories, photos and prices.
                </h3>
                <p className="text-[15px] leading-[1.5] text-[#6C625C] m-0">
                  At Level 1 guests scan the table code and browse the menu in
                  their browser. Your staff still take orders at the table the
                  normal way. Switch to Level 2 or Level 3 above to test waiter
                  calls and kitchen tickets.
                </p>
              </div>
            )}

            {/* Level 2 Waiter Screen */}
            {level === 2 && (
              <div className="md:col-span-1 lg:col-span-2 flex flex-col sm:flex-row items-start gap-6 w-full justify-center">
                <ReceptionWindow
                  mode="waiter"
                  waiterAlert={waiterAlert}
                  onAcknowledgeWaiter={handleAcknowledgeWaiter}
                />
              </div>
            )}

            {/* Level 3 Reception + Kitchen Screens */}
            {level === 3 && (
              <>
                <ReceptionWindow
                  mode="reception"
                  ticket={ticket}
                  onConfirmOrder={handleConfirmReception}
                />
                <KitchenWindow
                  ticket={ticket}
                  onAdvanceStatus={handleAdvanceKitchen}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

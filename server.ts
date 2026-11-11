import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import {
  PRODUCT_THEMES,
  ThemeId,
  ThemeMenuItem,
  LiveOrderTicket,
  LiveWaiterCall,
} from './src/catalogue/themeCatalogData';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // In-memory real-time store synchronized via SSE (/api/events)
  const menusByTheme: Record<ThemeId, ThemeMenuItem[]> = {
    'classy-elegant': [...PRODUCT_THEMES[0].menu],
    minimalist: [...PRODUCT_THEMES[1].menu],
    'street-style': [...PRODUCT_THEMES[2].menu],
    'artisanal-terracotta': [...PRODUCT_THEMES[3].menu],
  };

  let tickets: LiveOrderTicket[] = [
    {
      ticketNumber: '#0414',
      tableNumber: 5,
      items: [
        {
          id: 'ce-1',
          name: 'Truffle & Heirloom Burrata',
          qty: 1,
          price: 18.0,
          imageUrl: PRODUCT_THEMES[0].menu[0].imageUrl,
        },
        {
          id: 'ce-3',
          name: '36-Hour Crispy Duck Confit',
          qty: 1,
          price: 34.0,
          imageUrl: PRODUCT_THEMES[0].menu[2].imageUrl,
        },
      ],
      total: 52.0,
      status: 'cooking',
      createdAt: 'Just now',
      source: 'guest-direct',
    },
  ];

  let waiterCalls: LiveWaiterCall[] = [];

  const sseClients = new Set<express.Response>();

  function broadcastState(lastEvent?: string) {
    const payload = JSON.stringify({
      type: 'STATE_SYNC',
      lastEvent: lastEvent || 'sync',
      tickets,
      waiterCalls,
      menusByTheme,
      timestamp: new Date().toISOString(),
    });
    for (const client of sseClients) {
      client.write(`data: ${payload}\n\n`);
    }
  }

  // 1. Real-Time SSE Stream for Guest Phone, Waiter Handheld, and Kitchen KDS
  app.get('/api/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    sseClients.add(res);
    res.write(
      `data: ${JSON.stringify({
        type: 'STATE_SYNC',
        lastEvent: 'connected',
        tickets,
        waiterCalls,
        menusByTheme,
      })}\n\n`
    );

    req.on('close', () => {
      sseClients.delete(res);
    });
  });

  // 2. Snapshot State Endpoint
  app.get('/api/state', (_req, res) => {
    res.json({ tickets, waiterCalls, menusByTheme });
  });

  // 3. Guest Calls Waiter (Level 2 Standby Flow)
  app.post('/api/waiter-calls', (req, res) => {
    const call: LiveWaiterCall = req.body;
    waiterCalls = [call, ...waiterCalls.filter((c) => c.id !== call.id)];
    broadcastState(`Waiter called for Table ${call.tableNumber}`);
    res.status(201).json({ ok: true, call });
  });

  // 4. Waiter Handheld Actions (Acknowledge -> Walking -> Confirm Cart to Kitchen -> Assisted)
  app.patch('/api/waiter-calls/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body as { status: LiveWaiterCall['status'] };
    let targetCall: LiveWaiterCall | undefined;

    waiterCalls = waiterCalls.map((c) => {
      if (c.id !== id) return c;
      targetCall = { ...c, status };
      return targetCall;
    });

    // If waiter confirms the guest's cart at the table, automatically dispatch a ticket to Kitchen KDS
    if (status === 'confirmed' && targetCall && targetCall.cartItems.length > 0) {
      const nextNum = `#0${415 + tickets.length}`;
      const newTicket: LiveOrderTicket = {
        ticketNumber: nextNum,
        tableNumber: targetCall.tableNumber,
        items: targetCall.cartItems.map((it, idx) => ({
          ...it,
          note: idx === 0 && targetCall?.note ? targetCall.note : undefined,
        })),
        total: targetCall.cartTotal,
        status: 'incoming',
        createdAt: 'Confirmed by Waiter',
        source: 'waiter-confirmed',
      };
      tickets = [newTicket, ...tickets];
    }

    broadcastState(`Waiter updated call ${id} to ${status}`);
    res.json({ ok: true, call: targetCall, tickets });
  });

  // 5. Guest Direct Order (Level 3)
  app.post('/api/orders', (req, res) => {
    const ticket: LiveOrderTicket = req.body;
    tickets = [ticket, ...tickets];
    broadcastState(`New order ${ticket.ticketNumber} for Table ${ticket.tableNumber}`);
    res.status(201).json({ ok: true, ticket });
  });

  // 6. Kitchen KDS Status Progression (incoming -> confirmed -> cooking -> ready -> served)
  app.patch('/api/orders/:ticketNumber', (req, res) => {
    const rawNum = req.params.ticketNumber;
    const ticketNumber = rawNum.startsWith('#') ? rawNum : `#${rawNum}`;
    const { status } = req.body as { status: LiveOrderTicket['status'] };

    tickets = tickets.map((t) =>
      t.ticketNumber === ticketNumber ? { ...t, status } : t
    );
    broadcastState(`Ticket ${ticketNumber} marked ${status}`);
    res.json({ ok: true, tickets });
  });

  // 7. Hidden Owner Admin Panel Menu Sync (Update Prices, Photos, SoldOut, or Add Dish)
  app.put('/api/menu/:themeId', (req, res) => {
    const themeId = req.params.themeId as ThemeId;
    const { menu } = req.body as { menu: ThemeMenuItem[] };
    if (menu && Array.isArray(menu)) {
      menusByTheme[themeId] = menu;
      broadcastState(`Menu updated for ${themeId}`);
    }
    res.json({ ok: true, menu: menusByTheme[themeId] });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Build Bros Product OS server running on http://localhost:${PORT}`);
  });
}

startServer();

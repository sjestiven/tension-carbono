import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';
import { playTemplate } from '../src/demo.js';

test('The completed-game results render all roles and both foundation inventories', async () => {
  const server = await createServer({
    logLevel: 'silent',
    server: { middlewareMode: true, watch: null },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  try {
    const { Results } = await server.ssrLoadModule('/src/App.jsx');
    const html = renderToString(React.createElement(Results, { game: playTemplate() }));
    assert.match(html, /Resultados de la partida/);
    for (const name of ['Estado', 'Empresa A', 'Empresa B', 'Empresa C', 'Fundación Bosque', 'Fundación Horizonte']) assert.ok(html.includes(name), name);
    assert.match(html, /Oferta y demanda de créditos/);
    assert.match(html, /95,5/);
  } finally {
    await server.close();
  }
});

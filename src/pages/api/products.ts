// src/pages/api/products.ts
export const prerender = false;

import type { APIRoute } from 'astro';

// Importa el JSON directamente — Astro lo convertirá en un objeto JS
import cursosRaw from '../../../public/cursos.json';

export const GET: APIRoute = async ({ request }) => {
  try {
    // 1) Obtén tu array de productos
    // (ajusta si tu JSON tiene otra estructura, p.ej. cursosRaw.data)
    const items = (cursosRaw as any[]);

    // 2) Parseo de query params
    const url        = new URL(request.url);
    const page       = Math.max(1, parseInt(url.searchParams.get('page')  || '1',  10));
    const limit      = Math.max(1, parseInt(url.searchParams.get('limit') || '5',  10));
    const proveedor  = url.searchParams.get('proveedor')?.toLowerCase() || '';
    const nombre     = url.searchParams.get('nombre')?.toLowerCase()   || '';

    // 3) Filtrado opcional
    let filtered = items;
    if (proveedor) {
      filtered = filtered.filter(i =>
        String(i.proveedorNombre).toLowerCase().includes(proveedor)
      );
    }
    if (nombre) {
      filtered = filtered.filter(i =>
        String(i.descripcion).toLowerCase().includes(nombre)
      );
    }

    // 4) Paginación
    const total = filtered.length;
    const start = (page - 1) * limit;
    const data  = filtered.slice(start, start + limit);

    // 5) Responder con CORS y cache headers
    const headers = {
      'Content-Type':              'application/json',
      'Access-Control-Allow-Origin': '*',
      // Opcional: cache en el edge por 60s
      'Cache-Control':             's-maxage=60, stale-while-revalidate=300',
    };

    return new Response(
      JSON.stringify({ data, total, page, limit }),
      { status: 200, headers }
    );

  } catch (err: any) {
    console.error('Error en API /api/products:', err);
    return new Response(
      JSON.stringify({ error: 'Error interno al leer los productos.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

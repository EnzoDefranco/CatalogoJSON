// src/pages/api/products.ts
export const prerender = false;

import type { APIRoute } from 'astro';
import cursosRaw from '../../../public/cursos.json';

export const GET: APIRoute = async ({ request }) => {
  try {
    const items = cursosRaw as any[];
    const url   = new URL(request.url);

    // 1) Paginación
    const page  = Math.max(1, parseInt(url.searchParams.get('page')  || '1', 10));
    const limit = Math.max(1, parseInt(url.searchParams.get('limit') || '5', 10));

    // 2) Búsqueda global en `q`
    const qRaw = url.searchParams.get('q')?.trim().toLowerCase() || '';
    let filtered = items;

    if (qRaw) {
      if (/^\d+$/.test(qRaw)) {
        // si solo dígitos → filtro exacto por ID (ambos convertidos a número)
        const idNum = Number(qRaw);
        filtered = filtered.filter(i => Number(i.idArticulo) === idNum);
      } else {
        // texto → coincidencia en descripción O proveedor
        filtered = filtered.filter(i =>
          String(i.descripcion).toLowerCase().includes(qRaw) ||
          String(i.proveedorNombre).toLowerCase().includes(qRaw)
        );
      }
    }

    // 3) Slice para paginar
    const total = filtered.length;
    const start = (page - 1) * limit;
    const data  = filtered.slice(start, start + limit);

    // 4) Respuesta con cabeceras CORS y cache
    const headers = {
      'Content-Type':               'application/json',
      'Access-Control-Allow-Origin':'*',
      'Cache-Control':              's-maxage=60, stale-while-revalidate=300',
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

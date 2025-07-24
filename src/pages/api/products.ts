// src/pages/api/products.ts
export const prerender = false;

import type { APIRoute } from 'astro';
import cursosRaw from '../../../public/cursos.json';

export const GET: APIRoute = async ({ request }) => {
  try {
    const items = cursosRaw as any[];

    const url        = new URL(request.url);
    const page       = Math.max(1, parseInt(url.searchParams.get('page')  || '1',  10));
    const limit      = Math.max(1, parseInt(url.searchParams.get('limit') || '5',  10));
    const proveedor  = url.searchParams.get('proveedor')?.toLowerCase() || '';
    const nombre     = url.searchParams.get('nombre')?.toLowerCase()   || '';
    const idArticulo = url.searchParams.get('idArticulo');

    // 1) Filtrado base
    let filtered = items;

    // 2) Si pasaron idArticulo, filtramos exacto
    if (idArticulo) {
      const idNum = Number(idArticulo);
      if (!isNaN(idNum)) {
        filtered = filtered.filter(i => i.idArticulo === idNum);
      } else {
        // Si no es número válido, devolvemos vacío
        filtered = [];
      }
    }

    // 3) Filtros de proveedor y nombre
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

    // 5) Cabeceras y respuesta
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

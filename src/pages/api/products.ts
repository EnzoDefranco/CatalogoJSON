// src/pages/api/products.ts
export const prerender = false;

import type { APIRoute } from 'astro';
import { readFile }       from 'fs/promises';
import { fileURLToPath }  from 'url';
import { dirname, join }  from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const GET: APIRoute = async ({ request }) => {
  // 1) Leer JSON
  const raw   = await readFile(
    join(__dirname, '../../../public/cursos.json'),
    'utf-8'
  );
  const items = JSON.parse(raw) as any[];

  // 2) Construir URL base
  const host = request.headers.get('host')!;
  const url  = new URL(request.url, `http://${host}`);

  // 3) Leer params
  const page     = parseInt(url.searchParams.get('page')  || '1', 10);
  const limit    = parseInt(url.searchParams.get('limit') || '5', 10);
  const proveedor = url.searchParams.get('proveedor')?.toLowerCase() || '';
  const nombre    = url.searchParams.get('nombre')?.toLowerCase()   || '';

  // 4) Filtrar por proveedor y/o nombre
  let filtered = items;
  if (proveedor) {
    filtered = filtered.filter(item =>
      item.proveedorNombre.toString().toLowerCase().includes(proveedor)
    );
  }
  if (nombre) {
    filtered = filtered.filter(item =>
      item.descripcion.toString().toLowerCase().includes(nombre)
    );
  }

  // 5) Calcular total y rangos sobre el filtrado
  const total = filtered.length;
  const start = (page - 1) * limit;
  const end   = start + limit;

  // 6) Slice para paginar
  const data = filtered.slice(start, end);

  console.log(
    `GET /api/products → total=${total}, page=${page}, limit=${limit}, ` +
    `proveedor="${proveedor}", nombre="${nombre}"`
  );

  // 7) Responder
  return new Response(
    JSON.stringify({ data, total, page, limit }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

import type { APIRoute } from 'astro';
import { readFile }       from 'fs/promises';
import { fileURLToPath }  from 'url';
import { dirname, join }  from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const GET: APIRoute = async () => {
  // Sube 3 niveles (api → pages → src → root) y entra a public/
  const raw = await readFile(
    join(__dirname, '../../../public/cursos.json'),'utf-8');
  const data = JSON.parse(raw);
    console.log('Total items:', data.length);

  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

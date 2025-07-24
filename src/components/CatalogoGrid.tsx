// src/components/CatalogoGrid.tsx

import React from 'react';
import type { FC } from 'react';
import ProductCard from './ProductCard';
import type { Course } from './ProductCard';

interface Props {
  searchTerm: string;
}

const CatalogoGrid: FC<Props> = ({ searchTerm }) => {
  const [cursos, setCursos] = React.useState<Course[]>([]);
  const [page, setPage]     = React.useState(1);
  const [limit]             = React.useState(8);  // Ajusta cuántos por página
  const [total, setTotal]   = React.useState(0);

  const totalPages = Math.ceil(total / limit);

  React.useEffect(() => {
    const q = new URLSearchParams({
      nombre: searchTerm,
      page:   String(page),
      limit:  String(limit),
    });
    fetch(`/api/products?${q.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        setCursos(json.data);
        setTotal(json.total);
      })
      .catch((err) => console.error(err));
  }, [searchTerm, page, limit]);

  return (
    <div>
      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
        {cursos.map((course) => (
          <ProductCard key={course.idArticulo} product={course} />
        ))}
      </div>

      {/* Controles de paginación */}
      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          « Anterior
        </button>

        <span>
          Página {page} de {totalPages || 1}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || totalPages === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente »
        </button>
      </div>
    </div>
  );
};

export default CatalogoGrid;

// src/components/ProductCard.tsx
import React from 'react';
import type { FC, ImgHTMLAttributes } from 'react';

export interface Course {
  idArticulo: string;
  descripcion: string;
  proveedorNombre: string;
  precioLista4: number;
  stock: number;
  division: string;
  kilosUnitarios?: number;
  eanUnidad?: string;
  ultModificacion?: string;
  imageUrl?: string;
  precioL4?: number;
}

interface ProductCardProps {
  product: Course;
}

const parseDate = (dateStr: string): string => {
  const firstLine = dateStr.split('\n')[0].trim();
  const match = firstLine.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  return match
    ? `${match[1].padStart(2, '0')}/${match[2].padStart(2, '0')}/${match[3]}`
    : '';
};

const fallbackSrc = '/images/prueba.jpg';

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const fecha = product.ultModificacion ? parseDate(product.ultModificacion) : '';
  const isOutOfStock = product.stock === 0;

  const handleImgError: ImgHTMLAttributes<HTMLImageElement>['onError'] = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallbackSrc;
  };

  return (
    <div className="relative flex flex-col justify-between rounded-3xl bg-white p-5 pt-12 text-center shadow-md hover:shadow-lg max-w-xs mx-auto">
      {/* Badges */}
      <div className="absolute top-3 left-3 flex space-x-2">
        {isOutOfStock && (
          <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Sin Stock
          </span>
        )}
        <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded">
          {product.division}
        </span>
      </div>

      {/* Kilos badge */}
      {typeof product.kilosUnitarios === 'number' && product.kilosUnitarios > 0 && (
        <div className="absolute top-1 right-1 bg-green-500 text-white text-xs font-medium px-1 rounded-full">
          {product.kilosUnitarios.toFixed(2)} KG
        </div>
      )}

      {/* Imagen */}
      <img
        src={`https://catalogoenro.s3.us-east-2.amazonaws.com/${product.idArticulo}.webp`}
        alt={product.descripcion}
        className="w-[200px] h-[200px] object-cover rounded-lg mx-auto"
        loading="lazy"
        onError={handleImgError}
      />

      {/* Título y detalles */}
      <div className="mt-4">
        <h3 className="text-md font-semibold text-gray-900 leading-snug mb-1">
          {product.descripcion}
        </h3>
        <p className="text-sm text-gray-700">{product.proveedorNombre}</p>
        <p className="text-xs text-gray-500 mt-1 leading-snug">
          Cod. Enro: {product.idArticulo}
          <br />
          Stock: {product.stock}
          {fecha && (
            <>
              <br />
              Última modif.: {fecha}
            </>
          )}
        </p>
      </div>

      {/* Precio */}
      <div className="mt-4">
        <p className="text-lg font-bold text-gray-900">
          ${product.precioL4?.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;

import React, { useState } from "react";

// --- Constantes ---
const CHAR_INCREMENT = 200; // Cuántos caracteres mostrar por cada clic

interface ExpandableDescriptionProps {
  text: string; // El texto completo de la descripción
}

const ExpandableDescription: React.FC<ExpandableDescriptionProps> = ({
  text,
}) => {
  const [visibleLength, setVisibleLength] = useState(CHAR_INCREMENT);

  const fullLength = text.length;

  // Verifica si el texto está actualmente truncado
  const isTruncated = fullLength > visibleLength;

  // Determina el texto que se va a mostrar
  const displayedText = isTruncated
    ? text.slice(0, visibleLength) + "..." // Texto cortado con "..."
    : text; // Texto completo

  // Función que se llama al hacer clic
  const handleExpand = () => {
    // Solo expande si el texto todavía está truncado
    if (isTruncated) {
      setVisibleLength((prevLength) => prevLength + CHAR_INCREMENT);
    }
  };

  return (
    <p
      // El 'title' es el texto que aparece cuando dejas el mouse encima
      title={isTruncated ? "Haz clic para expandir" : "Descripción completa"}
      onClick={handleExpand}
      // Tailwind: max-w-xs limita el ancho, y añadimos cursor-pointer si se puede expandir
      className={`max-w-xs ${
        isTruncated ? "cursor-pointer text-blue-600 hover:text-blue-800" : ""
      }`}
    >
      {displayedText}
    </p>
  );
};

export default ExpandableDescription;

export function BagCategoryIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Asas del bolso */}
      <path
        d="M8.5 8V6.5C8.5 4.29 10.07 2.5 12 2.5C13.93 2.5 15.5 4.29 15.5 6.5V8"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      {/* Cuerpo del bolso */}
      <path
        d="M4.5 9.5C4.5 8.67 5.17 8 6 8H18C18.83 8 19.5 8.67 19.5 9.5L20.3 18.5C20.4 19.88 19.32 21 17.93 21H6.07C4.68 21 3.6 19.88 3.7 18.5L4.5 9.5Z"
        fill="currentColor"
        fillOpacity="0.14"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      {/* Puntadas tejidas */}
      <path
        d="M7.5 12H9.5M11 12H13M14.5 12H16.5M7.5 16H9.5M11 16H13M14.5 16H16.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="1.5 1.8"
      />
    </svg>
  );
}

export function PouchCategoryIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Cuerpo compacto de cosmetiquera */}
      <path
        d="M3.5 11.5C3.5 9.84 4.84 8.5 6.5 8.5H17.5C19.16 8.5 20.5 9.84 20.5 11.5V16.5C20.5 18.16 19.16 19.5 17.5 19.5H6.5C4.84 19.5 3.5 18.16 3.5 16.5V11.5Z"
        fill="currentColor"
        fillOpacity="0.14"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      {/* Línea superior tipo cremallera / costura */}
      <path
        d="M5.5 11.5H18.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      {/* Tirador / detalle de cierre */}
      <circle cx="17.5" cy="11.5" r="1.4" fill="currentColor" />
      {/* Puntadas de crochet en la base */}
      <path
        d="M7 15H9M11 15H13M15 15H17"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="1.5 1.8"
      />
    </svg>
  );
}

export function CategoryBadgeIcon({ categoria = "", size = 14 }) {
  const texto = categoria.toLowerCase();
  if (texto.includes("cosmetiquera") || texto.includes("accesorio")) {
    return <PouchCategoryIcon size={size} />;
  }
  return <BagCategoryIcon size={size} />;
}

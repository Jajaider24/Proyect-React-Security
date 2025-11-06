import L from "leaflet";
// Importar imágenes para que Webpack/CRA resuelva las rutas correctamente
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Eliminar método interno para que usemos las URLs suministradas
// @ts-ignore - propiedad interna
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export {}; // módulo sin exports, solo efectos secundarios

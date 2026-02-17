# Instrucciones para agregar el logo

## 📁 Coloca el logo aquí

Guarda la imagen del logo del Acueducto como:

```
src/assets/logo.png
```

### Formatos recomendados:
- **PNG** con fondo transparente (recomendado)
- **SVG** para mejor escalabilidad
- **JPG** si no necesitas transparencia

### Tamaño recomendado:
- Mínimo: 200x200 px
- Óptimo: 512x512 px
- El componente lo redimensionará automáticamente

### Uso en componentes:

```jsx
import logo from '../assets/logo.png';

<img src={logo} alt="Logo" className="w-20 h-20" />
```

### Archivos actuales en esta carpeta:
- `react.svg` - Logo de React (ejemplo)
- `logo.png` - **Coloca tu logo aquí** ⬅️

# BarberShop SaaS - Frontend

Sistema profesional de gestión de citas para barbería desarrollado con Angular 19 y TypeScript.

## 🚀 Características

- **Angular 19** con TypeScript estricto
- **Tailwind CSS** para diseño responsive y profesional
- **Formularios reactivos** con validación
- **Autenticación simulada** (preparado para Auth0)
- **Sistema de roles** (Cliente, Barbero, Admin)
- **Dashboard interactivo** con estadísticas
- **Gestión de servicios y barberos**
- **Diseño mobile-first**

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── models/          # Interfaces TypeScript
│   │   ├── services/        # Servicios Angular
│   │   ├── pages/           # Componentes de páginas
│   │   ├── components/      # Componentes reutilizables
│   │   ├── app.routes.ts    # Configuración de rutas
│   │   └── app.component.ts # Componente principal
│   ├── assets/              # Recursos estáticos
│   ├── environments/        # Configuraciones de entorno
│   └── styles.scss          # Estilos globales
├── tailwind.config.js       # Configuración Tailwind
├── angular.json             # Configuración Angular
└── package.json             # Dependencias
```

## 🛠️ Instalación

### Prerrequisitos
- Node.js 18+
- npm 9+

### Pasos

1. **Instalar dependencias:**
   ```bash
   cd frontend
   npm install
   ```

2. **Instalar Angular CLI globalmente (si no lo tienes):**
   ```bash
   npm install -g @angular/cli@latest
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm start
   # o
   ng serve
   ```

4. **Abrir en el navegador:**
   ```
   http://localhost:4200
   ```

## 🔐 Credenciales Demo

Para probar la aplicación usa estas credenciales:

- **Email:** demo@barbershop.com
- **Password:** demo123

## 📱 Páginas Principales

### 🔑 Login & Registro
- Formularios con validación completa
- Diseño responsive
- Estados de carga
- Manejo de errores

### 📊 Dashboard
- Estadísticas en tiempo real
- Vista de servicios disponibles
- Lista de barberos
- Navegación intuitiva

### 👤 Gestión de Usuarios
- Diferentes roles (Cliente, Barbero, Admin)
- Perfiles personalizados
- Autenticación local (preparado para Auth0)

## 🎨 Diseño

### Paleta de Colores
- **Primary:** Azul profesional (#2563eb)
- **Accent:** Dorado elegante (#f59e0b)
- **Neutral:** Grises modernos
- **Success:** Verde (#059669)
- **Error:** Rojo (#dc2626)

### Componentes UI
- Cards responsivas
- Botones con estados
- Formularios estilizados
- Navegación moderna
- Iconos SVG

## 🔧 Configuración

### Tailwind CSS
El proyecto incluye configuración personalizada de Tailwind con:
- Colores de marca
- Fuentes personalizadas
- Clases utilitarias

### TypeScript
- Modo estricto habilitado
- Interfaces tipadas para todos los modelos
- Servicios con tipos definidos

### Angular
- Componentes standalone
- Formularios reactivos
- Routing configurado
- Guards de autenticación (preparados)

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm start          # Inicia servidor de desarrollo
npm run dev        # Alias para npm start

# Construcción
npm run build      # Build para producción
npm run build:dev  # Build para desarrollo

# Linting y formato
npm run lint       # Ejecutar ESLint
npm run format     # Formatear código con Prettier
```

## 🚀 Próximas Características

- [ ] Integración con Auth0
- [ ] Calendario de citas interactivo
- [ ] Sistema de pagos
- [ ] Notificaciones push
- [ ] Modo offline (PWA)
- [ ] Reportes y analytics
- [ ] API REST integration
- [ ] Upload de imágenes
- [ ] Chat en tiempo real

## 📝 Modelos de Datos

### User
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}
```

### Service
```typescript
interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: ServiceCategory;
  image?: string;
  isActive: boolean;
}
```

### Barber
```typescript
interface Barber {
  id: number;
  name: string;
  email: string;
  specialties: string[];
  rating: number;
  experience: number;
  schedule: BarberSchedule[];
  isActive: boolean;
}
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Equipo

Desarrollado con ❤️ para la gestión profesional de barberías.

---

**¿Necesitas ayuda?** Abre un issue en el repositorio o contacta al equipo de desarrollo.
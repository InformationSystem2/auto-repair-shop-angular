# ARS Frontend — Cliente Angular del Sistema de Auxilio Mecánico y Gestión de Talleres

**Sistemas de Información II — Universidad Autónoma Gabriel René Moreno (UAGRM)**

## Entregables

| Recurso | Enlace |
|---|---|
| Documento de Reportes e IA (PDF) | [`docs/ai_reports_implementation.md`](../auto-repair-shop-fastapi/docs/ai_reports_implementation.md) |
| Repositorio público | https://github.com/evert-aov/SI2-ARS-frontend |

---

## Información del Proyecto

Este directorio contiene la aplicación cliente de **ARS (Auto Repair Shop — Sistema de Auxilio Mecánico y Gestión de Talleres)**, desarrollada utilizando **Angular 21** con **Signals** para un control reactivo eficiente y moderna interactividad.

La interfaz de usuario está construida sobre un diseño personalizado estilizado con **Tailwind CSS v4** y cuenta con las siguientes características clave:
* **Asistente de IA por Voz y Texto**: Permite a los administradores generar reportes interactivos dictando comandos de voz mediante el micrófono o escribiendo prompts libres.
* **Mapas y Geolocalización**: Integración interactiva de mapas utilizando **Leaflet** para el seguimiento en tiempo real de vehículos de auxilio y solicitudes de auxilio mecánico.
* **Notificaciones Push en Tiempo Real**: Recepción nativa de notificaciones y alertas integrando **Firebase Cloud Messaging (FCM)**.

---

## Arquitectura de Flujo del Asistente de IA

```
   Usuario (Clic Micrófono) 
          │  
          ▼
   MediaRecorder (Web API) ──► Captura audio local en formato .webm
          │
          ▼
   ReportsService (prompt/audio) ──► Envía FormData por HTTP POST a FastAPI
          │
          ▼
   FastAPI Server ──► Realiza transcripción con Speech-to-Text e interpreta con Gemini
          │
          ▼
   Respuesta JSON ──► Retorna datos del reporte, filtros estructurados y transcripción
          │
          ▼
   ReportBuilderComponent ──► Actualiza reactivamente la tabla y los filtros en pantalla
```

---

## Estructura del Proyecto

```
auto-repair-shop-angular/
├── src/
│   ├── app/
│   │   ├── core/                   # Núcleo de la aplicación
│   │   │   ├── auth/               # Autenticación, JWT, registro de tokens push
│   │   │   ├── interceptors/       # Interceptores HTTP de cabeceras de autorización
│   │   │   ├── models/             # Modelos de datos comunes del sistema
│   │   │   └── services/           # Servicios globales (UI, notificaciones, api)
│   │   │
│   │   ├── features/               # Módulos de negocio (Lazy Loaded)
│   │   │   ├── audit/              # Panel de auditoría de acciones del sistema
│   │   │   ├── dashboard/          # Métricas clave y estadísticas visuales
│   │   │   ├── module_users/       # CRUD de usuarios, roles y perfiles
│   │   │   ├── module_workshops/   # Gestión de talleres, servicios y vehículos
│   │   │   ├── notifications/      # Historial de alertas y notificaciones del usuario
│   │   │   ├── reports/            # Constructor QBE con asistente de voz y texto
│   │   │   └── security/           # Login, recuperar contraseña y seguridad
│   │   │
│   │   ├── layout/                 # Estructura visual base (Sidebar, Navbar, Layout)
│   │   ├── shared/                 # Componentes reutilizables de UI (botones, inputs, modales)
│   │   ├── app.ts                  # Componente raíz
│   │   └── app.routes.ts           # Enrutamiento general y guardias de ruta
│   │
│   ├── assets/                     # Recursos gráficos estáticos
│   ├── environments/               # Entornos de desarrollo y producción
│   └── styles.css                  # Estilos globales integrando Tailwind CSS v4
│
├── angular.json                    # Configuración del CLI de Angular
├── package.json                    # Scripts del proyecto y dependencias
└── README.md
```

---

## Tecnologías

### Frontend & Core
| Tecnología | Versión | Uso |
|---|---|---|
| Angular | 21.2.x | Framework SPA principal con Signals para gestión reactiva |
| Tailwind CSS | 4.1.x | Framework de utilidades CSS para diseño responsive y moderno |
| TypeScript | 5.9.x | Lenguaje de desarrollo principal |
| RxJS | 7.8.x | Manejo de flujos y programación reactiva asíncrona |

### Librerías Especializadas e Integraciones
| Tecnología | Versión | Uso |
|---|---|---|
| Leaflet | 1.9.x | Renderizado interactivo de mapas para auxilio mecánico en carretera |
| Firebase SDK | 12.12.x | Configuración y gestión de notificaciones push del sistema |
| MediaRecorder API | Nativa | Captura de audio de voz directamente del micrófono del usuario |
| Ng Icons | 33.2.x | Set de iconos de Heroicons integrados para la interfaz gráfica |

---

## Instalación y Ejecución

### 1. Requisitos Previos
* Node.js (v18 o superior recomendado)
* Angular CLI instalado de forma global (`npm install -g @angular/cli`)

### 2. Configurar Variables de Entorno
Configure la URL del API del Backend en el archivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api', // URL base de la API de FastAPI
};
```

### 3. Compilar e Iniciar la Aplicación

Instalar las dependencias del proyecto:
```bash
npm install
```

Iniciar el servidor de desarrollo local:
```bash
npm start
```

La aplicación estará disponible en: `http://localhost:4200`

---

## Pantallas Principales

| Ruta / Componente | Flujo | Descripción |
|---|---|---|
| `/login` | Seguridad | Formulario de autenticación y carga de credenciales JWT |
| `/dashboard` | Dashboard | Panel analítico con estadísticas de incidentes, ingresos e indicadores |
| `/reports` | Constructor de Reportes | Generador interactivo de reportes QBE asistido por voz y texto libre |
| `/workshops` | Gestión de Talleres | Control de mecánicos activos, talleres registrados y servicios ofrecidos |
| `/users` | Gestión de Usuarios | Administración de clientes, mecánicos, roles y asignación de permisos |
| `/audit` | Auditoría | Registro detallado de accesos e interacciones de usuarios en el sistema |

---

## Módulo de Seguridad y Políticas de Acceso

### Validación y Autorización JWT
El frontend intercepta cada solicitud saliente a través del `auth.interceptor.ts` inyectando el token JWT guardado en localstorage. Las rutas críticas están protegidas en el cliente mediante `auth.guard.ts`, validando la autenticación del usuario en tiempo de ejecución.

### Asistente de IA: Captura de Voz Local Segura
Para el asistente de voz en reportes, la captura de audio se realiza exclusivamente local en el navegador del usuario utilizando `MediaRecorder`. La aplicación solicita permisos del micrófono al usuario y procesa la pista únicamente en memoria para enviarla en un payload HTTP POST seguro, garantizando la privacidad de los datos de audio.

---

## Por qué control de accesos a nivel de atributos y no de endpoints simple

| Tipo de Control | Permite ocultar campos sensibles | Flexibilidad por Rol | Complejidad de UI |
|---|---|---|---|
| **Control por Endpoint (`/taller/{id}`)** | No (Muestra la pantalla completa o nada) | Baja | Baja |
| **Control a nivel de Atributo (ARS)** | **Sí** (Oculta precios, auditorías, diagnósticos) | **Alta** (Granularidad según rol) | Media (Renderizado condicional) |

---

## Documentación Técnica

- [`docs/ai_reports_implementation.md`](../auto-repair-shop-fastapi/docs/ai_reports_implementation.md) — Análisis arquitectónico de la implementación del generador de reportes por lenguaje natural.

---

## Equipo

| Integrante | Rol |
|---|---|
| **Evert Rodríguez Araúz** | Backend Developer / Arquitecto de Software |
| *[Integrante 2]* | *[Rol]* |
| *[Integrante 3]* | *[Rol]* |

---

*Proyecto desarrollado para la materia de Sistemas de Información II — UAGRM*

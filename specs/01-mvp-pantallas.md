# SPEC 01 — MVP visual: pantallas de Arcade Vault

> **Status:** Aprobado
> **Depends on:** —
> **Date:** 2026-10-19
> **Objective:** Implementar en Next.js las cinco pantallas de `references/templates` (Biblioteca, Detalle, Reproductor, Auth y Salón de la Fama) con datos ficticios en `app/data`, sin ningún juego real.

---

## Por qué existe esta spec

El repo es un scaffold de Create Next App. Las plantillas de `references/templates` son un prototipo en React UMD + Babel con router por hash. Esta spec lo traslada a App Router con rutas reales y tipos TypeScript, y aísla los datos ficticios en `app/data` para sustituirlos por una base de datos en una spec posterior.

`app/globals.css` y `app/layout.tsx` ya están migrados: contienen los estilos de `styles.css`, los tokens de `@theme inline`, las fuentes (`--font-press-start`, `--font-jetbrains`, `--font-courier-prime`) y los nodos `.av-bg`, `.av-noise` y `#root`. Esta spec solo los revisa y completa si falta algo.

---

## Alcance

**Dentro:**

- Rutas App Router: `/` (Biblioteca), `/juegos/[id]` (Detalle), `/juegos/[id]/jugar` (Reproductor), `/auth` y `/salon`.
- Componentes compartidos: `Nav` (con menú móvil), pie de página y `GameCard`.
- Módulo de datos ficticios en `app/data` con tipos TypeScript.
- Sesión falsa: cualquier usuario entra, se guarda en `localStorage`; "Jugar como invitado" y "Cerrar sesión".
- Reproductor simulado: arena CRT decorativa, HUD con puntuación que sube sola, pausa, FIN y modal de fin de juego.
- Guardado de puntuaciones en `localStorage` desde el modal, visibles en el Detalle y en el Salón.
- Búsqueda por nombre y filtro por categoría en la Biblioteca.
- Revisión de `globals.css` y `layout.tsx` para cubrir todas las pantallas.

**Fuera de alcance (para otras specs):**

- Cualquier juego real (lógica, canvas, controles).
- Backend, base de datos y autenticación real (Google/GitHub son botones sin acción).
- Ranking global compartido entre usuarios; las puntuaciones guardadas solo existen en el navegador.
- Tests automatizados (el repo no tiene runner).
- Internacionalización; la interfaz queda solo en español.
- Contador de créditos funcional; "CRÉDITOS · 03" es texto fijo.

---

## Modelo de datos

Nada de esto existe aún en el repo. Todo vive en `app/data`, con tipos que reflejan las entidades de una futura base de datos.

```ts
// app/data/types.ts
export type Category = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";
export type AccentColor = "cyan" | "magenta" | "yellow" | "green";

export interface Game {
  id: string;            // slug, p. ej. "bloque-buster"
  title: string;
  short: string;
  long: string;
  cat: Category;
  cover: string;         // clase CSS, p. ej. "cover-bricks"
  color: AccentColor;
  best: number;          // mejor puntuación global ficticia
  plays: string;         // p. ej. "12.4K"
}

export interface ScoreEntry {
  rank: number;
  name: string;
  score: number;
  date: string;          // "DD/MM/YYYY"
}

export interface SavedScore {
  game: string;          // Game.id
  name: string;          // máx. 10 caracteres, mayúsculas
  score: number;
  at: number;            // Date.now()
}

export interface SessionUser {
  name: string;          // máx. 10 caracteres, mayúsculas
}
```

Archivos de datos:

- `app/data/games.ts`: exporta `GAMES: Game[]` (8 juegos de la plantilla) y `CATEGORIES = ["TODOS", ...]`.
- `app/data/scores.ts`: exporta `PLAYERS` y `seededScores(seed, count)`, portados de `data.jsx`.
- `app/data/index.ts`: reexporta lo anterior. Es el único punto de importación para los componentes.

Persistencia en `localStorage` (claves de la plantilla):

- `av_user`: `SessionUser | null` en JSON.
- `av_scores`: `SavedScore[]` en JSON.

Convenciones:

- Los componentes importan datos solo desde `@/app/data`, nunca los definen en línea. Así el cambio a base de datos toca un único módulo.
- Números formateados con `toLocaleString("es-ES")`.
- Las lecturas de `localStorage` van en `try/catch` y solo se ejecutan en el cliente.

---

## Plan de implementación

1. **Datos y tipos.** Crear `app/data/types.ts`, `games.ts`, `scores.ts` e `index.ts` portando `data.jsx`. Verificación: `npm run lint` y `npx tsc --noEmit` sin errores.
2. **Sesión y puntuaciones en cliente.** Crear un proveedor de sesión (`app/components/SessionProvider.tsx`) con `user`, `login`, `logout`, y utilidades de lectura/escritura de `av_scores` (`app/lib/storage.ts`). Montarlo en `layout.tsx`. Verificación: la app sigue arrancando con `npm run dev`.
3. **Nav y pie.** Crear `app/components/Nav.tsx` (enlaces con estado activo según `usePathname`, contador de créditos, botón de sesión, menú móvil) y `Footer.tsx`. Montarlos en `layout.tsx` dentro de `#root`, con `<main className="av-main">`. Verificación: la nav se ve en `/` y el menú móvil abre y cierra a <840px.
4. **Biblioteca (`/`).** Sustituir `app/page.tsx` por hero, buscador, chips y rejilla de `GameCard` (con efecto tilt). Estado vacío "NO HAY RESULTADOS". Las tarjetas enlazan a `/juegos/[id]`. Verificación: buscar y filtrar cambia la rejilla.
5. **Detalle (`/juegos/[id]`).** Crear `app/juegos/[id]/page.tsx` con portada, etiquetas, descripción, tira de estadísticas, botones y tabla "Mejores puntuaciones". Un `id` inexistente llama a `notFound()`. Verificación: abrir un juego y ver sus datos.
6. **Reproductor (`/juegos/[id]/jugar`).** Crear la página con HUD (jugador, puntuación, vidas, nivel), pantalla CRT con arena decorativa, pausa, FIN, salir y modal de fin de juego con campo de iniciales y botones "Jugar de nuevo" y "Volver al vault". Al guardar, escribir en `av_scores`. Verificación: jugar, terminar y ver el aviso "PUNTUACIÓN GUARDADA".
7. **Integrar puntuaciones guardadas.** Mezclar `av_scores` con las ficticias en la tabla del Detalle y en el Salón, ordenadas por puntuación. Verificación: una puntuación guardada aparece en ambas pantallas tras recargar.
8. **Auth (`/auth`).** Crear la página con pestañas "Iniciar sesión" y "Crear cuenta" (esta añade el campo de correo), "Jugar como invitado" y botones sociales sin acción. Al entrar, guarda `av_user` y redirige a `/`. Verificación: tras entrar, la nav muestra el nombre, y al pulsarlo se cierra la sesión.
9. **Salón de la Fama (`/salon`).** Crear la página con pestañas por juego, podio top 3, tabla con animación escalonada y, con sesión, la fila "Tu mejor marca". Verificación: cambiar de pestaña cambia podio y tabla.
10. **Revisión de estilos.** Comprobar cada pantalla en escritorio y a 720px. Retirar de `globals.css` las clases sin uso (`.tw-*`, `.spinner`, `.divider`, `.slide-in` si no se usa) y la regla `html, body, #root`, si hubiera conflicto con Next. Verificación: `npm run build` y `npm run lint` sin errores.

---

## Criterios de aceptación

- [ ] `npm run build` y `npm run lint` terminan sin errores.
- [ ] Existen las cinco rutas: `/`, `/juegos/[id]`, `/juegos/[id]/jugar`, `/auth` y `/salon`.
- [ ] `/juegos/no-existe` muestra la página 404 de Next.
- [ ] La Biblioteca muestra los 8 juegos de `app/data/games.ts`.
- [ ] Escribir "rana" en el buscador deja solo RANARIA.
- [ ] Seleccionar la categoría SHOOTER deja solo INVASORES y ROCAS.
- [ ] Una búsqueda sin coincidencias muestra "NO HAY RESULTADOS".
- [ ] Pulsar una tarjeta o su botón JUGAR navega a `/juegos/[id]`.
- [ ] El Detalle muestra etiquetas, descripción, partidas, mejor global, dificultad y 10 filas de puntuaciones.
- [ ] "JUGAR AHORA" navega a `/juegos/[id]/jugar` y "VOLVER AL VAULT" a `/`.
- [ ] En el Reproductor la puntuación sube sola; PAUSA la detiene y muestra "EN PAUSA"; REANUDAR la continúa.
- [ ] FIN abre el modal con la puntuación final y un campo de iniciales limitado a 10 caracteres en mayúsculas.
- [ ] Guardar puntuación crea una entrada en `localStorage["av_scores"]` y muestra "PUNTUACIÓN GUARDADA".
- [ ] La puntuación guardada aparece, tras recargar, en la tabla del Detalle de ese juego y en el Salón.
- [ ] "JUGAR DE NUEVO" reinicia puntuación, vidas y nivel y cierra el modal.
- [ ] Enviar el formulario de Auth guarda `localStorage["av_user"]`, redirige a `/` y la nav muestra el nombre en mayúsculas (máx. 10 caracteres).
- [ ] La pestaña "Crear cuenta" muestra el campo de correo y "Iniciar sesión" lo oculta.
- [ ] "Jugar como invitado" redirige a `/` sin guardar `av_user`.
- [ ] Pulsar el nombre de usuario en la nav cierra la sesión y vuelve a mostrar "Iniciar Sesión".
- [ ] El Salón muestra podio y tabla para cada uno de los 8 juegos y la fila "Tu mejor marca" solo con sesión iniciada.
- [ ] A menos de 840px la nav oculta los enlaces y muestra el botón de menú, que abre el panel lateral.
- [ ] El enlace activo de la nav se resalta en `/`, `/juegos/*` y `/salon`.
- [ ] Ningún componente define datos de juegos o puntuaciones en línea; todos importan de `@/app/data`.
- [ ] Con `localStorage` bloqueado, ninguna pantalla lanza errores y la app sigue navegable.

---

## Decisiones

- **Sí:** rutas App Router reales. URLs compartibles y es lo idiomático en Next.js. **No:** replicar el router por hash de la plantilla.
- **Sí:** reutilizar `globals.css` con las clases de la plantilla. Máxima fidelidad visual y menor riesgo. **No:** reescribir en utilidades Tailwind ni usar CSS Modules.
- **Sí:** datos ficticios en `app/data` con tipos de entidad. Deja la migración a base de datos concentrada en un módulo. **No:** definir datos dentro de los componentes.
- **Sí:** sesión falsa en `localStorage`, como la plantilla. Sirve para ver los estados con y sin sesión. **No:** auth real; va en otra spec.
- **Sí:** guardar puntuaciones en `localStorage` (`av_scores`) y mostrarlas en Detalle y Salón. Da un flujo completo de ida y vuelta sin backend. **No:** solo mostrar el aviso de guardado.
- **Sí:** Reproductor como simulación placeholder. Deja el hueco donde se montará cada juego. **No:** pantalla estática "PRÓXIMAMENTE".
- **Sí:** mantener las claves `av_user` y `av_scores` de la plantilla. **No:** versionarlas todavía, porque se sustituirán por la base de datos.
- **Sí:** la interfaz solo en español. **No:** i18n.

---

## Riesgos

| Riesgo                                                                      | Mitigación                                                                                       |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Hidratación: leer `localStorage` en el render provoca diferencias servidor/cliente | Leer en `useEffect` y renderizar el estado "sin sesión" hasta montar.                  |
| Next 16 tiene cambios incompatibles respecto a lo habitual                  | Leer la guía correspondiente en `node_modules/next/dist/docs/` antes de escribir código de Next. |
| `localStorage` bloqueado o con JSON corrupto                                | Envolver lecturas y escrituras en `try/catch` con valores por defecto.                           |
| Los puntos de la simulación del Reproductor cambian el nivel varias veces seguidas | Mantener la lógica de la plantilla solo como placeholder y no darle valor más allá de lo visual. |
| Los selectores de `globals.css` (`#root`, `html, body`) chocan con la estructura de Next | Revisarlos en el paso 10 y ajustarlos al layout real.                              |

---

## Lo que **no** está en esta spec

- Ningún juego real ni su lógica.
- Backend, base de datos y autenticación real.
- Ranking global compartido entre usuarios.
- Tests automatizados.
- Internacionalización.
- Créditos funcionales.

Cada uno, si llega, va en su propia spec.

# SPEC 02 — Home como ruta raíz y Biblioteca en `/games`

> **Status:** Aprobado
> **Depends on:** SPEC 01
> **Date:** 2026-10-19
> **Objective:** Implementar la pantalla Home de `references/templates/home-about` como ruta raíz `/`, mover la Biblioteca a `/games` y renombrar las rutas de juego de `/juegos/[id]` a `/games/[id]`.

---

## Por qué existe esta spec

La SPEC 01 dejó la Biblioteca en `/` y los juegos bajo `/juegos/[id]`. La plantilla `home-about` define una landing (hero, "¿Por qué Arcade Vault?", juegos, estadísticas, actividad en vivo, precios y CTA final) que debe ser la entrada del sitio. Eso libera `/` y obliga a reubicar la Biblioteca. De paso se unifica el patrón de URLs de juego como `/games/[nombre-juego]`.

---

## Alcance

**Dentro:**

- Nueva ruta `/` con la Home de la plantilla (`home.jsx`): hero con siluetas flotantes, "¿Por qué Arcade Vault?", juegos disponibles (6 mini-cards), estadísticas, actividad en vivo (últimas puntuaciones y top jugadores), precios con FAQ y CTA final.
- Biblioteca movida a `/games`.
- Renombrar `app/juegos/[id]` a `app/games/[id]` y `app/juegos/[id]/jugar` a `app/games/[id]/jugar`. Desaparece `/juegos`.
- Actualizar todos los enlaces internos a las nuevas rutas.
- Migrar a `app/globals.css` los estilos de la Home que falten (secciones `HOME PAGE`, `ACTIVITY` y `PRICING` de `styles.css`, más las variantes de tema que la Home use).
- Enlace "Inicio" en la nav y la nav móvil, con estado activo solo en `/`.
- Enlace "Acerca de" en la nav y la nav móvil apuntando a `/about`.
- Animación de aparición al hacer scroll (`.reveal` + `IntersectionObserver`).

**Fuera de alcance (para otras specs):**

- La página `/about`: no se crea ni su componente ni sus estilos (`ABOUT PAGE` de `styles.css`). El enlace "Acerca de" da 404 hasta esa spec.
- Datos reales de actividad, estadísticas o ranking; todo es ficticio.
- Backend, base de datos y autenticación real.
- Funcionalidad de la sección de precios más allá de enlazar a `/auth`.
- Variantes de tema (`Theme variants`) no usadas por la Home.
- Tests automatizados (el repo no tiene runner).

---

## Modelo de datos

Esta spec no introduce estructuras de datos nuevas. Reutiliza `GAMES` de `@/app/data` para los mini-cards. Los arrays de características, estadísticas, últimas puntuaciones, top jugadores y preguntas frecuentes se mantienen en línea dentro del componente de la Home, tal como en la plantilla (ver Decisiones).

Mapa de rutas resultante:

| Ruta                    | Pantalla      | Antes                 |
| ----------------------- | ------------- | --------------------- |
| `/`                     | Home          | Biblioteca            |
| `/games`                | Biblioteca    | `/`                   |
| `/games/[id]`           | Detalle       | `/juegos/[id]`        |
| `/games/[id]/jugar`     | Reproductor   | `/juegos/[id]/jugar`  |
| `/auth`, `/salon`       | sin cambios   | sin cambios           |
| `/about`                | no existe aún | —                     |

---

## Plan de implementación

1. **Renombrar rutas de juego.** Mover `app/juegos/` a `app/games/` y actualizar los tipos `PageProps<"/games/[id]">` y `PageProps<"/games/[id]/jugar">`. Actualizar los enlaces en `GameCard.tsx`, `GamePlayer.tsx` y `app/games/[id]/page.tsx`. Verificación: `npm run build` y abrir `/games/bloque-buster` y `/games/bloque-buster/jugar`.
2. **Mover la Biblioteca a `/games`.** Crear `app/games/page.tsx` con el contenido actual de `app/page.tsx`. Mientras tanto, `app/page.tsx` redirige a `/games` para no dejar `/` roto. Actualizar los enlaces "VOLVER AL VAULT" (Detalle y Reproductor) y el redirect de Auth a `/games`. Verificación: `/games` muestra los 8 juegos y los botones de volver llevan a `/games`.
3. **Actualizar la nav.** En `Nav.tsx`: añadir "Inicio" (`/`, activo solo en `/`), "Biblioteca" pasa a `/games` (activa en `/games*`), "Salón de la Fama" sin cambios, y añadir "Acerca de" (`/about`). Aplicar lo mismo al panel móvil. El logo enlaza a `/`. Verificación: los enlaces y estados activos son correctos en escritorio y a <840px.
4. **Estilos de la Home.** Copiar a `app/globals.css` las secciones `HOME PAGE`, `ACTIVITY` y `PRICING` de `styles.css`, y las clases que la Home use de `Theme variants`, sin duplicar reglas ya presentes. Verificación: `npm run build` sin errores y sin cambios visuales en las pantallas existentes.
5. **Home estática.** Reemplazar `app/page.tsx` por la Home (`app/components/Home.tsx`): hero con `FloatingSilhouettes`, secciones "¿Por qué?", estadísticas, actividad, precios y CTA final, con los datos en línea como la plantilla. Los CTA enlazan así: "EXPLORAR JUEGOS", "VER TODOS LOS JUEGOS" e "INSERTAR MONEDA" a `/games`; "CREAR CUENTA" y "EMPEZAR GRATIS" a `/auth`; "VER SALÓN" a `/salon`. Verificación: `/` renderiza todas las secciones.
6. **Juegos disponibles.** Añadir `MiniCard` con los 6 primeros de `GAMES`, que enlazan a `/games/[id]`. Verificación: pulsar un mini-card abre el Detalle de ese juego.
7. **Animación `.reveal`.** Añadir el hook `useReveal` (`IntersectionObserver`) como componente cliente para que las secciones aparezcan al hacer scroll. Debe mostrar el contenido si `IntersectionObserver` no existe. Verificación: las secciones se revelan al bajar y no quedan ocultas al recargar a mitad de página.
8. **Revisión final.** Buscar restos de `/juegos` en el repo y ajustar la regla de ancho/espaciado de `#root` si la Home lo exige. Verificación: `npm run build` y `npm run lint` sin errores.

---

## Criterios de aceptación

- [ ] `npm run build` y `npm run lint` terminan sin errores.
- [ ] `/` muestra la Home con hero, "¿Por qué Arcade Vault?", juegos disponibles, estadísticas, actividad en vivo, precios y CTA final.
- [ ] `/games` muestra la Biblioteca con los 8 juegos, buscador y filtros de SPEC 01.
- [ ] `/games/bloque-buster` muestra el Detalle y `/games/bloque-buster/jugar` el Reproductor.
- [ ] `/juegos` y `/juegos/bloque-buster` devuelven 404.
- [ ] `/games/no-existe` muestra la página 404 de Next.
- [ ] No queda ninguna referencia a `/juegos` en `app/`.
- [ ] "EXPLORAR JUEGOS", "VER TODOS LOS JUEGOS" e "INSERTAR MONEDA" navegan a `/games`.
- [ ] "CREAR CUENTA" y "EMPEZAR GRATIS" navegan a `/auth`.
- [ ] "VER SALÓN →" navega a `/salon`.
- [ ] La sección de juegos de la Home muestra 6 mini-cards y cada uno navega a `/games/[id]`.
- [ ] "VOLVER AL VAULT" (Detalle y Reproductor) y el redirect tras iniciar sesión o entrar como invitado llevan a `/games`.
- [ ] La nav muestra Inicio, Biblioteca, Salón de la Fama y Acerca de, en escritorio y en el panel móvil (<840px).
- [ ] "Inicio" solo se resalta en `/`; "Biblioteca" se resalta en `/games` y `/games/*`.
- [ ] El logo navega a `/`.
- [ ] "Acerca de" enlaza a `/about` (404 aceptado hasta su spec).
- [ ] Las secciones con `.reveal` se hacen visibles al entrar en el viewport.
- [ ] Ningún estilo de `ABOUT PAGE` se añade a `globals.css`.
- [ ] Las pantallas de SPEC 01 (`/auth`, `/salon`) siguen funcionando sin cambios visuales.

---

## Decisiones

- **Sí:** renombrar a `/games/[id]` y `/games/[id]/jugar`. Un solo patrón de URL en inglés, como pidió el usuario. **No:** mantener `/juegos` por compatibilidad; el proyecto no está publicado, no hay enlaces externos que proteger.
- **Sí:** segmento `jugar` sin cambios. Mínimo cambio sobre SPEC 01. **No:** `/play`.
- **Sí:** Home en `/` y Biblioteca en `/games`. **No:** dejar la Biblioteca en `/`.
- **Sí:** enlace "Acerca de" a `/about` aunque dé 404 por ahora. Decisión del usuario; la spec de About lo completará. **No:** omitirlo ni deshabilitarlo.
- **Sí:** datos de actividad, estadísticas, precios y FAQ en línea dentro de la Home, como en la plantilla. Decisión del usuario, por ser contenido de marketing sin entidad de base de datos asociada. **No:** moverlos a `app/data` ahora. Esto rompe la convención de SPEC 01 ("los componentes no definen datos en línea") solo para estos bloques; los mini-cards sí usan `GAMES`.
- **Sí:** tras iniciar sesión o entrar como invitado se redirige a `/games`, que es donde estaba antes (la Biblioteca). **No:** redirigir a `/`.
- **Sí:** copiar solo los estilos de la Home a `globals.css`. **No:** copiar `ABOUT PAGE`, para no arrastrar código sin uso.
- **Sí:** reutilizar clases de la plantilla en `globals.css`, igual que SPEC 01. **No:** reescribir en utilidades Tailwind.

---

## Riesgos

| Riesgo                                                                            | Mitigación                                                                                   |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Quedan enlaces a `/juegos` o a `/` como Biblioteca tras el renombrado             | Paso 8: búsqueda global y criterio de aceptación explícito.                                  |
| Secciones `.reveal` invisibles si el observer falla o JS tarda                    | Mostrar el contenido si no hay `IntersectionObserver`; revisar con recarga a mitad de página. |
| Next 16 tiene cambios incompatibles respecto a lo habitual (rutas tipadas, Link)  | Leer la guía correspondiente en `node_modules/next/dist/docs/` antes de escribir código.      |
| Reglas CSS de la Home duplican o pisan las de otras pantallas en `globals.css`    | Copiar solo las secciones necesarias y comprobar `/games`, `/auth` y `/salon` tras el paso 4. |
| El enlace a `/about` da 404 durante un tiempo                                     | Aceptado por el usuario; se resuelve con la spec de About.                                   |

---

## Lo que **no** está en esta spec

- La página `/about` y sus estilos.
- Datos reales de actividad, estadísticas y ranking.
- Backend, base de datos y autenticación real.
- Cualquier juego real.
- Tests automatizados.

Cada uno, si llega, va en su propia spec.

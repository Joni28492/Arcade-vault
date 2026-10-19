"use client";

import { useEffect } from "react";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          // Las secciones ya superadas (recarga a mitad de página) también se muestran
          if (e.isIntersecting || e.boundingClientRect.bottom < 0) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export function Reveal() {
  useReveal();
  return null;
}

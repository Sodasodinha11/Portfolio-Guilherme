"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ProjectMotion() {
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.to(".ambient-shape--orchid", { x: 72, y: -48, rotation: 13, scale: 1.05, duration: 8.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".ambient-shape--cobalt", { x: -58, y: 62, rotation: -15, scale: 1.07, duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".ambient-shape--violet", { x: 48, y: 58, rotation: 11, scale: 1.04, duration: 11.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".ambient-shape--paper", { x: -42, y: -52, rotation: -10, scale: 1.08, duration: 9, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".ambient-background", {
        yPercent: 4,
        xPercent: -1,
        ease: "none",
        scrollTrigger: { trigger: ".project-page", start: "top top", end: "bottom bottom", scrub: 1.2 },
      });

      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
      intro
        .from(".project-nav", { y: -12, opacity: 0, duration: .34 })
        .from(".project-intro .kicker", { y: 12, opacity: 0, duration: .32 }, "-=.18")
        .from(".project-intro h1", {
          x: 28,
          yPercent: 32,
          opacity: 0,
          rotationX: -12,
          filter: "blur(10px)",
          transformPerspective: 850,
          duration: .72,
          clearProps: "filter,transform,opacity",
        }, "-=.24")
        .from(".project-facts p", { y: 16, opacity: 0, duration: .4, stagger: .06 }, "-=.34");

      gsap.utils.toArray<HTMLElement>(".project-media:not(.project-media--case) figure").forEach((figure) => {
        gsap.from(figure, {
          y: 54,
          opacity: .35,
          scale: .975,
          clipPath: "inset(0 0 12% 0)",
          filter: "blur(8px)",
          duration: .86,
          ease: "power4.out",
          clearProps: "filter,transform,opacity,clipPath",
          scrollTrigger: { trigger: figure, start: "top 88%" },
        });
      });

      gsap.from(".next-project strong", {
        x: -28,
        opacity: 0,
        stagger: .08,
        duration: .58,
        ease: "power3.out",
        scrollTrigger: { trigger: ".next-project", start: "top 82%" },
      });
    });
    return () => context.revert();
  }, []);

  return null;
}

/** Play the silent logo animation only while it is visible. */
export function NatureLogoMotion() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    let active = true;

    const configure = () => {
      observer?.disconnect();
      video.pause();
      video.controls = preference.matches;
      if (preference.matches) return;
      const play = () => {
        video.play().catch(() => {
          if (active) video.controls = true;
        });
      };
      if (!("IntersectionObserver" in window)) {
        play();
        return;
      }
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) play();
        else video.pause();
      }, { threshold: 0.15 });
      observer.observe(video);
    };
    configure();
    preference.addEventListener("change", configure);
    return () => {
      active = false;
      observer?.disconnect();
      preference.removeEventListener("change", configure);
      video.pause();
    };
  }, []);

  return (
    <figure>
      <video
        ref={videoRef}
        src="/artworks/nature/nature-motion.mp4"
        aria-label="Motion da identidade visual Nature: construção animada da assinatura da marca"
        width={3840}
        height={2160}
        style={{ aspectRatio: "16 / 9", backgroundColor: "#164921" }}
        muted
        loop
        playsInline
        preload="none"
      />
    </figure>
  );
}

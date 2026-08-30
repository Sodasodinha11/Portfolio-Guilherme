"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { projects } from "./project-data";

function circularDistance(index: number, active: number) {
  const length = projects.length;
  let distance = index - active;
  if (distance > length / 2) distance -= length;
  if (distance < -length / 2) distance += length;
  return distance;
}

type HorizontalLoopTimeline = gsap.core.Timeline & {
  next: (vars?: gsap.TweenVars) => gsap.core.Tween;
  previous: (vars?: gsap.TweenVars) => gsap.core.Tween;
  toIndex: (index: number, vars?: gsap.TweenVars) => gsap.core.Tween;
  current: () => number;
  closestIndex: (setCurrent?: boolean) => number;
  times: number[];
  draggable?: Draggable;
  cleanup: () => void;
};

type HorizontalLoopConfig = {
  repeat?: number;
  paused?: boolean;
  speed?: number;
  paddingRight?: number;
  center?: HTMLElement | boolean;
  draggable?: boolean;
  onChange?: (element: HTMLElement, index: number) => void;
  onPress?: () => void;
  onDragStart?: () => void;
  onRelease?: () => void;
};

// Adapted from GreenSock's official responsive horizontalLoop helper.
function horizontalLoop(items: HTMLElement[], config: HorizontalLoopConfig = {}) {
  const length = items.length;
  const times: number[] = [];
  const widths: number[] = [];
  const spaces: number[] = [];
  const xPercents: number[] = [];
  const startX = items[0].offsetLeft;
  const pixelsPerSecond = (config.speed || 1) * 100;
  const snap = gsap.utils.snap(1);
  const center = config.center;
  const container = center === true
    ? items[0].parentElement!
    : center instanceof HTMLElement
      ? center
      : items[0].parentElement!;
  let totalWidth = 0;
  let timeWrap = gsap.utils.wrap(0, 1);
  let currentIndex = 0;
  let lastIndex = 0;
  let indexIsDirty = false;
  let proxy: HTMLDivElement | undefined;

  const timeline = gsap.timeline({
    repeat: config.repeat,
    paused: config.paused,
    defaults: { ease: "none" },
    onReverseComplete: () => timeline.totalTime(timeline.rawTime() + timeline.duration() * 100),
  }) as HorizontalLoopTimeline;

  const readNumber = (value: unknown) => Number.parseFloat(String(value)) || 0;
  const getScaleX = (item: HTMLElement) => readNumber(gsap.getProperty(item, "scaleX")) || 1;
  const getTotalWidth = () => (
    items[length - 1].offsetLeft
    + (xPercents[length - 1] / 100) * widths[length - 1]
    - startX
    + spaces[0]
    + items[length - 1].offsetWidth * getScaleX(items[length - 1])
    + (config.paddingRight || 0)
  );

  const populateWidths = () => {
    let previousRect = container.getBoundingClientRect();
    items.forEach((item, index) => {
      widths[index] = readNumber(gsap.getProperty(item, "width", "px"));
      xPercents[index] = snap((readNumber(gsap.getProperty(item, "x", "px")) / widths[index]) * 100 + readNumber(gsap.getProperty(item, "xPercent")));
      const rect = item.getBoundingClientRect();
      spaces[index] = rect.left - (index ? previousRect.right : previousRect.left);
      previousRect = rect;
    });
    gsap.set(items, { xPercent: (index: number) => xPercents[index] });
    totalWidth = getTotalWidth();
  };

  const populateTimeline = () => {
    timeline.clear();
    items.forEach((item, index) => {
      const currentX = (xPercents[index] / 100) * widths[index];
      const distanceToStart = item.offsetLeft + currentX - startX + spaces[0];
      const distanceToLoop = distanceToStart + widths[index] * getScaleX(item);
      timeline
        .to(item, {
          xPercent: snap(((currentX - distanceToLoop) / widths[index]) * 100),
          duration: distanceToLoop / pixelsPerSecond,
        }, 0)
        .fromTo(item, {
          xPercent: snap(((currentX - distanceToLoop + totalWidth) / widths[index]) * 100),
        }, {
          xPercent: xPercents[index],
          duration: (currentX - distanceToLoop + totalWidth - currentX) / pixelsPerSecond,
          immediateRender: false,
        }, distanceToLoop / pixelsPerSecond)
        .add(`label${index}`, distanceToStart / pixelsPerSecond);
      times[index] = distanceToStart / pixelsPerSecond;
    });
    timeWrap = gsap.utils.wrap(0, timeline.duration());
  };

  const populateOffsets = () => {
    if (!center) return;
    const offset = timeline.duration() * (container.offsetWidth / 2) / totalWidth;
    times.forEach((_, index) => {
      times[index] = timeWrap(
        Number(timeline.labels[`label${index}`])
        + timeline.duration() * widths[index] / 2 / totalWidth
        - offset,
      );
    });
  };

  const closestIndex = (values: number[], value: number, wrap: number) => {
    let closest = Number.POSITIVE_INFINITY;
    let closestItem = 0;
    values.forEach((candidate, index) => {
      let distance = Math.abs(candidate - value);
      if (distance > wrap / 2) distance = wrap - distance;
      if (distance < closest) {
        closest = distance;
        closestItem = index;
      }
    });
    return closestItem;
  };

  const refresh = (rebuildTimeline = false) => {
    const progress = timeline.progress();
    timeline.progress(0, true);
    populateWidths();
    if (rebuildTimeline) populateTimeline();
    populateOffsets();
    if (rebuildTimeline && config.draggable && timeline.paused()) timeline.time(times[currentIndex], false);
    else timeline.progress(progress, false);
  };

  gsap.set(items, { x: 0 });
  populateWidths();
  populateTimeline();
  populateOffsets();

  const toIndex = (requestedIndex: number, vars: gsap.TweenVars = {}) => {
    let index = requestedIndex;
    if (Math.abs(index - currentIndex) > length / 2) index += index > currentIndex ? -length : length;
    const newIndex = gsap.utils.wrap(0, length, index);
    let time = times[newIndex];
    if ((time > timeline.time()) !== (index > currentIndex) && index !== currentIndex) {
      time += timeline.duration() * (index > currentIndex ? 1 : -1);
    }
    if (time < 0 || time > timeline.duration()) vars.modifiers = { time: timeWrap };
    currentIndex = newIndex;
    indexIsDirty = false;
    vars.overwrite = true;
    if (proxy) gsap.killTweensOf(proxy);
    if (vars.duration === 0) {
      timeline.time(timeWrap(time), false);
      return gsap.to({}, { duration: 0 });
    }
    return timeline.tweenTo(time, vars);
  };

  timeline.toIndex = toIndex;
  timeline.closestIndex = (setCurrent = false) => {
    const index = closestIndex(times, timeline.time(), timeline.duration());
    if (setCurrent) {
      currentIndex = index;
      indexIsDirty = false;
    }
    return index;
  };
  timeline.current = () => indexIsDirty ? timeline.closestIndex(true) : currentIndex;
  timeline.next = (vars = {}) => toIndex(timeline.current() + 1, vars);
  timeline.previous = (vars = {}) => toIndex(timeline.current() - 1, vars);
  timeline.times = times;
  timeline.progress(1, true).progress(0, true);
  timeline.eventCallback("onUpdate", () => {
    if (!config.onChange) return;
    const index = timeline.closestIndex();
    if (lastIndex !== index) {
      lastIndex = index;
      config.onChange(items[index], index);
    }
  });
  let draggable: Draggable | undefined;
  if (config.draggable) {
    proxy = document.createElement("div");
    const wrapProgress = gsap.utils.wrap(0, 1);
    let ratio = 1 / totalWidth;
    let startProgress = timeline.progress();
    let lastSnap = 0;
    const align = () => timeline.progress(wrapProgress(startProgress + (draggable!.startX - draggable!.x) * ratio));
    const syncIndex = () => timeline.closestIndex(true);

    draggable = Draggable.create(proxy, {
      trigger: container,
      type: "x",
      inertia: true,
      dragClickables: true,
      overshootTolerance: 0,
      throwResistance: 1800,
      maxDuration: 0.75,
      onPressInit() {
        config.onPress?.();
        gsap.killTweensOf(timeline);
        timeline.pause();
        startProgress = timeline.progress();
        refresh(false);
        ratio = 1 / totalWidth;
        gsap.set(proxy, { x: startProgress / -ratio });
      },
      onDragStart() {
        config.onDragStart?.();
      },
      onDrag: align,
      onThrowUpdate: align,
      snap(value: number) {
        const time = -(value * ratio) * timeline.duration();
        const wrappedTime = timeWrap(time);
        const snapTime = times[closestIndex(times, wrappedTime, timeline.duration())];
        let difference = snapTime - wrappedTime;
        if (Math.abs(difference) > timeline.duration() / 2) {
          difference += difference < 0 ? timeline.duration() : -timeline.duration();
        }
        lastSnap = (time + difference) / timeline.duration() / -ratio;
        return lastSnap;
      },
      onRelease() {
        syncIndex();
        if (draggable?.isThrowing) indexIsDirty = true;
        else config.onRelease?.();
      },
      onThrowComplete() {
        syncIndex();
        config.onRelease?.();
      },
    })[0];
    timeline.draggable = draggable;
  }
  timeline.cleanup = () => {
    window.removeEventListener("resize", handleResize);
    draggable?.kill();
    timeline.kill();
    gsap.set(items, { clearProps: "x,xPercent" });
  };
  const handleResize = () => refresh(!(draggable?.isDragging));
  window.addEventListener("resize", handleResize);
  timeline.closestIndex(true);
  lastIndex = currentIndex;
  config.onChange?.(items[currentIndex], currentIndex);
  return timeline;
}

const introProjectSlugs = ["yamal", "tobi-uchiha", "ecco2k"];
const introProjects = introProjectSlugs
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is (typeof projects)[number] => Boolean(project));

function KineticLine({ text }: { text: string }) {
  return (
    <span className="kinetic-word" aria-hidden="true">
      {[...text].map((letter, index) => (
        <span className="kinetic-letter" key={`${letter}-${index}`}>{letter}</span>
      ))}
    </span>
  );
}

export function PortfolioShowcase() {
  const [active, setActive] = useState(0);
  const mainRef = useRef<HTMLElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const projectIndexRef = useRef<HTMLElement>(null);
  const loopRef = useRef<HorizontalLoopTimeline | null>(null);
  const loopTween = useRef<gsap.core.Tween | null>(null);
  const wheelGestureActive = useRef(false);
  const wheelGestureTimer = useRef<number | null>(null);
  const wheelDelta = useRef(0);
  const didSwipe = useRef(false);

  const pulseGallery = useCallback((direction: number) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const motions = wheelRef.current?.querySelectorAll<HTMLElement>(".poster-motion");
    if (!motions?.length) return;
    gsap.killTweensOf(motions);
    gsap.fromTo(motions, {
      xPercent: direction * 0.9,
      filter: "blur(1.4px)",
    }, {
      xPercent: 0,
      filter: "blur(0px)",
      duration: 0.68,
      ease: "power3.out",
      stagger: 0.012,
      overwrite: "auto",
      clearProps: "filter,transform",
    });
  }, []);

  const move = useCallback((direction: number) => {
    const loop = loopRef.current;
    if (!loop) {
      setActive((current) => (current + direction + projects.length) % projects.length);
      return;
    }
    loopTween.current?.kill();
    pulseGallery(direction);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    loopTween.current = direction > 0
      ? loop.next({ duration: reduced ? 0 : 0.82, ease: "power3.out" })
      : loop.previous({ duration: reduced ? 0 : 0.82, ease: "power3.out" });
  }, [pulseGallery]);

  const selectProject = useCallback((index: number) => {
    const loop = loopRef.current;
    if (!loop) {
      setActive(index);
      return;
    }
    loopTween.current?.kill();
    const direction = circularDistance(index, active) >= 0 ? 1 : -1;
    pulseGallery(direction);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    loopTween.current = loop.toIndex(index, { duration: reduced ? 0 : 0.92, ease: "power3.inOut" });
  }, [active, pulseGallery]);

  useEffect(() => {
    const strip = projectIndexRef.current;
    if (!strip || !window.matchMedia("(max-width: 760px)").matches) return;

    const row = strip.querySelector<HTMLElement>(".project-index-row.is-active");
    if (!row) return;

    const stripRect = strip.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const centeredLeft = strip.scrollLeft
      + rowRect.left
      - stripRect.left
      - (strip.clientWidth - rowRect.width) / 2;
    const maxLeft = Math.max(0, strip.scrollWidth - strip.clientWidth);

    strip.scrollTo({
      left: Math.min(maxLeft, Math.max(0, centeredLeft)),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [active]);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(".intro-motion", { display: "none" });
      return;
    }

    gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin);
    document.body.style.overflow = "hidden";

    const releasePage = () => {
      document.body.style.overflow = "";
    };

    const context = gsap.context(() => {
      gsap.to(".ambient-shape--orchid", { x: 82, y: -58, rotation: 14, scale: 1.06, duration: 7.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".ambient-shape--cobalt", { x: -66, y: 70, rotation: -17, scale: 1.08, duration: 9, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".ambient-shape--violet", { x: 58, y: 72, rotation: 12, scale: 1.05, duration: 10.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".ambient-shape--paper", { x: -50, y: -62, rotation: -11, scale: 1.1, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".ambient-background", {
        xPercent: -1.2,
        yPercent: 3,
        ease: "none",
        scrollTrigger: { trigger: mainRef.current, start: "top top", end: "bottom bottom", scrub: 1.2 },
      });

      const progress = { value: 0 };
      const progressNumber = mainRef.current?.querySelector<HTMLElement>(".intro-progress-number");
      const intro = gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: releasePage,
      });

      intro
        .from(".intro-progress-number", {
          yPercent: 30,
          opacity: 0,
          filter: "blur(10px)",
          duration: 0.34,
        }, 0)
        .from(".intro-progress-track", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.82,
          ease: "power2.inOut",
        }, 0)
        .to(progress, {
          value: 100,
          duration: 0.82,
          ease: "power2.inOut",
          onUpdate: () => {
            if (progressNumber) progressNumber.textContent = `${Math.round(progress.value)}%`;
          },
        }, 0)
        .to(".intro-progress", {
          yPercent: -18,
          opacity: 0,
          filter: "blur(12px)",
          duration: 0.34,
          ease: "power3.in",
        }, 0.78)
        .set(".intro-layout, .intro-topline", { autoAlpha: 1 }, 0.88)
        .from(".intro-shape", {
          opacity: 0,
          rotation: -8,
          scale: 0.72,
          duration: 0.58,
          stagger: 0.035,
        }, 0.84)
        .to(".intro-shape--orchid", { x: 24, y: -18, rotation: 8, duration: 1.18, ease: "sine.inOut" }, 0.84)
        .to(".intro-shape--cobalt", { x: -20, y: 22, rotation: -7, duration: 1.18, ease: "sine.inOut" }, 0.84)
        .from(".intro-topline > *, .intro-copy > p", {
          y: 12,
          opacity: 0,
          duration: 0.32,
          stagger: 0.03,
        }, 0.9)
        .from(".intro-poster-card", {
          yPercent: 108,
          clipPath: "inset(100% 0 0 0)",
          rotation: 2.4,
          duration: 0.72,
          stagger: 0.06,
        }, 0.92)
        .from(".intro-title .kinetic-letter", {
          x: 22,
          yPercent: 70,
          opacity: 0,
          rotationX: -65,
          filter: "blur(9px)",
          transformPerspective: 700,
          duration: 0.58,
          stagger: 0.018,
        }, 0.94)
        .to(".intro-poster-card img", { filter: "grayscale(0)", duration: 0.34, stagger: 0.04 }, 1.4)
        .to(".intro-motion", { clipPath: "inset(0 0 100% 0)", duration: 0.62, ease: "power4.inOut" }, 1.96)
        .set(".intro-motion", { display: "none" })
        .call(releasePage)
        .from(".topbar", { y: -14, opacity: 0, duration: 0.42 }, "-=.42")
        .from(".hero .section-label, .hero .kicker", { y: 14, opacity: 0, duration: 0.38, stagger: 0.04 }, "-=.3")
        .from(".hero .kinetic-letter", {
          x: 18,
          yPercent: 48,
          opacity: 0,
          rotationX: -52,
          filter: "blur(8px)",
          transformPerspective: 720,
          duration: 0.64,
          stagger: 0.014,
          clearProps: "filter,transform,opacity",
        }, "-=.28")
        .from(".statement, .hero-actions, .hero-availability", { y: 18, opacity: 0, duration: 0.48, stagger: 0.05 }, "-=.48")
        .from(".portrait-stage", { y: 20, opacity: 0, scale: 0.92, rotation: -4, duration: 0.7 }, "-=.64")
        .from(".portrait-caption", { opacity: 0, y: 10, duration: 0.34 }, "-=.28");

      gsap.from(".work-intro > .section-label, .work-title-row > p", {
        y: 54,
        opacity: 0,
        stagger: 0.07,
        duration: 0.82,
        ease: "power3.out",
        scrollTrigger: { trigger: ".work-section", start: "top 76%" },
      });

      gsap.from(".about-copy > p, .about-copy li, .about-aside > *", {
        y: 58,
        opacity: 0,
        stagger: 0.1,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: { trigger: ".about-section", start: "top 75%" },
      });

      gsap.utils.toArray<HTMLElement>(".work-title-row .couture-face, .about-copy .couture-face, .footer-heading .couture-face").forEach((title) => {
        gsap.from(title, {
          y: 46,
          rotationX: -10,
          opacity: 0,
          filter: "blur(9px)",
          transformPerspective: 800,
          duration: 0.92,
          ease: "power4.out",
          clearProps: "filter,transform,opacity",
          scrollTrigger: { trigger: title, start: "top 88%" },
        });
      });

      gsap.from(".footer-note", {
        y: 34,
        opacity: 0,
        duration: 0.68,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: "#contato", start: "top 72%" },
      });

      gsap.to(".hero-copy", {
        yPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.1 },
      });
      gsap.to(".portrait-wrap", {
        yPercent: 10,
        rotation: 1.2,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.1 },
      });

    }, mainRef);

    return () => {
      releasePage();
      context.revert();
    };
  }, []);

  useEffect(() => {
    const hero = mainRef.current?.querySelector<HTMLElement>(".hero");
    const titleLines = hero?.querySelectorAll<HTMLElement>(".title-line > span");
    const portraitImage = hero?.querySelector<HTMLElement>(".portrait-frame img");
    const portraitStage = hero?.querySelector<HTMLElement>(".portrait-stage");
    if (!hero || !titleLines?.length || window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;

    const firstX = gsap.quickTo(titleLines[0], "x", { duration: 0.7, ease: "power3.out" });
    const secondX = gsap.quickTo(titleLines[1], "x", { duration: 0.7, ease: "power3.out" });
    const portraitX = portraitImage ? gsap.quickTo(portraitImage, "xPercent", { duration: 1, ease: "power3.out" }) : null;
    const portraitY = portraitImage ? gsap.quickTo(portraitImage, "yPercent", { duration: 1, ease: "power3.out" }) : null;
    const portraitRotation = portraitStage ? gsap.quickTo(portraitStage, "rotation", { duration: 0.8, ease: "power3.out" }) : null;
    const portraitLift = portraitStage ? gsap.quickTo(portraitStage, "y", { duration: 0.8, ease: "power3.out" }) : null;

    const onPointerMove = (event: PointerEvent) => {
      if (Array.from(titleLines).some((line) => gsap.isTweening(line))) return;
      const rect = hero.getBoundingClientRect();
      const position = ((event.clientX - rect.left) / rect.width) - 0.5;
      const vertical = ((event.clientY - rect.top) / rect.height) - 0.5;
      firstX(position * 8);
      secondX(position * -6);
      portraitX?.(position * -2.2);
      portraitY?.(vertical * -1.8);
      portraitRotation?.(position * 1.6);
      portraitLift?.(vertical * -4);
    };
    const onPointerLeave = () => {
      firstX(0);
      secondX(0);
      portraitX?.(0);
      portraitY?.(0);
      portraitRotation?.(0);
      portraitLift?.(0);
    };

    hero.addEventListener("pointermove", onPointerMove);
    hero.addEventListener("pointerleave", onPointerLeave);
    return () => {
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  useLayoutEffect(() => {
    const wheel = wheelRef.current;
    const track = wheel?.querySelector<HTMLElement>(".wheel-track");
    const cards = track ? Array.from(track.querySelectorAll<HTMLElement>(".wheel-card")) : [];
    if (!wheel || !track || !cards.length) return;

    const gap = Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 24;
    const loop = horizontalLoop(cards, {
      paused: true,
      repeat: -1,
      speed: 1,
      paddingRight: gap,
      center: wheel,
      draggable: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      onPress: () => { didSwipe.current = false; },
      onDragStart: () => { didSwipe.current = true; pulseGallery(1); },
      onRelease: () => { window.setTimeout(() => { didSwipe.current = false; }, 140); },
      onChange: (_, index) => setActive(index),
    });
    loopRef.current = loop;
    const initialFrame = window.requestAnimationFrame(() => {
      loop.toIndex(0, { duration: 0 });
    });

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rawDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const deltaScale = event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? 24
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? wheel.clientHeight
          : 1;
      wheelDelta.current += rawDelta * deltaScale;
      if (wheelGestureActive.current || Math.abs(wheelDelta.current) < 28) return;

      const direction = wheelDelta.current > 0 ? 1 : -1;
      wheelDelta.current = 0;
      wheelGestureActive.current = true;
      move(direction);
      wheelGestureTimer.current = window.setTimeout(() => {
        wheelGestureActive.current = false;
        wheelGestureTimer.current = null;
        wheelDelta.current = 0;
      }, 440);
    };

    wheel.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      wheel.removeEventListener("wheel", onWheel);
      window.cancelAnimationFrame(initialFrame);
      if (wheelGestureTimer.current) window.clearTimeout(wheelGestureTimer.current);
      wheelGestureActive.current = false;
      wheelDelta.current = 0;
      loopTween.current?.kill();
      loop.cleanup();
      loopRef.current = null;
    };
  }, [move, pulseGallery]);

  useEffect(() => {
    const wheel = wheelRef.current;
    const activeShell = wheel?.querySelector<HTMLElement>(".wheel-card.is-active .poster-shell");
    const activeTilt = activeShell?.querySelector<HTMLElement>(".poster-tilt");
    if (!wheel || !activeShell || !activeTilt || window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;

    const tiltX = gsap.quickTo(activeTilt, "rotationX", { duration: 0.72, ease: "power3.out" });
    const tiltY = gsap.quickTo(activeTilt, "rotationY", { duration: 0.72, ease: "power3.out" });
    const resetTilt = () => { tiltX(0); tiltY(0); };
    const onPointerMove = (event: PointerEvent) => {
      const rect = activeShell.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
        resetTilt();
        return;
      }
      const x = Math.max(-0.5, Math.min(0.5, ((event.clientX - rect.left) / rect.width) - 0.5));
      const y = Math.max(-0.5, Math.min(0.5, ((event.clientY - rect.top) / rect.height) - 0.5));
      tiltY(x * 3.2);
      tiltX(y * -2.6);
    };

    wheel.addEventListener("pointermove", onPointerMove);
    wheel.addEventListener("pointerleave", resetTilt);
    return () => {
      wheel.removeEventListener("pointermove", onPointerMove);
      wheel.removeEventListener("pointerleave", resetTilt);
      resetTilt();
    };
  }, [active]);

  const onWheelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    }
  };

  const openProject = (event: React.MouseEvent<HTMLButtonElement>, slug: string) => {
    const image = event.currentTarget.querySelector("img");
    if (!image || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.location.assign(`/projetos/${slug}`);
      return;
    }
    const rect = image.getBoundingClientRect();
    const curtain = document.createElement("div");
    const clone = image.cloneNode(true) as HTMLImageElement;
    curtain.className = "project-transition-curtain";
    clone.className = "project-transition-clone";
    clone.setAttribute("aria-hidden", "true");
    Object.assign(clone.style, {
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });
    document.body.append(curtain, clone);
    gsap.timeline({ onComplete: () => { window.location.assign(`/projetos/${slug}`); } })
      .to(curtain, { opacity: 1, duration: 0.28, ease: "power2.out" })
      .to(clone, {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        filter: "grayscale(0) contrast(1.02)",
        duration: 0.82,
        ease: "power4.inOut",
      }, 0)
      .to(clone, { opacity: 0, duration: 0.2, ease: "power2.in" }, 0.66);
  };

  const current = projects[active];

  return (
    <main
      ref={mainRef}
      className="portfolio-root"
      style={{ "--project-accent": current.accent } as React.CSSProperties}
    >
      <div className="ambient-background" aria-hidden="true">
        <img className="ambient-shape ambient-shape--orchid" src="/media/blob-orchid.svg" alt="" width="500" height="500" />
        <img className="ambient-shape ambient-shape--cobalt" src="/media/blob-cobalt.svg" alt="" width="500" height="500" />
        <img className="ambient-shape ambient-shape--violet" src="/media/blob-violet.svg" alt="" width="500" height="500" />
        <img className="ambient-shape ambient-shape--paper" src="/media/blob-paper.svg" alt="" width="500" height="500" />
      </div>

      <div className="intro-motion" aria-hidden="true">
        <div className="intro-shapes">
          <img className="intro-shape intro-shape--orchid" src="/media/blob-orchid.svg" alt="" width="500" height="500" />
          <img className="intro-shape intro-shape--cobalt" src="/media/blob-cobalt.svg" alt="" width="500" height="500" />
          <img className="intro-shape intro-shape--violet" src="/media/blob-violet.svg" alt="" width="500" height="500" />
        </div>
        <div className="intro-topline">
          <span className="wordmark intro-wordmark">GM<span>®</span></span>
          <span>Design gráfico / Portfólio 2026</span>
        </div>
        <div className="intro-progress">
          <span className="intro-progress-number">0%</span>
          <i className="intro-progress-track" />
        </div>
        <div className="intro-layout">
          <div className="intro-copy">
            <p>Designer Gráfico · São Paulo, BR</p>
            <div className="intro-title">
              <span className="intro-title-line"><KineticLine text="GUILHERME" /></span>
              <span className="intro-title-line"><KineticLine text="MIRANDA" /></span>
            </div>
            <p className="intro-note"><em>Pôster / composição / direção de arte</em></p>
          </div>
          <div className="intro-posters">
            {introProjects.map((project, index) => (
              <figure className="intro-poster-card" key={project.slug} style={{ "--intro-index": index } as React.CSSProperties}>
                <img src={project.image} alt="" width={project.width} height={project.height} />
              </figure>
            ))}
          </div>
        </div>
      </div>

      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Voltar ao início">GM<span>®</span></a>
        <nav aria-label="Navegação principal">
          <a href="#trabalhos">Trabalhos</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato">Contato</a>
        </nav>
        <span className="edition">Portfólio · 2026</span>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="section-label">Apresentação</p>
          <p className="kicker">Designer Gráfico · São Paulo, BR</p>
          <h1>
            <span className="sr-only">GUILHERME MIRANDA</span>
            <span className="title-line"><KineticLine text="GUILHERME" /></span>
            <span className="title-line"><KineticLine text="MIRANDA" /></span>
          </h1>
          <p className="statement">Transformo <strong>ideias, referências e conceitos</strong> em soluções visuais com identidade.</p>
          <div className="hero-actions">
            <a className="text-link" href="#trabalhos">Ver trabalhos</a>
            <a className="text-link secondary-link" href="mailto:gui_8.0@hotmail.com">Entrar em contato</a>
          </div>
        </div>

        <figure className="portrait-wrap">
          <div className="portrait-stage">
            <div className="portrait-frame"><img src="/media/profile.png" alt="Guilherme Miranda" width="640" height="640" /></div>
          </div>
          <figcaption className="portrait-caption">Designer Gráfico</figcaption>
        </figure>

        <div className="hero-availability">
          <i aria-hidden="true" />
          <span>Disponível para projetos</span>
          <span>Brasil · 2026</span>
        </div>
      </section>

      <section className="work-section" id="trabalhos">
        <div className="work-intro">
          <p className="section-label">Trabalhos selecionados</p>
          <div className="work-title-row">
            <h2><span className="couture-face">ESTUDOS &<br /><span>PROJETOS PESSOAIS</span></span></h2>
            <p><em>Uma seleção de cartazes esportivos e experimentações gráficas.</em></p>
          </div>
        </div>

        <div className="work-layout">
          <aside ref={projectIndexRef} className="project-index" aria-label="Índice de projetos">
            {projects.map((project, index) => (
              <button
                className={`project-index-row ${index === active ? "is-active" : ""}`}
                type="button"
                key={project.slug}
                onClick={() => selectProject(index)}
                aria-current={index === active ? "true" : undefined}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{project.title}</strong>
              </button>
            ))}
          </aside>

          <div className="wheel-stage">
            <div
              className="image-wheel"
              ref={wheelRef}
              data-lenis-prevent-wheel
              role="listbox"
              tabIndex={0}
              aria-roledescription="carrossel"
              aria-label="Projetos selecionados. Use a roda do mouse ou as setas para navegar."
              onKeyDown={onWheelKeyDown}
            >
              <div className="wheel-track">
                {projects.map((project, index) => {
                  const isActive = index === active;
                  return (
                  <button
                    type="button"
                    className={`wheel-card ${project.layout === "landscape" ? "is-landscape" : ""} ${isActive ? "is-active" : ""}`}
                    key={project.slug}
                    data-project-index={index}
                    onClick={(event) => {
                      if (didSwipe.current) {
                        didSwipe.current = false;
                        return;
                      }
                      if (isActive) openProject(event, project.slug);
                      else selectProject(index);
                    }}
                    tabIndex={isActive ? 0 : -1}
                    role="option"
                    aria-selected={isActive}
                    aria-label={`${project.title}. ${isActive ? "Abrir projeto" : "Selecionar projeto"}`}
                  >
                    <span className="poster-shell">
                      <span className="poster-motion">
                        <span className="poster-tilt">
                          <img src={project.image} alt={project.alt} width={project.width} height={project.height} />
                        </span>
                      </span>
                    </span>
                    <span className="card-caption">
                      <strong>{project.title}</strong>
                      <span>{project.category} · {project.year}</span>
                    </span>
                  </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="about-section" id="sobre">
        <div className="about-aside">
          <p className="section-label">Sobre</p>
        </div>
        <div className="about-copy">
          <h2><span className="couture-face">IDEIA, IMAGEM<br />E PRESENÇA.</span></h2>
          <p>Atualmente no 4º semestre de Design Gráfico, exploro diferentes áreas do design, com interesse em identidade visual, design editorial, direção de arte e composição gráfica.</p>
          <ol>
            <li><span>01</span>Identidade Visual</li>
            <li><span>02</span>Design Editorial</li>
            <li><span>03</span>Direção de Arte</li>
            <li><span>04</span>Composição Gráfica</li>
          </ol>
        </div>
      </section>

      <footer id="contato">
        <p className="section-label">Contatos</p>
        <div className="footer-heading"><h2><span className="couture-face">VAMOS CRIAR<br />ALGO JUNTOS?</span></h2><p><em>Disponível para projetos e colaborações.</em></p></div>
        <div className="contact-links">
          <a href="mailto:gui_8.0@hotmail.com"><span>E-mail</span>gui_8.0@hotmail.com</a>
          <a href="https://www.linkedin.com/in/guilherme-miranda-9336723b5" target="_blank" rel="noreferrer"><span>LinkedIn</span>linkedin.com/in/guilherme-miranda-9336723b5</a>
        </div>
        <p className="footer-note">Guilherme Miranda © 2026 · Brasil</p>
      </footer>
    </main>
  );
}

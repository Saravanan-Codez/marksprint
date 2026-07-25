import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './LiquidEther.css';
import {
  makePaletteTexture,
  WebGLManager
} from './LiquidEtherClasses.js';

const defaultColors = ['#5227FF', '#FF9FFC', '#B497CF'];

export default function LiquidEther({
  mouseForce = 20,
  cursorSize = 100,
  isViscous = false,
  viscous = 30,
  iterationsViscous = 32,
  iterationsPoisson = 32,
  dt = 0.014,
  BFECC = true,
  resolution = 0.5,
  isBounce = false,
  colors = defaultColors,
  style = {},
  className = '',
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  takeoverDuration = 0.25,
  autoResumeDelay = 1000,
  autoRampDuration = 0.6
}) {
  const mountRef = useRef(null);
  const webglRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const rafRef = useRef(null);
  const intersectionObserverRef = useRef(null);
  const isVisibleRef = useRef(true);
  const resizeRafRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const paletteTex = makePaletteTexture(colors);
    const bgVec4 = new THREE.Vector4(0, 0, 0, 0);

    const container = mountRef.current;
    container.style.position = container.style.position || 'relative';
    container.style.overflow = container.style.overflow || 'hidden';

    const webgl = new WebGLManager({
      $wrapper: container,
      autoDemo,
      autoSpeed,
      autoIntensity,
      takeoverDuration,
      autoResumeDelay,
      autoRampDuration
    }, paletteTex, bgVec4, {
      isVisibleRef,
      rafRef,
      resizeRafRef
    });
    webglRef.current = webgl;

    const applyOptionsFromProps = () => {
      if (!webglRef.current) return;
      const sim = webglRef.current.output?.simulation;
      if (!sim) return;
      const prevRes = sim.options.resolution;
      Object.assign(sim.options, {
        mouse_force: mouseForce,
        cursor_size: cursorSize,
        isViscous,
        viscous,
        iterations_viscous: iterationsViscous,
        iterations_poisson: iterationsPoisson,
        dt,
        BFECC,
        resolution,
        isBounce
      });
      if (resolution !== prevRes) sim.resize();
    };
    applyOptionsFromProps();
    webgl.start();

    const io = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        const isVisible = entry.isIntersecting && entry.intersectionRatio > 0;
        isVisibleRef.current = isVisible;
        if (!webglRef.current) return;
        if (isVisible && !document.hidden) {
          webglRef.current.start();
        } else {
          webglRef.current.pause();
        }
      },
      { threshold: [0, 0.01, 0.1] }
    );
    io.observe(container);
    intersectionObserverRef.current = io;

    const ro = new ResizeObserver(() => {
      if (!webglRef.current) return;
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = requestAnimationFrame(() => {
        if (!webglRef.current) return;
        webglRef.current.resize();
      });
    });
    ro.observe(container);
    resizeObserverRef.current = ro;

    const roRef = resizeObserverRef;
    const ioRef = intersectionObserverRef;
    const wglRef = webglRef;
    const rRafRef = rafRef;

    return () => {
      const rafId = rRafRef.current;
      if (rafId) cancelAnimationFrame(rafId);
      const ro = roRef.current;
      if (ro) {
        try {
          ro.disconnect();
        } catch {
          /* noop */
        }
      }
      const io = ioRef.current;
      if (io) {
        try {
          io.disconnect();
        } catch {
          /* noop */
        }
      }
      const webgl = wglRef.current;
      if (webgl) {
        webgl.dispose();
      }
      wglRef.current = null;
    };
  }, [
    BFECC,
    cursorSize,
    dt,
    isBounce,
    isViscous,
    iterationsPoisson,
    iterationsViscous,
    mouseForce,
    resolution,
    viscous,
    colors,
    autoDemo,
    autoSpeed,
    autoIntensity,
    takeoverDuration,
    autoResumeDelay,
    autoRampDuration
  ]);

  useEffect(() => {
    const webgl = webglRef.current;
    if (!webgl) return;
    const sim = webgl.output?.simulation;
    if (!sim) return;
    const prevRes = sim.options.resolution;
    Object.assign(sim.options, {
      mouse_force: mouseForce,
      cursor_size: cursorSize,
      isViscous,
      viscous,
      iterations_viscous: iterationsViscous,
      iterations_poisson: iterationsPoisson,
      dt,
      BFECC,
      resolution,
      isBounce
    });
    if (webgl.autoDriver) {
      webgl.autoDriver.enabled = autoDemo;
      webgl.autoDriver.speed = autoSpeed;
      webgl.autoDriver.resumeDelay = autoResumeDelay;
      webgl.autoDriver.rampDurationMs = autoRampDuration * 1000;
      if (webgl.autoDriver.mouse) {
        webgl.autoDriver.mouse.autoIntensity = autoIntensity;
        webgl.autoDriver.mouse.takeoverDuration = takeoverDuration;
      }
    }
    if (resolution !== prevRes) sim.resize();
  }, [
    mouseForce,
    cursorSize,
    isViscous,
    viscous,
    iterationsViscous,
    iterationsPoisson,
    dt,
    BFECC,
    resolution,
    isBounce,
    autoDemo,
    autoSpeed,
    autoIntensity,
    takeoverDuration,
    autoResumeDelay,
    autoRampDuration
  ]);

  return <div ref={mountRef} className={`liquid-ether-container ${className || ''}`} style={style} />;
}

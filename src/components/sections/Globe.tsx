"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const ReactGlobe = dynamic(() => import("react-globe.gl"), { ssr: false });

interface ProjectPoint {
  lat: number;
  lng: number;
  name: string;
  slug: string;
  color: string;
}

const projectPoints: ProjectPoint[] = [
  {
    lat: 43.6108,
    lng: 3.8767,
    name: "Water Credit AI — UNESCO Hackathon 2026",
    slug: "water-credit-ai",
    color: "#4DFFA0",
  },
];

const GLOBE_RADIUS = 100;
const ORBIT_ALTITUDE = 1.35;
const ORBIT_SPEED = 0.25;
const ORBIT_INCLINATION = 0.5;
const TARGET_SIZE = 12;

export default function Globe() {
  const globeRef = useRef<any>(null);
  const satelliteRef = useRef<THREE.Object3D | null>(null);
  const [globeReady, setGlobeReady] = useState(false);

  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });

  useEffect(() => {
    const updateSize = () => {
      const size = Math.min(window.innerWidth * 0.5, 600);
      setDimensions({ width: size, height: size });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Ce bloc ne se déclenche qu'une fois le globe RÉELLEMENT prêt (onGlobeReady)
  useEffect(() => {
    if (!globeReady || !globeRef.current) {
      console.log("Globe pas encore prêt, en attente...");
      return;
    }

    console.log("Globe prêt, initialisation du satellite...");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // La rotation automatique du globe respecte prefers-reduced-motion
    globeRef.current.controls().autoRotate = !prefersReducedMotion;
    globeRef.current.controls().autoRotateSpeed = 0.5;
    globeRef.current.pointOfView({ lat: 30, lng: 10, altitude: 2.2 });

    let frameId: number;
    let satelliteObject: THREE.Object3D | null = null;

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
    );

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(
      "/models/satellite.glb",
      (gltf) => {
        satelliteObject = gltf.scene;

        const box = new THREE.Box3().setFromObject(satelliteObject);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDimension = Math.max(size.x, size.y, size.z);

        const scaleFactor = TARGET_SIZE / maxDimension;
        satelliteObject.scale.setScalar(scaleFactor);

        console.log("Taille originale du satellite :", size);
        console.log("Facteur d'échelle appliqué :", scaleFactor);

        globeRef.current.scene().add(satelliteObject);
        satelliteRef.current = satelliteObject;

        let angle = 0;

        const animateOrbit = () => {
          angle += ORBIT_SPEED * 0.01;

          const orbitRadius = GLOBE_RADIUS * ORBIT_ALTITUDE;
          const x = orbitRadius * Math.cos(angle);
          const z = orbitRadius * Math.sin(angle);
          const y = orbitRadius * Math.sin(angle * 0.6) * ORBIT_INCLINATION;

          if (satelliteRef.current) {
            satelliteRef.current.position.set(x, y, z);
            satelliteRef.current.lookAt(0, 0, 0);
          }

          frameId = requestAnimationFrame(animateOrbit);
        };

        if (prefersReducedMotion) {
          satelliteObject.position.set(GLOBE_RADIUS * ORBIT_ALTITUDE, 0, 0);
        } else {
          animateOrbit();
        }
      },
      undefined,
      (error) => {
        console.error("Erreur de chargement du modèle satellite :", error);
      }
    );

    return () => {
      cancelAnimationFrame(frameId);
      if (satelliteObject) {
        globeRef.current?.scene().remove(satelliteObject);
      }
    };
  }, [globeReady]);

  const handlePointClick = (point: object) => {
    const p = point as ProjectPoint;
    console.log("Projet cliqué :", p.slug);
  };

  return (
    <div className="flex items-center justify-center">
      <ReactGlobe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="#4DFFA0"
        atmosphereAltitude={0.2}
        pointsData={projectPoints}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointRadius={0.6}
        pointAltitude={0.02}
        pointLabel="name"
        onPointClick={handlePointClick}
        onGlobeReady={() => {
          // react-globe.gl peut appeler ce callback de façon synchrone
          // pendant son initialisation, avant que React ait fini de monter
          // le composant. On décale d'un tick pour éviter l'avertissement.
          setTimeout(() => setGlobeReady(true), 0);
        }}
      />
    </div>
  );
}
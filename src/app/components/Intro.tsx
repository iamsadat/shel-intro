"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { gsap } from "gsap";

const Intro = () => {
  useEffect(() => {
    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("3d-model").appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Load the 3D model
    const loader = new GLTFLoader();
    loader.load(
      "/intro/hoodie.glb",
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        // Scale and position the model
        const updateModelScaleAndPosition = () => {
          const isMobile = window.innerWidth < 768;
          const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
          const scale = isMobile ? 2 : isTablet ? 2.5 : 3;
          model.scale.set(scale, scale, scale);
          const positionY = isMobile ? 0 : isTablet ? -1 : -2;
          model.position.set(0, positionY, -5);
        };
        updateModelScaleAndPosition();

        // GSAP animation for continuous rotation
        gsap.to(model.rotation, {
          y: "+=6.28",
          duration: 2,
          repeat: -1,
          ease: "linear",
        });

        const animate = () => {
          requestAnimationFrame(animate);
          renderer.render(scene, camera);
        };
        animate();

        // Adjust model on window resize
        window.addEventListener("resize", updateModelScaleAndPosition);
      },
      undefined,
      (error) => {
        console.error("An error occurred while loading the model:", error);
      }
    );

    camera.position.z = 5;

    // Adjust renderer size on window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Clean up on component unmount
    return () => {
      document.getElementById("3d-model").removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const logoContainer = document.getElementById("logo-container");
    const introText = document.getElementById("intro-text");
    const progressBarContainer = document.getElementById(
      "progress-bar-container"
    );
    const modelContainer = document.getElementById("3d-model");

    // Create a GSAP timeline
    const tl = gsap.timeline();

    // Logo container animation: blur to clear and move to top
    tl.to("#shel-logo", {
      filter: "blur(0px)",
      clipPath: "inset(0 0% 0 0)",
      duration: 2,
      ease: "power2.out",
    }).to(logoContainer, {
      //   y: "-=42vh",
      //   duration: 1.5,
      ease: "power2.out",
      onComplete: () => {
        console.log(
          "Animation complete, setting logo container position to top."
        );
        gsap.set(logoContainer, {
          position: "fixed",
          top: "2.15vh",
          //   top: "2.15vh",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000, // Ensure the logo is above other elements
        });
        console.log(
          "Logo container position set to top:",
          logoContainer.style.top
        );
      },
    });

    // Intro text animation: fall from top to bottom
    tl.fromTo(
      introText,
      { opacity: 0, y: -100 }, // Start above the screen and transparent
      {
        opacity: 1,
        y: "90vh", // End at 60% of the viewport height
        duration: 2,
        ease: "power1.inOut",
      },
      "+=0.5" // Start after the logo animation
    );

    // 3D model and progress bar animation: appear and start animating
    tl.fromTo(
      modelContainer,
      { opacity: 1, scale: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
      },
      "+=0.5" // Start after the intro text animation
    )
      .fromTo(
        progressBarContainer,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
        },
        "-=1" // Overlap with the model fade-in
      )
      .to(
        "#progress-bar",
        {
          width: "100%",
          duration: 2,
          ease: "linear",
        },
        "-=1" // Overlap with the progress bar container fade-in
      );
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/intro/the-fall.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div
        id="logo-container"
        //className="fixed flex justify-center items-center w-[15%] h-auto top-[5vh] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        className="fixed flex justify-center items-center w-[15%] h-auto top-[5vh] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <img
          id="shel-logo"
          src="/intro/shel-logo.png"
          alt="Shel Logo"
          //   className="w-[25%] h-[20%] md:w-[10%] md:h-[7%] lg:w-[8%] lg:h-[5%]"
          style={{ filter: "blur(10px)", clipPath: "inset(0 100% 0 0)" }}
        />
      </div>
      <div
        id="3d-model"
        className="absolute inset-0 flex justify-center items-center opacity-0"
      ></div>
      <div
        id="progress-bar-container"
        className="absolute bottom-[50%] lg:bottom-[40%] left-1/2 transform -translate-x-1/2 w-[60%] md:w-[30%] rounded-lg h-[0.75%] lg:h-[1%] bg-gray-200 opacity-0"
      >
        <div
          id="progress-bar"
          className="h-full bg-[#f40201] rounded-lg"
          style={{ width: "0%" }}
        ></div>
      </div>
      <div
        id="intro-text"
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#f40201] text-center tracking-[.05em] md:tracking-[.3em] lg:tracking-[.35em] font-custom opacity-0"
      >
        THE FALL
      </div>
    </div>
  );
};

export default Intro;

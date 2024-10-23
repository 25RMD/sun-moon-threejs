"use client"

import Image from "next/image";
import * as THREE from 'three';
import { useEffect, useRef } from "react";
import { Wireframe } from "three/examples/jsm/Addons.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import Davido from './images/davido-interview.webp'
// import Sun from './images/8k_sun.jpg'
import Sun from './images/8k_sun.jpg'
import NormalSpace from './images/normalspace.jpg'
import NormalSun from './images/normalsun.jpg'
import NormalMoon from './images/normalMoon.jpg'
import Moon from './images/moon.jpg'
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';

export default function Home() {

  useEffect(()=>{

    // if (!canvasRef.current) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('#bg') as HTMLCanvasElement,
    }); 

    

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.position.set(0, 0, 30);


    const normalSpace = new THREE.TextureLoader().load(NormalSpace.src)
    
    
    const sunTexture = new THREE.TextureLoader().load(Sun.src)
    const normalSun = new THREE.TextureLoader().load(NormalSun.src)
    const sphere = new THREE.Mesh( 
      new THREE.SphereGeometry( 15, 100, 100 ), 
      new THREE.MeshStandardMaterial({ 
        map: sunTexture,
        normalMap: normalSun
      }) 
    ); 

    const moonTexture = new THREE.TextureLoader().load(Moon.src)
    const normalMoon = new THREE.TextureLoader().load(NormalMoon.src)
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry( 15, 100, 100 ),
      new THREE.MeshStandardMaterial({
        map: moonTexture,
        normalMap: normalMoon
      
      })
    );

    const light = new THREE.PointLight( 0xffffff, 1.5, 2000 );
    const textureLoader = new THREE.TextureLoader();

    const textureFlare0 = textureLoader.load( "textures/lensflare/lensflare0.png" );

    const lensflare = new Lensflare();

    lensflare.addElement( new LensflareElement( textureFlare0, 512, 0 ) );

    light.add( lensflare );


    moon.position.set(80, 5, 5)

    scene.add(sphere, moon)

    // const pointLight = new THREE.PointLight(0xffffff, 50);
    // pointLight.position.set(10, 11, 20 );

    // const pointLight2 = new THREE.PointLight(0xffffff, 50);
    // pointLight2.position.set(-10, 11, -20 );

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    // scene.add(pointLight, <pointLi></pointLi>ght2)
    
    const lightHelper = new THREE.DirectionalLightHelper(directionalLight);
    // const lightHelper2 = new THREE.PointLightHelper(pointLight2);

    const gridHelper = new THREE.GridHelper(200, 50);
    scene.add(ambientLight, lightHelper);

    const stars: Stars[] = [];

    interface Stars {
      Star: THREE.Mesh,
      Move: number
    }

    function addStar(){

      const geometry = new THREE.SphereGeometry( 1, 32, 16 ); 
      const material = new THREE.MeshBasicMaterial( { color: 0xffffff } ); 
      const star = new THREE.Mesh(geometry, material);
      
      const [x, y, z] = Array(3).fill(null).map(() => THREE.MathUtils.randFloatSpread(1000));
      

      const move: number = THREE.MathUtils.randFloatSpread(5);

      const Star: Stars = {
        Star: star,
        Move: move

      }

      star.position.set(x, y, z);
      
      scene.add(star);
      stars.push(Star)
    }

    Array(1000).fill(null).forEach(() => addStar());

    const controls = new OrbitControls(camera, renderer.domElement);
    
    
    function animate(){ 
      requestAnimationFrame( animate );
      renderer.render( scene, camera );

      sphere.rotation.x += 0.001;
      sphere.rotation.y += 0.01;
      sphere.rotation.z += 0.01;

      moon.rotation.x += 0.001;
      moon.rotation.y += 0.01;
      moon.rotation.z += 0.01;

      stars.forEach((star)=>{

        star.Star.rotation.x += 0.01;
        star.Star.rotation.y += 0.03;
        star.Star.rotation.z += 0.01;

        star.Star.position.z += star.Move;
      });
      
      controls.update();
    }

    animate();

  }, []);

  return (
    <canvas className="position:fixed top-0 left-0" id="bg" />
  );
} 

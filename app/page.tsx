// pages/index.tsx
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import "./style.css";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Preload
    const preload = () => {
      let manager = new THREE.LoadingManager();
      manager.onLoad = function () {
        const environment = new Environment(typo, particle);
      };

      let typo = null;
      const loader = new FontLoader(manager);
      const font = loader.load(
        "/fonts/helvetiker_regular.typeface.json",
        function (font) {
          typo = font;
        },
        undefined,
        (error) => {
          console.error("Font yükleme hatası:", error);
        }
      );
      const particle = new THREE.TextureLoader(manager).load(
        "/images/particle_a64uzf.png",
        undefined,
        undefined,
        (error) => {
          console.error("Texture yükleme hatası:", error);
        }
      );
    };

    preload();

    class Environment {
      font: any;
      particle: any;
      container: HTMLDivElement;
      scene: THREE.Scene;
      camera: THREE.PerspectiveCamera;
      renderer: THREE.WebGLRenderer;
      composer: EffectComposer;
      createParticles: CreateParticles;

      constructor(font: any, particle: any) {
        this.font = font;
        this.particle = particle;
        this.container = container;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        this.createCamera();
        this.createRenderer();
        this.setup();
        this.bindEvents();
      }

      bindEvents() {
        window.addEventListener("resize", this.onWindowResize.bind(this));
      }

      setup() {
        this.createParticles = new CreateParticles(
          this.scene,
          this.font,
          this.particle,
          this.camera,
          this.renderer,
          this.composer
        );
      }

      render() {
        this.createParticles.render();
        // this.renderer.render(this.scene, this.camera);
        this.composer.render();
      }

      createCamera() {
        const isMobile = window.innerWidth <= 550;
        const fov = isMobile ? 75 : 65; // Mobil cihazlarda daha geniş bir görüş açısı
        this.camera = new THREE.PerspectiveCamera(
          fov,
          this.container.clientWidth / this.container.clientHeight,
          1,
          10000
        );
        this.camera.position.set(0, 0, 100);
      }

      createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(
          this.container.clientWidth,
          this.container.clientHeight
        );
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.container.appendChild(this.renderer.domElement);

        // Postprocessing
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        const bloomPass = new UnrealBloomPass(
          new THREE.Vector2(
            this.container.clientWidth,
            this.container.clientHeight
          ),
          0.5,
          0,
          0
        );
        this.composer.addPass(bloomPass);

        this.renderer.setAnimationLoop(() => {
          this.render();
        });
      }

      onWindowResize() {
        this.camera.aspect =
          this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(
          this.container.clientWidth,
          this.container.clientHeight
        );
        this.composer.setSize(
          this.container.clientWidth,
          this.container.clientHeight
        );
      }
    }

    class CreateParticles {
      scene: THREE.Scene;
      font: any;
      particleImg: any;
      camera: THREE.PerspectiveCamera;
      renderer: THREE.WebGLRenderer;
      composer: EffectComposer;
      raycaster: THREE.Raycaster;
      mouse: THREE.Vector2;
      colorChange: THREE.Color;
      buttom: boolean;
      data: {
        text: string;
        amount: number;
        particleSize: number;
        particleColor: number;
        textSize: number;
        area: number;
        ease: number;
      };
      planeArea: THREE.Mesh;
      particles: THREE.Points;
      geometryCopy: THREE.BufferGeometry;
      currenPosition: THREE.Vector3 | undefined;

      constructor(
        scene: THREE.Scene,
        font: any,
        particleImg: any,
        camera: THREE.PerspectiveCamera,
        renderer: THREE.WebGLRenderer,
        composer: EffectComposer
      ) {
        this.scene = scene;
        this.font = font;
        this.particleImg = particleImg;
        this.camera = camera;
        this.renderer = renderer;
        this.composer = composer;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(-200, 200);
        this.colorChange = new THREE.Color();
        this.buttom = false;

        this.data = {
          text: "New Gen\n  ATARI",
          amount: 1500,
          particleSize: 1,
          particleColor: 0xffffff,
          textSize: 16,
          area: 250,
          ease: 0.05,
        };

        this.setup();
        this.bindEvents();
      }

      setup() {
        const geometry = new THREE.PlaneGeometry(
          this.visibleWidthAtZDepth(100, this.camera),
          this.visibleHeightAtZDepth(100, this.camera)
        );
        const material = new THREE.MeshBasicMaterial({
          color: 0x00ff00,
          transparent: true,
        });
        this.planeArea = new THREE.Mesh(geometry, material);
        this.planeArea.visible = false;
        this.scene.add(this.planeArea);

        this.createText();
      }

      bindEvents() {
        document.addEventListener("mousedown", this.onMouseDown.bind(this));
        document.addEventListener("mousemove", this.onMouseMove.bind(this));
        document.addEventListener("mouseup", this.onMouseUp.bind(this));
      }

      onMouseDown(event: MouseEvent) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
        vector.unproject(this.camera);
        const dir = vector.sub(this.camera.position).normalize();
        const distance = -this.camera.position.z / dir.z;
        this.currenPosition = this.camera.position
          .clone()
          .add(dir.multiplyScalar(distance));

        const pos = this.particles.geometry.attributes
          .position as THREE.BufferAttribute;
        this.buttom = true;
        this.data.ease = 0.01;
      }

      onMouseUp() {
        this.buttom = false;
        this.data.ease = 0.05;
      }

      onMouseMove(event: MouseEvent) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      }

      render() {
        const time = ((0.001 * performance.now()) % 12) / 12;
        const zigzagTime = (1 + Math.sin(time * 2 * Math.PI)) / 6;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObject(this.planeArea);

        if (intersects.length > 0) {
          const pos = this.particles.geometry.attributes
            .position as THREE.BufferAttribute;
          const copy = this.geometryCopy.attributes
            .position as THREE.BufferAttribute;
          const coulors = this.particles.geometry.attributes
            .customColor as THREE.BufferAttribute;
          const size = this.particles.geometry.attributes
            .size as THREE.BufferAttribute;

          const mx = intersects[0].point.x;
          const my = intersects[0].point.y;
          const mz = intersects[0].point.z;

          for (let i = 0, l = pos.count; i < l; i++) {
            const initX = copy.getX(i);
            const initY = copy.getY(i);
            const initZ = copy.getZ(i);

            let px = pos.getX(i);
            let py = pos.getY(i);
            let pz = pos.getZ(i);

            this.colorChange.setHSL(0.5, 1, 1);
            coulors.setXYZ(
              i,
              this.colorChange.r,
              this.colorChange.g,
              this.colorChange.b
            );
            coulors.needsUpdate = true;

            size.array[i] = this.data.particleSize;
            size.needsUpdate = true;

            let dx = mx - px;
            let dy = my - py;
            const dz = mz - pz;

            const mouseDistance = this.distance(mx, my, px, py);
            let d = (dx = mx - px) * dx + (dy = my - py) * dy;
            const f = -this.data.area / d;

            if (this.buttom) {
              const t = Math.atan2(dy, dx);
              px -= f * Math.cos(t);
              py -= f * Math.sin(t);

              this.colorChange.setHSL(0.5 + zigzagTime, 1.0, 0.5);
              coulors.setXYZ(
                i,
                this.colorChange.r,
                this.colorChange.g,
                this.colorChange.b
              );
              coulors.needsUpdate = true;

              if (
                px > initX + 70 ||
                px < initX - 70 ||
                py > initY + 70 ||
                py < initY - 70
              ) {
                this.colorChange.setHSL(0.15, 1.0, 0.5);
                coulors.setXYZ(
                  i,
                  this.colorChange.r,
                  this.colorChange.g,
                  this.colorChange.b
                );
                coulors.needsUpdate = true;
              }
            } else {
              if (mouseDistance < this.data.area) {
                if (i % 5 == 0) {
                  const t = Math.atan2(dy, dx);
                  px -= 0.03 * Math.cos(t);
                  py -= 0.03 * Math.sin(t);

                  this.colorChange.setHSL(0.0, 1.0, 0.5);
                  coulors.setXYZ(
                    i,
                    this.colorChange.r,
                    this.colorChange.g,
                    this.colorChange.b
                  );
                  coulors.needsUpdate = true;

                  size.array[i] = this.data.particleSize / 1.2;
                  size.needsUpdate = true;
                } else {
                  const t = Math.atan2(dy, dx);
                  px += f * Math.cos(t);
                  py += f * Math.sin(t);

                  pos.setXYZ(i, px, py, pz);
                  pos.needsUpdate = true;

                  size.array[i] = this.data.particleSize * 1.3;
                  size.needsUpdate = true;
                }

                if (
                  px > initX + 10 ||
                  px < initX - 10 ||
                  py > initY + 10 ||
                  py < initY - 10
                ) {
                  this.colorChange.setHSL(0.15, 1.0, 0.5);
                  coulors.setXYZ(
                    i,
                    this.colorChange.r,
                    this.colorChange.g,
                    this.colorChange.b
                  );
                  coulors.needsUpdate = true;

                  size.array[i] = this.data.particleSize / 1.8;
                  size.needsUpdate = true;
                }
              }
            }

            px += (initX - px) * this.data.ease;
            py += (initY - py) * this.data.ease;
            pz += (initZ - pz) * this.data.ease;

            pos.setXYZ(i, px, py, pz);
            pos.needsUpdate = true;
          }
        }
      }

      createText() {
        let thePoints: THREE.Vector3[] = [];

        let shapes = this.font.generateShapes(
          this.data.text,
          this.data.textSize
        );
        let geometry = new THREE.ShapeGeometry(shapes);
        geometry.computeBoundingBox();

        const xMid =
          -0.5 * (geometry.boundingBox!.max.x - geometry.boundingBox!.min.x);
        const yMid =
          (geometry.boundingBox!.max.y - geometry.boundingBox!.min.y) / 2.85;

        geometry.center();

        let holeShapes: any[] = [];

        for (let q = 0; q < shapes.length; q++) {
          let shape = shapes[q];

          if (shape.holes && shape.holes.length > 0) {
            for (let j = 0; j < shape.holes.length; j++) {
              let hole = shape.holes[j];
              holeShapes.push(hole);
            }
          }
        }
        shapes.push.apply(shapes, holeShapes);

        let colors: number[] = [];
        let sizes: number[] = [];

        for (let x = 0; x < shapes.length; x++) {
          let shape = shapes[x];

          const amountPoints =
            shape.type == "Path" ? this.data.amount / 2 : this.data.amount;

          let points = shape.getSpacedPoints(amountPoints);

          points.forEach((element: any, z: number) => {
            const a = new THREE.Vector3(element.x, element.y, 0);
            thePoints.push(a);
            colors.push(
              this.colorChange.r,
              this.colorChange.g,
              this.colorChange.b
            );
            sizes.push(1);
          });
        }

        let geoParticles = new THREE.BufferGeometry().setFromPoints(thePoints);
        geoParticles.translate(xMid, yMid, 0);

        geoParticles.setAttribute(
          "customColor",
          new THREE.Float32BufferAttribute(colors, 3)
        );
        geoParticles.setAttribute(
          "size",
          new THREE.Float32BufferAttribute(sizes, 1)
        );

        const material = new THREE.ShaderMaterial({
          uniforms: {
            color: { value: new THREE.Color(0xffffff) },
            pointTexture: { value: this.particleImg },
          },
          vertexShader: `
            attribute float size;
            attribute vec3 customColor;
            varying vec3 vColor;

            void main() {
              vColor = customColor;
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            uniform vec3 color;
            uniform sampler2D pointTexture;
            varying vec3 vColor;

            void main() {
              gl_FragColor = vec4(color * vColor, 1.0);
              gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
            }
          `,
          blending: THREE.AdditiveBlending,
          depthTest: false,
          transparent: true,
        });

        this.particles = new THREE.Points(geoParticles, material);
        this.scene.add(this.particles);

        this.geometryCopy = new THREE.BufferGeometry();
        this.geometryCopy.copy(this.particles.geometry);
      }

      visibleHeightAtZDepth(depth: number, camera: THREE.PerspectiveCamera) {
        const cameraOffset = camera.position.z;
        if (depth < cameraOffset) depth -= cameraOffset;
        else depth += cameraOffset;

        const vFOV = (camera.fov * Math.PI) / 180;
        return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
      }

      visibleWidthAtZDepth(depth: number, camera: THREE.PerspectiveCamera) {
        const height = this.visibleHeightAtZDepth(depth, camera);
        return height * camera.aspect;
      }

      distance(x1: number, y1: number, x2: number, y2: number) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
      }
    }

    return () => {
      window.removeEventListener("resize", () => {});
      document.removeEventListener("mousedown", () => {});
      document.removeEventListener("mousemove", () => {});
      document.removeEventListener("mouseup", () => {});
    };
  }, []);

  return (
    <>
      <div id="magic" ref={containerRef}></div>
      <div className="playground">
        <div className="bottomPosition">
          <div
            style={{
              marginTop: "20px",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
              textAlign: "center",
            }}
          >
            <a href="/">Home</a>
            <a href="/TicTacToe">TicTacToe</a>
          </div>
        </div>
      </div>
    </>
  );
}

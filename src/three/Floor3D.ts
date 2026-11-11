import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  FLOOR_DIMENSIONS,
  COUNTER_BLOCK,
  RECEPTION_BLOCK,
  KITCHEN_BLOCK,
  FLOOR_TABLES,
  ORDER_ROUTES,
  STAFF_PATHS,
  TableStatusCode,
  samplePath2D,
} from './floorLayout';
import { CameraPreset, FloorSceneState } from './floorStates';
import { disposeScene } from './dispose';
import { detectSoftwareGl } from '../lib/lowPower';

interface TableMeshRig {
  group: THREE.Group;
  topMat: THREE.MeshStandardMaterial;
  codeMesh: THREE.Mesh;
  ringMesh: THREE.Mesh;
  ringMat: THREE.MeshBasicMaterial;
  guestGroup?: THREE.Group;
  statusPlane: THREE.Mesh;
  statusMat: THREE.MeshBasicMaterial;
  currentStatus: TableStatusCode;
}

const CAMERA_TARGETS: Record<CameraPreset, { pos: [number, number, number]; look: [number, number, number] }> = {
  top: { pos: [0, 21.5, 5.2], look: [0, 0, -0.3] },
  'tilt-table-5': { pos: [-0.8, 12.0, 6.8], look: [-0.8, 0.3, -1.2] },
  'close-table-5': { pos: [-0.8, 3.65, 3.65], look: [-0.8, 1.05, 0.55] },
  'floor-mid': { pos: [-1.1, 12.5, 7.0], look: [-1.1, 0.3, -1.6] },
  'pan-routes': { pos: [2.0, 14.5, 7.6], look: [1.8, 0.3, -0.8] },
  wide: { pos: [0.2, 22.0, 7.5], look: [0.2, 0, -0.3] },
  'wide-dim': { pos: [0.2, 23.5, 8.2], look: [0.2, 0, -0.3] },
};

function makeStatusBadgeTexture(code: TableStatusCode, renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 64, 64);
    ctx.fillStyle = code === 'F' ? 'rgba(20, 9, 5, 0.7)' : 'rgba(232, 80, 12, 0.92)';
    ctx.beginPath();
    ctx.arc(32, 32, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#F7F2ED';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#FBEFE6';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(code, 32, 34);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

function makeQrPlaqueTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#F7F2ED';
    ctx.fillRect(0, 0, 128, 128);
    ctx.strokeStyle = '#E8500C';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, 122, 122);

    ctx.fillStyle = '#140905';
    // 3 QR finder squares
    const drawFinder = (fx: number, fy: number) => {
      ctx.fillStyle = '#140905';
      ctx.fillRect(fx, fy, 32, 32);
      ctx.fillStyle = '#F7F2ED';
      ctx.fillRect(fx + 5, fy + 5, 22, 22);
      ctx.fillStyle = '#140905';
      ctx.fillRect(fx + 10, fy + 10, 12, 12);
    };
    drawFinder(14, 14);
    drawFinder(82, 14);
    drawFinder(14, 82);

    // Center & data cells
    ctx.fillStyle = '#E8500C';
    ctx.fillRect(52, 52, 24, 24);
    ctx.fillStyle = '#140905';
    ctx.fillRect(54, 18, 10, 10);
    ctx.fillRect(54, 34, 10, 10);
    ctx.fillRect(18, 54, 10, 10);
    ctx.fillRect(34, 54, 10, 10);
    ctx.fillRect(84, 54, 12, 12);
    ctx.fillRect(102, 54, 10, 10);
    ctx.fillRect(54, 86, 12, 12);
    ctx.fillRect(84, 84, 14, 14);
    ctx.fillRect(102, 100, 12, 12);
    ctx.fillRect(82, 104, 12, 10);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

function makeTable5MenuCardTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 520;
  canvas.height = 360;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 520, 360);
    // Card background
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(8, 8, 504, 344, 28);
    ctx.fill();
    ctx.strokeStyle = '#E8500C';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Header band
    ctx.fillStyle = '#1A0C06';
    ctx.beginPath();
    ctx.roundRect(24, 24, 472, 54, 14);
    ctx.fill();

    ctx.fillStyle = '#FBEFE6';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('TABLE 5 · DIGITAL MENU', 42, 52);

    // Orange badge
    ctx.fillStyle = '#E8500C';
    ctx.beginPath();
    ctx.roundRect(356, 34, 124, 34, 10);
    ctx.fill();
    ctx.fillStyle = '#FBEFE6';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('NO APP', 418, 52);

    // Category tabs row
    const cats = [
      { label: 'All dishes', active: true, x: 24, w: 120 },
      { label: 'Coffee', active: false, x: 154, w: 96 },
      { label: 'Food', active: false, x: 260, w: 86 },
      { label: 'Drinks', active: false, x: 356, w: 96 },
    ];
    cats.forEach((c) => {
      ctx.fillStyle = c.active ? '#FFEEE3' : '#F3ECE5';
      ctx.beginPath();
      ctx.roundRect(c.x, 92, c.w, 34, 10);
      ctx.fill();
      ctx.fillStyle = c.active ? '#C03E0A' : '#6C625C';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(c.label, c.x + c.w / 2, 110);
    });

    // 3 Dish cards with plate illustration and price
    const dishes = [
      { name: 'Flat white', sub: 'Double shot · Oat or dairy', price: '3.50', color: '#C88A5A', y: 140 },
      { name: 'Smash burger', sub: 'Brioche · Pickles · Cheddar', price: '9.50', color: '#8C3F19', y: 208 },
      { name: 'Iced latte', sub: 'Cold brew · Vanilla', price: '3.80', color: '#D97B38', y: 276 },
    ];
    dishes.forEach((d) => {
      ctx.fillStyle = '#F7F2ED';
      ctx.beginPath();
      ctx.roundRect(24, d.y, 472, 58, 14);
      ctx.fill();
      ctx.strokeStyle = '#E3D9D3';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Plate icon
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(58, d.y + 29, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.arc(58, d.y + 29, 13, 0, Math.PI * 2);
      ctx.fill();

      // Dish title & subtitle
      ctx.fillStyle = '#1A0C06';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(d.name, 92, d.y + 22);

      ctx.fillStyle = '#6C625C';
      ctx.font = '15px sans-serif';
      ctx.fillText(d.sub, 92, d.y + 43);

      // Price pill
      ctx.fillStyle = '#1A0C06';
      ctx.beginPath();
      ctx.roundRect(402, d.y + 13, 78, 32, 8);
      ctx.fill();
      ctx.fillStyle = '#FBEFE6';
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(d.price, 441, d.y + 30);
    });
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

function makeWaiterLabelTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 56;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 160, 56);
    ctx.fillStyle = '#E8500C';
    ctx.beginPath();
    ctx.roundRect(4, 6, 152, 44, 14);
    ctx.fill();
    ctx.strokeStyle = '#F7F2ED';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#FBEFE6';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('WAITER → T5', 80, 29);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

export class Floor3DController {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private isSoftwareGl: boolean;
  private frameId = 0;
  private disposed = false;
  private paused = false;

  private tableRigs = new Map<number, TableMeshRig>();
  private statusTextures = new Map<TableStatusCode, THREE.CanvasTexture>();
  private qrPlaqueTex: THREE.CanvasTexture;
  private table5MenuCardTex: THREE.CanvasTexture;
  private waiterLabelTex: THREE.CanvasTexture;
  private table5Light: THREE.PointLight;
  private kitchenPassMat: THREE.MeshStandardMaterial;
  private receptionLine: THREE.Line;
  private kitchenLine: THREE.Line;
  private waiterLine: THREE.Line;
  private scanBeam: THREE.Mesh;
  private table5MenuSprite: THREE.Sprite;
  private table5ScanCone: THREE.Mesh;
  private staff1Group: THREE.Group;
  private staff1Badge: THREE.Sprite;
  private staff2Group: THREE.Group;

  private targetCamPos = new THREE.Vector3(0, 21.5, 5.2);
  private targetCamLook = new THREE.Vector3(0, 0, -0.3);
  private currentCamLook = new THREE.Vector3(0, 0, -0.3);
  private currentCamPreset: CameraPreset = 'top';
  private autoWalkWaiter = false;
  private waiterWalkPhase = 0.25;
  private lastTickTime = performance.now();

  constructor(container: HTMLElement) {
    this.container = container;
    this.isSoftwareGl = detectSoftwareGl();

    const width = Math.max(260, container.clientWidth || 800);
    const height = Math.max(220, container.clientHeight || 500);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#140905');
    this.scene.fog = new THREE.FogExp2('#140905', 0.011);

    this.camera = new THREE.PerspectiveCamera(35, width / height, 0.4, 110);
    this.camera.position.set(0, 21.5, 5.2);
    this.camera.lookAt(0, 0, -0.3);

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const maxRatio = this.isSoftwareGl ? 1.0 : isMobile ? 1.25 : 1.5;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxRatio));
    this.renderer.setSize(width, height);

    container.innerHTML = '';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.display = 'block';
    container.appendChild(this.renderer.domElement);

    // Studio environment map for PBR depth
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // Pre-build status textures + QR plaque + Table 5 Menu Card + Waiter badge
    (['F', 'M', 'W', 'O', 'C', 'S'] as TableStatusCode[]).forEach((code) => {
      this.statusTextures.set(code, makeStatusBadgeTexture(code, this.renderer));
    });
    this.qrPlaqueTex = makeQrPlaqueTexture(this.renderer);
    this.table5MenuCardTex = makeTable5MenuCardTexture(this.renderer);
    this.waiterLabelTex = makeWaiterLabelTexture(this.renderer);

    // Lighting rig: warm key, cool hemisphere fill, rim light, Table 5 accent point light
    const hemiLight = new THREE.HemisphereLight('#FBEFE6', '#250F07', 0.9);
    hemiLight.position.set(0, 20, 0);
    this.scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight('#FFD8BE', 1.2);
    keyLight.position.set(-8, 18, 10);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#F7F2ED', 0.45);
    rimLight.position.set(10, 14, -10);
    this.scene.add(rimLight);

    this.table5Light = new THREE.PointLight('#E8500C', 2.4, 8, 1.6);
    this.table5Light.position.set(-0.8, 2.6, 0.8);
    this.scene.add(this.table5Light);

    // Build floor slab + perimeter hairlines
    this.buildFloorSlab();

    // Build architectural zones (Counter, Reception, Kitchen)
    this.kitchenPassMat = new THREE.MeshStandardMaterial({
      color: '#E8500C',
      emissive: '#E8500C',
      emissiveIntensity: 0.3,
      roughness: 0.3,
      metalness: 0.2,
    });
    this.buildZones();

    // Build 12 composite tables + chairs + contact shadows + QR codes + rings
    this.buildTables();

    // Scan beam over Table 5
    const scanGeo = new THREE.BoxGeometry(1.1, 0.04, 0.08);
    const scanMat = new THREE.MeshBasicMaterial({ color: '#FBEFE6', transparent: true, opacity: 0 });
    this.scanBeam = new THREE.Mesh(scanGeo, scanMat);
    this.scanBeam.position.set(-0.8, 0.86, 0.8);
    this.scene.add(this.scanBeam);

    // Glowing scan cone rising from Table 5 QR code to the floating Digital Menu Card
    const coneGeo = new THREE.CylinderGeometry(0.65, 0.18, 0.85, 20, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: '#E8500C',
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.table5ScanCone = new THREE.Mesh(coneGeo, coneMat);
    this.table5ScanCone.position.set(-0.6, 1.15, 0.88);
    this.table5ScanCone.renderOrder = 1;
    this.scene.add(this.table5ScanCone);

    // Floating 3D Digital Menu Card over Table 5 for Level 1 close-up
    const menuSpriteMat = new THREE.SpriteMaterial({
      map: this.table5MenuCardTex,
      transparent: true,
      opacity: 0,
      depthTest: false,
    });
    this.table5MenuSprite = new THREE.Sprite(menuSpriteMat);
    this.table5MenuSprite.position.set(-0.8, 1.68, 0.42);
    this.table5MenuSprite.scale.set(2.05, 1.42, 1);
    this.table5MenuSprite.renderOrder = 10;
    this.scene.add(this.table5MenuSprite);

    // Order routes (Table 5 -> Reception, Table 5 -> Kitchen) and Waiter Route (Counter -> Table 5)
    this.receptionLine = this.buildRouteLine(ORDER_ROUTES.table5ToReception, '#F7F2ED');
    this.kitchenLine = this.buildRouteLine(ORDER_ROUTES.table5ToKitchen, '#E8500C');
    this.waiterLine = this.buildRouteLine(STAFF_PATHS.counterToTable5, '#FF8741');
    this.scene.add(this.receptionLine);
    this.scene.add(this.kitchenLine);
    this.scene.add(this.waiterLine);

    // Build 2 composite staff actors + Waiter call overhead badge
    this.staff1Group = this.buildStaffActor('#F7F2ED');
    const badgeMat = new THREE.SpriteMaterial({
      map: this.waiterLabelTex,
      transparent: true,
      opacity: 0,
      depthTest: false,
    });
    this.staff1Badge = new THREE.Sprite(badgeMat);
    this.staff1Badge.position.set(0, 1.55, 0);
    this.staff1Badge.scale.set(2.3, 0.8, 1);
    this.staff1Group.add(this.staff1Badge);

    this.staff2Group = this.buildStaffActor('#FFEEE3');
    this.scene.add(this.staff1Group);
    this.scene.add(this.staff2Group);

    if (!this.isSoftwareGl) {
      this.renderer.compile(this.scene, this.camera);
    }

    this.startLoop();
  }

  private buildFloorSlab(): void {
    const slabGeo = new THREE.BoxGeometry(
      FLOOR_DIMENSIONS.width,
      FLOOR_DIMENSIONS.height,
      FLOOR_DIMENSIONS.depth
    );
    const slabMat = new THREE.MeshStandardMaterial({
      color: '#180B06',
      roughness: 0.85,
      metalness: 0.08,
    });
    const slab = new THREE.Mesh(slabGeo, slabMat);
    slab.position.set(0, -FLOOR_DIMENSIONS.height / 2, 0);
    this.scene.add(slab);

    // Perimeter hairline wall segments
    const wallEdges = new THREE.EdgesGeometry(
      new THREE.BoxGeometry(FLOOR_DIMENSIONS.width - 0.4, 0.6, FLOOR_DIMENSIONS.depth - 0.4)
    );
    const wallMat = new THREE.LineBasicMaterial({
      color: '#F7F2ED',
      transparent: true,
      opacity: 0.22,
    });
    const wallLines = new THREE.LineSegments(wallEdges, wallMat);
    wallLines.position.set(0, 0.3, 0);
    this.scene.add(wallLines);
  }

  private buildZones(): void {
    const darkWoodMat = new THREE.MeshStandardMaterial({
      color: '#2A180D',
      roughness: 0.72,
      metalness: 0.1,
    });
    const creamTrimMat = new THREE.MeshStandardMaterial({
      color: '#F7F2ED',
      roughness: 0.4,
      metalness: 0.15,
    });
    const kitchenBodyMat = new THREE.MeshStandardMaterial({
      color: '#5C1C07',
      roughness: 0.65,
      metalness: 0.12,
    });

    // 1. Counter composite group (body + top ledge + espresso machine silhouette)
    const counterGroup = new THREE.Group();
    counterGroup.position.set(COUNTER_BLOCK.x, 0, COUNTER_BLOCK.z);
    const cBody = new THREE.Mesh(
      new THREE.BoxGeometry(COUNTER_BLOCK.width, COUNTER_BLOCK.height, COUNTER_BLOCK.depth),
      darkWoodMat
    );
    cBody.position.y = COUNTER_BLOCK.height / 2;
    const cStrip = new THREE.Mesh(
      new THREE.BoxGeometry(COUNTER_BLOCK.width + 0.08, 0.08, 0.18),
      creamTrimMat
    );
    cStrip.position.set(0, COUNTER_BLOCK.height + 0.04, COUNTER_BLOCK.depth / 2 - 0.1);
    const espresso = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.45, 0.7),
      new THREE.MeshStandardMaterial({ color: '#3E2414', roughness: 0.35, metalness: 0.45 })
    );
    espresso.position.set(-2.2, COUNTER_BLOCK.height + 0.22, 0);
    counterGroup.add(cBody, cStrip, espresso);
    this.scene.add(counterGroup);

    // 2. Reception composite group (desk + cream strip + reception terminal stand)
    const recGroup = new THREE.Group();
    recGroup.position.set(RECEPTION_BLOCK.x, 0, RECEPTION_BLOCK.z);
    const rBody = new THREE.Mesh(
      new THREE.BoxGeometry(RECEPTION_BLOCK.width, RECEPTION_BLOCK.height, RECEPTION_BLOCK.depth),
      darkWoodMat
    );
    rBody.position.y = RECEPTION_BLOCK.height / 2;
    const rStrip = new THREE.Mesh(
      new THREE.BoxGeometry(RECEPTION_BLOCK.width, 0.09, 0.22),
      creamTrimMat
    );
    rStrip.position.set(0, RECEPTION_BLOCK.height + 0.045, RECEPTION_BLOCK.depth / 2 - 0.12);
    const rScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.55, 0.08),
      new THREE.MeshStandardMaterial({
        color: '#F7F2ED',
        emissive: '#E8500C',
        emissiveIntensity: 0.25,
        roughness: 0.25,
      })
    );
    rScreen.position.set(0, RECEPTION_BLOCK.height + 0.32, 0.1);
    rScreen.rotation.x = -0.25;
    recGroup.add(rBody, rStrip, rScreen);
    this.scene.add(recGroup);

    // 3. Kitchen composite group (main pass + canopy hood + emissive orange pass strip)
    const kitGroup = new THREE.Group();
    kitGroup.position.set(KITCHEN_BLOCK.x, 0, KITCHEN_BLOCK.z);
    const kBody = new THREE.Mesh(
      new THREE.BoxGeometry(KITCHEN_BLOCK.width, KITCHEN_BLOCK.height, KITCHEN_BLOCK.depth),
      kitchenBodyMat
    );
    kBody.position.y = KITCHEN_BLOCK.height / 2;
    const kPass = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.14, KITCHEN_BLOCK.depth - 0.6),
      this.kitchenPassMat
    );
    kPass.position.set(-KITCHEN_BLOCK.width / 2 + 0.12, KITCHEN_BLOCK.height + 0.07, 0);
    const kHood = new THREE.Mesh(
      new THREE.BoxGeometry(KITCHEN_BLOCK.width - 0.4, 0.35, KITCHEN_BLOCK.depth - 1.2),
      darkWoodMat
    );
    kHood.position.set(0.1, KITCHEN_BLOCK.height + 0.85, 0);
    kitGroup.add(kBody, kPass, kHood);
    this.scene.add(kitGroup);
  }

  private buildTables(): void {
    const shadowGeo = new THREE.CircleGeometry(1.25, 24);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: '#080301',
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });

    const pedestalGeo = new THREE.CylinderGeometry(0.14, 0.26, 0.72, 12);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: '#1C0E07',
      roughness: 0.5,
      metalness: 0.3,
    });

    const chairSeatGeo = new THREE.BoxGeometry(0.46, 0.08, 0.46);
    const chairBackGeo = new THREE.BoxGeometry(0.46, 0.38, 0.08);
    const chairMat = new THREE.MeshStandardMaterial({
      color: '#382012',
      roughness: 0.78,
      metalness: 0.08,
    });

    const codeGeo = new THREE.BoxGeometry(0.38, 0.04, 0.38);
    const codeMat = new THREE.MeshBasicMaterial({
      map: this.qrPlaqueTex,
    });

    FLOOR_TABLES.forEach((tDef) => {
      const group = new THREE.Group();
      group.position.set(tDef.x, 0, tDef.z);

      // Contact shadow disc
      const shadow = new THREE.Mesh(shadowGeo, shadowMat);
      shadow.position.y = 0.015;
      group.add(shadow);

      // Pedestal base
      const ped = new THREE.Mesh(pedestalGeo, pedestalMat);
      ped.position.y = 0.36;
      group.add(ped);

      // Table top
      const topMat = new THREE.MeshStandardMaterial({
        color: tDef.id === 5 ? '#3D1D0E' : '#2A180D',
        emissive: '#E8500C',
        emissiveIntensity: tDef.id === 5 ? 0.35 : 0,
        roughness: 0.6,
        metalness: 0.12,
      });

      const topGeo =
        tDef.shape === 'round'
          ? new THREE.CylinderGeometry(0.9, 0.9, 0.1, 24)
          : new THREE.BoxGeometry(1.55, 0.1, 1.55);
      const topMesh = new THREE.Mesh(topGeo, topMat);
      topMesh.position.y = 0.74;
      group.add(topMesh);

      // Chairs around table
      const chairOffsets: [number, number, number][] =
        tDef.chairs === 2
          ? [
              [-1.15, 0, Math.PI / 2],
              [1.15, 0, -Math.PI / 2],
            ]
          : [
              [-1.15, 0, Math.PI / 2],
              [1.15, 0, -Math.PI / 2],
              [0, -1.15, 0],
              [0, 1.15, Math.PI],
            ];

      chairOffsets.forEach(([cx, cz, rotY]) => {
        const cGroup = new THREE.Group();
        cGroup.position.set(cx, 0, cz);
        cGroup.rotation.y = rotY;
        const seat = new THREE.Mesh(chairSeatGeo, chairMat);
        seat.position.y = 0.44;
        const back = new THREE.Mesh(chairBackGeo, chairMat);
        back.position.set(0, 0.65, -0.2);
        cGroup.add(seat, back);
        group.add(cGroup);
      });

      // QR Table code plaque with real QR pattern
      const codeMesh = new THREE.Mesh(codeGeo, codeMat);
      codeMesh.position.set(0.24, 0.81, 0.18);
      codeMesh.visible = tDef.id === 5;
      group.add(codeMesh);

      // Waiter call pulse ring
      const ringGeo = new THREE.RingGeometry(1.05, 1.25, 32);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: '#E8500C',
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.y = 0.04;
      group.add(ringMesh);

      // Status letter plane inside each table (never colour alone)
      const statusGeo = new THREE.PlaneGeometry(0.55, 0.55);
      statusGeo.rotateX(-Math.PI / 2);
      const statusMat = new THREE.MeshBasicMaterial({
        map: this.statusTextures.get('F') || null,
        transparent: true,
        depthWrite: false,
      });
      const statusPlane = new THREE.Mesh(statusGeo, statusMat);
      statusPlane.position.set(-0.22, 0.81, -0.15);
      group.add(statusPlane);

      // Two guest capsules on Table 5
      let guestGroup: THREE.Group | undefined;
      if (tDef.id === 5) {
        guestGroup = new THREE.Group();
        const guestMat = new THREE.MeshStandardMaterial({
          color: '#FBEFE6',
          roughness: 0.45,
          metalness: 0.1,
        });
        [-1.12, 1.12].forEach((gx) => {
          const gBody = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.36, 6, 12), guestMat);
          gBody.position.set(gx, 0.78, 0);
          guestGroup!.add(gBody);
        });
        group.add(guestGroup);
      }

      this.scene.add(group);
      this.tableRigs.set(tDef.id, {
        group,
        topMat,
        codeMesh,
        ringMesh,
        ringMat,
        guestGroup,
        statusPlane,
        statusMat,
        currentStatus: 'F',
      });
    });
  }

  private buildStaffActor(colorHex: string): THREE.Group {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.35,
      metalness: 0.15,
    });
    const apronMat = new THREE.MeshStandardMaterial({
      color: '#E8500C',
      roughness: 0.5,
      metalness: 0.1,
    });
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.48, 6, 12), mat);
    body.position.y = 0.52;
    const apron = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.24, 0.32, 12), apronMat);
    apron.position.y = 0.42;
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.36, 16).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: '#080301', transparent: true, opacity: 0.5, depthWrite: false })
    );
    shadow.position.y = 0.02;
    group.add(shadow, body, apron);
    return group;
  }

  private buildRouteLine(points: { x: number; z: number }[], colorHex: string): THREE.Line {
    const vecs = points.map((p) => new THREE.Vector3(p.x, 0.12, p.z));
    const curve = new THREE.CatmullRomCurve3(vecs);
    const sampled = curve.getPoints(24);
    const geo = new THREE.BufferGeometry().setFromPoints(sampled);
    const mat = new THREE.LineBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0,
    });
    return new THREE.Line(geo, mat);
  }

  private updateCameraTargetForAspect(preset: CameraPreset): void {
    this.currentCamPreset = preset;
    const camPreset = CAMERA_TARGETS[preset] || CAMERA_TARGETS.top;
    const refAspect = 1.35;
    const aspect = Math.max(0.65, this.camera.aspect || 1.35);
    const maxScale = preset === 'close-table-5' ? 1.15 : 1.32;
    const distScale = aspect < refAspect ? Math.min(maxScale, Math.sqrt(refAspect / aspect)) : 1;

    const lookX = camPreset.look[0];
    const lookY = camPreset.look[1];
    const lookZ = camPreset.look[2];

    const dx = camPreset.pos[0] - lookX;
    const dy = (camPreset.pos[1] - lookY) * distScale;
    const dz = (camPreset.pos[2] - lookZ) * distScale;

    this.targetCamPos.set(lookX + dx, lookY + dy, lookZ + dz);
    this.targetCamLook.set(lookX, lookY, lookZ);
  }

  public applyState(state: FloorSceneState): void {
    if (this.disposed) return;

    this.updateCameraTargetForAspect(state.camera);

    // Table 5 light & table states
    this.table5Light.intensity = state.table5Active ? 3.2 * state.floorDim : 0.4;
    this.kitchenPassMat.emissiveIntensity = (0.2 + state.kitchenGlow * 1.4) * state.floorDim;

    // Floating 3D Digital Menu Card + Scan Cone on Table 5 for Level 1 close-up
    const menuMat = this.table5MenuSprite.material as THREE.SpriteMaterial;
    const coneMat = this.table5ScanCone.material as THREE.MeshBasicMaterial;
    if (state.showTable5MenuCard) {
      menuMat.opacity = 0.98 * state.floorDim;
      coneMat.opacity = 0.36 * state.floorDim;
    } else {
      menuMat.opacity = 0;
      coneMat.opacity = 0;
    }

    // Scan line
    const scanMat = this.scanBeam.material as THREE.MeshBasicMaterial;
    if (state.scanLineProgress > 0 && state.scanLineProgress < 1) {
      scanMat.opacity = 0.9;
      this.scanBeam.position.z = 0.8 - 0.35 + state.scanLineProgress * 0.7;
    } else {
      scanMat.opacity = 0;
    }

    // Route lines
    (this.receptionLine.material as THREE.LineBasicMaterial).opacity = state.showReceptionRoute
      ? 0.75 * state.floorDim
      : 0;
    (this.kitchenLine.material as THREE.LineBasicMaterial).opacity = state.showKitchenRoute
      ? 0.9 * state.floorDim
      : 0;
    (this.waiterLine.material as THREE.LineBasicMaterial).opacity =
      state.waiterRingPulse > 0 ? 0.85 * state.floorDim : 0;

    // Continuous waiter walk inside WebGL loop when in Change Step 3 (Waiter called)
    this.autoWalkWaiter = state.table5Status === 'W' && state.windowMode === 'none';

    // Staff capsules + Waiter overhead badge
    this.staff1Group.position.set(state.staff1Pos.x, 0, state.staff1Pos.z);
    (this.staff1Badge.material as THREE.SpriteMaterial).opacity =
      state.waiterRingPulse > 0 ? 0.95 * state.floorDim : 0;
    this.staff2Group.position.set(state.staff2Pos.x, 0, state.staff2Pos.z);

    // Update each table rig
    this.tableRigs.forEach((rig, id) => {
      if (id === 5) {
        rig.codeMesh.visible = state.table5Active || state.showAllTableCodes;
        rig.topMat.emissiveIntensity = (state.table5Active ? 0.6 : 0.05) * state.floorDim;
        if (rig.guestGroup) {
          rig.guestGroup.visible = state.table5Active;
        }
        if (state.waiterRingPulse > 0 || state.showTable5MenuCard) {
          const pulseVal = state.waiterRingPulse > 0 ? state.waiterRingPulse : 0.45;
          rig.ringMat.opacity = (0.35 + pulseVal * 0.55) * state.floorDim;
          const s = 1 + pulseVal * 0.28;
          rig.ringMesh.scale.set(s, 1, s);
        } else {
          rig.ringMat.opacity = 0;
        }
        this.setRigStatus(rig, state.table5Status);
      } else {
        rig.codeMesh.visible = state.showAllTableCodes;
        const otherCode = state.otherTableStatuses[id] || 'F';
        this.setRigStatus(rig, otherCode);
        rig.topMat.emissiveIntensity = otherCode !== 'F' ? 0.18 * state.floorDim : 0;
      }
    });
  }

  private setRigStatus(rig: TableMeshRig, status: TableStatusCode): void {
    if (rig.currentStatus === status) return;
    rig.currentStatus = status;
    const tex = this.statusTextures.get(status);
    if (tex) {
      rig.statusMat.map = tex;
      rig.statusMat.needsUpdate = true;
    }
  }

  public setPaused(paused: boolean): void {
    if (this.paused === paused) return;
    this.paused = paused;
    if (!paused && !this.disposed) {
      this.lastTickTime = performance.now();
      this.startLoop();
    }
  }

  public resize(): void {
    if (this.disposed) return;
    const width = Math.max(260, this.container.clientWidth || 800);
    const height = Math.max(220, this.container.clientHeight || 500);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.updateCameraTargetForAspect(this.currentCamPreset);
    this.renderer.setSize(width, height);
  }

  private afterDraw(cb: () => void): void {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    if (gl && typeof gl.fenceSync === 'function') {
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (this.disposed || this.paused) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          this.frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          this.frameId = window.setTimeout(cb, 80);
        }
      };
      this.frameId = window.setTimeout(poll, 5);
    } else {
      this.frameId = window.setTimeout(cb, 80);
    }
  }

  private startLoop(): void {
    cancelAnimationFrame(this.frameId);
    clearTimeout(this.frameId);

    const tick = () => {
      if (this.disposed || this.paused) return;
      const now = performance.now();
      const dt = Math.min(0.1, (now - this.lastTickTime) / 1000);
      this.lastTickTime = now;

      if (this.autoWalkWaiter) {
        this.waiterWalkPhase = (this.waiterWalkPhase + dt * 0.32) % 1;
        const pos = samplePath2D(STAFF_PATHS.counterToTable5, this.waiterWalkPhase);
        this.staff1Group.position.set(pos.x, 0, pos.z);
        const rig5 = this.tableRigs.get(5);
        if (rig5) {
          const pulse = (Math.sin(now * 0.006) + 1) * 0.4 + 0.2;
          rig5.ringMat.opacity = 0.35 + pulse * 0.55;
          const s = 1 + pulse * 0.28;
          rig5.ringMesh.scale.set(s, 1, s);
        }
      }

      const dampFactor = 1 - Math.exp(-5.0 * dt);
      this.camera.position.lerp(this.targetCamPos, dampFactor);
      this.currentCamLook.lerp(this.targetCamLook, dampFactor);
      this.camera.lookAt(this.currentCamLook);

      this.renderer.render(this.scene, this.camera);

      if (this.isSoftwareGl) {
        this.afterDraw(tick);
      } else {
        this.frameId = requestAnimationFrame(tick);
      }
    };

    this.lastTickTime = performance.now();
    tick();
  }

  public dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    clearTimeout(this.frameId);
    this.statusTextures.forEach((tex) => tex.dispose());
    this.statusTextures.clear();
    this.qrPlaqueTex.dispose();
    this.table5MenuCardTex.dispose();
    this.waiterLabelTex.dispose();
    disposeScene(this.scene, this.renderer);
  }
}

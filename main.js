import * as THREE from 'three';

// --- 1. RECALIBRATED TEXTURE ---
function createServerTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#111111'; // Dark metal
    ctx.fillRect(0, 0, 256, 512);

    for (let i = 0; i < 25; i++) {
        const y = i * 20 + 10;
        ctx.fillStyle = '#050505'; // Slot
        ctx.fillRect(10, y, 236, 10);
        
        // Brighter LEDs
        ctx.fillStyle = Math.random() > 0.1 ? '#00ff66' : '#ff3300';
        ctx.fillRect(20, y + 2, 6, 6);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}
const serverTex = createServerTexture();

// --- 2. CORE SETUP ---
const UI_STATE = { view: 'GRID' };
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.autoClear = false;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// --- 3. SCENE 1: THE GRID ---
const sceneGrid = new THREE.Scene();
const cameraGrid = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
cameraGrid.position.set(40, 30, 40);
cameraGrid.lookAt(0, 0, 0);

// CRANK UP GLOBAL LIGHTS
sceneGrid.add(new THREE.AmbientLight(0xffffff, 3.0)); 
const sun = new THREE.DirectionalLight(0xffffff, 5.0);
sun.position.set(20, 50, 20);
sceneGrid.add(sun);

const gridGroup = new THREE.Group();
const rackMat = new THREE.MeshStandardMaterial({ 
    map: serverTex,
    emissive: new THREE.Color(0x222222), // This makes the racks visible in dark areas
    metalness: 0.8,
    roughness: 0.2
});

for(let x=-4; x<=4; x++) {
    for(let z=-4; z<=4; z++) {
        const rack = new THREE.Mesh(new THREE.BoxGeometry(2, 5, 2), rackMat);
        rack.position.set(x*8, 2.5, z*8);
        rack.name = `NODE_${Math.floor(Math.random()*899+100)}`;
        gridGroup.add(rack);
    }
}
sceneGrid.add(gridGroup);

// --- 4. SCENE 2: THE ISOLATION BOX ---
const sceneServer = new THREE.Scene();
const cameraServer = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
cameraServer.position.set(0, 4, 12);
cameraServer.lookAt(0, 4, 0);

// EXTREME SPOTLIGHT
const isoSpot = new THREE.SpotLight(0xffffff, 5000); // 5000 is huge, but needed for visibility
isoSpot.position.set(0, 15, 5); 
isoSpot.angle = Math.PI / 4;
sceneServer.add(isoSpot);

// SECONDARY FILL LIGHT
const isoFill = new THREE.PointLight(0xffffff, 1000);
isoFill.position.set(5, 5, 5);
sceneServer.add(isoFill);

const isoRack = new THREE.Mesh(
    new THREE.BoxGeometry(3, 8, 3), 
    new THREE.MeshStandardMaterial({ 
        map: serverTex, 
        emissive: new THREE.Color(0x111111), // Self-glow
        metalness: 0.9, 
        roughness: 0.1 
    })
);
isoRack.position.y = 4;
sceneServer.add(isoRack);
isoSpot.target = isoRack;

// --- 5. RENDER LOOP ---
function animate() {
    requestAnimationFrame(animate);
    
    renderer.setClearColor(0x020205, 1);
    renderer.clear();
    
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.render(sceneGrid, cameraGrid);

    if(UI_STATE.view === 'INSPECTOR') {
        const frame = document.getElementById('server-frame');
        const rect = frame.getBoundingClientRect();
        
        const width = rect.width;
        const height = rect.height;
        const left = rect.left;
        const bottom = window.innerHeight - rect.bottom;

        renderer.setScissorTest(true);
        renderer.setScissor(left, bottom, width, height);
        renderer.setViewport(left, bottom, width, height);
        
        // Clear the box area to PITCH BLACK
        renderer.setClearColor(0x000000, 1);
        renderer.clear(true, true, true);

        isoRack.rotation.y += 0.01;
        renderer.render(sceneServer, cameraServer);
        renderer.setScissorTest(false);
    }
}

// Raycaster and Event Listeners
window.onclick = (e) => {
    if(UI_STATE.view !== 'GRID') return;
    const mouse = new THREE.Vector2((e.clientX/window.innerWidth)*2-1, -(e.clientY/window.innerHeight)*2+1);
    const ray = new THREE.Raycaster();
    ray.setFromCamera(mouse, cameraGrid);
    const hits = ray.intersectObjects(gridGroup.children);
    if(hits.length > 0) toggleInspector(true, hits[0].object.name);
};

function toggleInspector(active, id) {
    UI_STATE.view = active ? 'INSPECTOR' : 'GRID';
    document.getElementById('ui-mask').style.display = active ? 'block' : 'none';
    document.getElementById('server-id-left').innerText = id;
    document.getElementById('server-id-right').innerText = id;
}

document.getElementById('close-btn').onclick = (e) => {
    e.stopPropagation();
    toggleInspector(false);
};

animate();
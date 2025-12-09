const canvas = document.getElementById('threejs-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
camera.position.set(0, 5, 10);
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
const controls = new THREE.OrbitControls(camera, canvas);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

let pencilHolder;

function createPencilHolder() {
    if (pencilHolder) scene.remove(pencilHolder);

    const n = parseInt(document.getElementById('num-cylinders').value);
    const d = parseFloat(document.getElementById('diameter').value);
    const w = parseFloat(document.getElementById('wall-thickness').value);
    const r_base = parseFloat(document.getElementById('base-radius').value);
    const r_top = parseFloat(document.getElementById('top-radius').value);
    const h = parseFloat(document.getElementById('height').value);
    const color = document.getElementById('color').value;

    // Create body
    const bodyGeometry = new THREE.CylinderGeometry(r_top, r_base, h, 32);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);

    // Create holes (visual representation)
    const holeRadius = d / 2;
    const angleStep = (2 * Math.PI) / n;
    for (let i = 0; i < n; i++) {
        const angle = i * angleStep;
        const x = (r_base - holeRadius - w) * Math.cos(angle);
        const z = (r_base - holeRadius - w) * Math.sin(angle);
        const holeGeometry = new THREE.CylinderGeometry(holeRadius, holeRadius, h + 0.1, 16);
        const hole = new THREE.Mesh(holeGeometry, new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3 }));
        hole.position.set(x, 0, z);
        body.add(hole);
    }

    pencilHolder = body;
    scene.add(pencilHolder);
}

createPencilHolder();

// Add event listeners to inputs
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', createPencilHolder);
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
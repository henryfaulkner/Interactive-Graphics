//let renderer, scene, camera, mesh;
let mesh;

container = document.createElement("div");
document.body.appendChild(container);

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 150);
let geometry = new THREE.SphereGeometry(80, 15, 15);
let material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
  vertexColors: true,
});
mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
let light = new THREE.SpotLight(0xff0000);
light.position.set(50, 50, 150);
scene.add(light);

container.addEventListener("mousemove", move);

function move(e) {
  mesh.rotation.x = e.pageX * 0.01;
  mesh.rotation.y = -e.pageX * 0.01;

  renderer.render(scene, camera);
}

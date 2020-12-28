var renderer, scene, camera, mesh;

var canvas = document.getElementById("canvas");
var width = document.getElementById("canvas").width();
var height = document.getElementById("canvas").height();
renderer = new THREE.WebGLRenderer();
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 150);
var geometry = new THREE.SphereGeometry(80, 15, 15);
var material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: false,
  vertexColors: true,
});
mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
var light = new THREE.SpotLight(0xff0000);
light.position.set(50, 50, 150);
scene.add(light);

canvas.addEventListener("mousemove", move);

function move(e) {
  mesh.rotation.x = e.pageX * 0.01;
  mesh.rotation.y = -e.pageX * 0.01;

  renderer.render(scene, camera);
}

let container, permalink, hex;
let camera, cameraTarget, scene, renderer;
let group, textMesh1, textMesh2, textGeo, materials;
let firstLetter = true;

let text = "Interactive Graphics",
  bevelEnabled = true,
  font = undefined,
  fontName = "optimer",
  fontWeight = "bold";

const height = 20,
  size = 70,
  hover = 30,
  curveSegments = 4,
  bevelThickness = 2,
  bevelSize = 1.5;

const mirror = true;

let targetRotation = 0;
let targetRotationOnPointerDown = 0;

let pointerX = 0;
let pointerXOnPointerDown = 0;

let windowHalfX = window.innerWidth / 2;

init();
animate();

function init() {
  container = document.createElement("div");
  permalink = document.createElement("a");
  permalink.id = "permalink";
  document.body.appendChild(container);
  document.body.appendChild(permalink);

  // Camera
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1500
  );
  camera.position.set(0, 400, 700);
  cameraTarget = new THREE.Vector3(0, 150, 0);

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0x000000, 250, 1400);

  // Lights
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.12);
  dirLight.position.set(0, 0, 1).normalize();
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(0xffffff, 1.5);
  pointLight.position.set(0, 100, 90);
  scene.add(pointLight);

  // Get Text
  createText();

  materials = [
    //front
    new THREE.MeshPhongMaterial({ color: 0xff0000 }), //, flatShading: true }),
    //side
    new THREE.MeshStandardMaterial({ color: 0xff0000 }),
  ];

  group = new THREE.Group();
  group.position.y = 100;

  scene.add(group);

  const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10000, 10000),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.5,
      transparent: true,
    })
  );
  plane.position.y = 100;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  //Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  //Events
  pointLight.color.setHSL(1, 1, 0.5);
  hex = decimalToHex(pointLight.color.getHex());

  container.style.touchAction = "none";
  container.addEventListener("pointerdown", onPointerDown, false);

  document.addEventListener("keypress", onDocumentKeyPress, false);
  document.addEventListener("keydown", onDocumentKeyDown, false);

  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function updatePermaLink() {
  const link = "#" + encodeURI(text);

  permalink.href = link;
  window.location.hash = link;
}

function onPointerDown(event) {
  if (event.isPrimary === false) return;

  pointerXOnPointerDown = event.clientX - windowHalfX;
  targetRotationOnPointerDown = targetRotation;

  document.addEventListener("pointermove", onPointerMove, false);
  document.addEventListener("pointerup", onPointerUp, false);
}

function onPointerMove(event) {
  if (event.isPrimary === false) return;

  pointerX = event.clientX - windowHalfX;

  targetRotation =
    targetRotationOnPointerDown + (pointerX - pointerXOnPointerDown) * 0.02;
}

function onPointerUp() {
  if (event.isPrimary === false) return;

  document.removeEventListener("pointermove", onPointerMove);
  document.removeEventListener("pointerup", onPointerUp);
}

function onDocumentKeyDown(event) {
  if (firstLetter) {
    firstLetter = false;
    text = "";
  }

  const keyCode = event.keyCode;

  // backspace
  if (keyCode == 8) {
    event.preventDefault();

    text = text.substring(0, text.length - 1);
    refreshText();

    return false;
  }
}

function onDocumentKeyPress(event) {
  const keyCode = event.which;

  // backspace
  if (keyCode == 8) {
    event.preventDefault();
  } else {
    const ch = String.fromCharCode(keyCode);
    text += ch;

    refreshText();
  }
}

function createText() {
  const loader = new THREE.FontLoader();

  loader.load("./fonts/optimer_bold.typeface.json", function (font) {
    console.log(text);
    textGeo = new THREE.TextGeometry(text, {
      font: font,

      size: size,
      height: height,
      curveSegments: curveSegments,

      bevelThickness: bevelThickness,
      bevelSize: bevelSize,
      bevelEnabled: bevelEnabled,
    });

    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();
    const triangle = new THREE.Triangle();

    if (!bevelEnabled) {
      const triangleAreaHeuristics = 0.1 * (height * size);

      for (let i = 0; i < textGeo.faces.length; i++) {
        const face = textGeo.faces[i];

        if (face.materialIndex == 1) {
          for (let j = 0; j < face.vertexNormals.length; j++) {
            face.vertexNormals[j].z = 0;
            face.vertexNormals[j].normalize();
          }

          const va = textGeo.vertices[face.a];
          const vb = textGeo.vertices[face.b];
          const vc = textGeo.vertices[face.c];

          const s = triangle.set(va, vb, vc).getArea();

          if (s > triangleAreaHeuristics) {
            for (let j = 0; j < face.vertexNormals.length; j++) {
              face.vertexNormals[j].copy(face.normal);
            }
          }
        }
      }
    }

    const centerOffset =
      -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

    textGeo = new THREE.BufferGeometry().fromGeometry(textGeo);

    textMesh1 = new THREE.Mesh(textGeo, materials);

    textMesh1.position.x = centerOffset;
    textMesh1.position.y = hover;
    textMesh1.position.z = 0;

    textMesh1.rotation.x = 0;
    textMesh1.rotation.y = Math.PI * 2;

    group.add(textMesh1);

    if (mirror) {
      textMesh2 = new THREE.Mesh(textGeo, materials);

      textMesh2.position.x = centerOffset;
      textMesh2.position.y = -hover;
      textMesh2.position.z = height;

      textMesh2.rotation.x = Math.PI;
      textMesh2.rotation.y = Math.PI * 2;

      group.add(textMesh2);
    }
  });
}

function refreshText() {
  updatePermaLink();

  group.remove(textMesh1);
  if (mirror) group.remove(textMesh2);

  if (!text) return;

  createText();
}

function animate() {
  requestAnimationFrame(animate);

  render();
  //stats.update();
}

function decimalToHex(d) {
  let hex = Number(d).toString(16);
  hex = "000000".substr(0, 6 - hex.length) + hex;
  return hex.toUpperCase();
}

function render() {
  group.rotation.y += (targetRotation - group.rotation.y) * 0.05;
  camera.lookAt(cameraTarget);
  renderer.clear();
  renderer.render(scene, camera);
}

function removeScene() {
  scene.remove.apply(scene, scene.children);
}

import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';

import vertexShader from './gl/vertexShader.vert';
import fragmentShader from './gl/fragmentShader.frag';

let time;
const particles = 300000;

class Test {
  constructor () {
    this.renderer = null;
    this.scene = null;
    this.controls = null;

    this.mouseTargetX = 0;
    this.mouseTargetY = 0;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.material = null;
    this.geometry = null;

    this.mesh = null;
    this.mouse = new THREE.Vector2(0.0, 0.0);

    this.camera = null;

    this.onResize = this.onResize.bind(this);
    this.onMouse = this.onMouse.bind(this);
  }

  init () {
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('#myCanvas')
    });

    this.scene = new THREE.Scene();

    this.renderer.setSize(this.width, this.height);

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      10000
    );
    this.camera.position.set(0, 20.0, 60.0);
    this.camera.lookAt(new THREE.Vector3()); // 中心を見るようにする

    this.controls = new OrbitControls(this.camera, this.renderer.domElement); // カメラをドラッグ操作させる
    this.controls.autoRotate = true; // 自動で回転をするようにする

    this.geometry = new THREE.BufferGeometry();

    let positions = [];
    let colors = [];
    let x, y, z;
    for (let i = 0; i < particles; i++) {
      x = Math.random() * 2.0 - 1.0;
      y = Math.random() * 2.0 - 1.0;
      z = Math.random() * 2.0 - 1.0;
      if (x * x + y * y + z * z <= 1) {
        positions.push(x * 500.0);
        positions.push(y * 10.0);
        positions.push(z * 500.0);
        colors.push(Math.random() * 255.0);
        colors.push(Math.random() * 255.0);
        colors.push(Math.random() * 255.0);
      }
    }
    let positionAttribute = new THREE.Float32BufferAttribute(positions, 3);

    console.log(positionAttribute);
    let colorAttribute = new THREE.Uint8BufferAttribute(colors, 3);

    console.log('colorAttribute 正規化前', colorAttribute);
    colorAttribute.normalized = true;

    console.log('colorAttribute', colorAttribute);

    // 位置情報と色情報をシェーダーに渡す
    this.geometry.addAttribute('position', positionAttribute);
    this.geometry.addAttribute('color', colorAttribute);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.01 },
        uMouse: {
          type: 'v2',
          value: this.mouse
        }
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      transparent: true
    });

    // メッシュを作成
    this.mesh = new THREE.Points(this.geometry, this.material);

    // 3D空間にメッシュを追加
    this.scene.add(this.mesh);

    this.renderer.render(this.scene, this.camera);

    this.onListener();
  }

  onListener () {
    window.addEventListener('resize', this.onResize);
    document.addEventListener('mousemove', this.onMouse);

    this.animate();
  }

  animate () {
    requestAnimationFrame(() => this.animate());
    this.render();
  }

  render () {
    time = performance.now();
    // this.material.uniforms.time.value = time;
    this.material.uniforms.uMouse.value = this.mouse;
    this.mesh.rotation.x = Math.cos((Math.PI * time * 0.1) / 360) * 0.05 + 0.1;
    this.mesh.rotation.y += Math.PI / 720;
    this.renderer.render(this.scene, this.camera);
  }

  onResize () {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height; // カメラのアスペクト比を変更
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
  }

  onMouse (e) {
    let halfX = this.width / 2;
    let halfY = this.height / 2;

    this.mouseTargetX = (halfX - e.clientX) / halfX;
    this.mouseTargetY = (halfY - e.clientY) / halfY;

    this.mouse = new THREE.Vector2(this.mouseTargetX, this.mouseTargetY);

    console.log(this.mouse);
  }
}

const test = new Test();

test.init();

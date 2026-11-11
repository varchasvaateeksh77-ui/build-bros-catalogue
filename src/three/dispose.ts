import * as THREE from 'three';

export function disposeScene(scene: THREE.Scene, renderer?: THREE.WebGLRenderer | null): void {
  scene.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((mat) => disposeMaterial(mat));
      } else {
        disposeMaterial(mesh.material);
      }
    }
  });
  scene.clear();
  if (renderer) {
    renderer.dispose();
  }
}

function disposeMaterial(mat: THREE.Material): void {
  const std = mat as THREE.MeshStandardMaterial;
  if (std.map) std.map.dispose();
  if (std.emissiveMap) std.emissiveMap.dispose();
  if (std.roughnessMap) std.roughnessMap.dispose();
  if (std.bumpMap) std.bumpMap.dispose();
  mat.dispose();
}

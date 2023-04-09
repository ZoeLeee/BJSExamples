import { Engine, Scene, ArcRotateCamera, Vector3, Color4, HemisphericLight, Scalar, MeshBuilder } from "@babylonjs/core";
import { AxesViewer } from "@babylonjs/core/Debug";
import { SceneLoader } from "@babylonjs/core/Loading";
import React, { useRef, useEffect } from "react";
import "@babylonjs/loaders/glTF";
import { AssetContainer } from "@babylonjs/core/assetContainer";
import { PointColor, PointsCloudSystem } from "@babylonjs/core/Particles";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { CreateBox } from "@babylonjs/core/Meshes";
import { Plane } from "@babylonjs/core/Maths/math.plane";


export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas!.parentElement!.clientWidth;
      canvas.height = canvas!.parentElement!.clientHeight;

      const engine = new Engine(canvas, true);
      const scene = new Scene(engine);
      // Create a new ArcRotateCamera object
      const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 1200, new Vector3(0, 0, 0), scene);
      // Attach the camera to the canvas
      camera.attachControl(canvas, true);
      // Set the target of the camera to the origin
      camera.setTarget(Vector3.Zero());

      const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

      new AxesViewer();

      // Set the background color of the scene
      scene.clearColor = new Color4(0, 0, 0, 1);


      scene.debugLayer.show({
        embedMode: true,
      });


      let model;

      const plane = new Plane(0, 1, 0, -800);

      let mtl;

      SceneLoader.ImportMesh("", "/models/", "seagulf.glb", scene, (meshes) => {
        // console.log('assets: ', assets);
        // assets.addAllToScene();

        const pcs = new PointsCloudSystem("pcs", 2, scene);

        model = meshes[0] as Mesh;
        // meshes[0].setEnabled(false);
        // model.setEnabled(false);


        model.position.x = -100;

        // pcs.initParticles = function () {
        //   const bb = pcs.mesh!.getBoundingInfo().boundingBox;
        //   let bbmin = bb.minimumWorld.y;

        //   for (let p = 0; p < pcs.nbParticles; p++) {
        //     pcs.particles[p].velocity = Vector3.Zero();
        //     let ay = (pcs.particles[p].position.y - bbmin) / 500;
        //     let ax = Scalar.RandomRange(-ay, ay);
        //     let az = Scalar.RandomRange(-ay, ay);
        //     pcs.particles[p].acceleration = new Vector3(0.25 * ax, 0.5 * Math.abs(ay) * (1 + Math.random()), 0.25 * az);
        //     let c = Scalar.RandomRange(0, 0.5);
        //     pcs.particles[p].color = new Color4(c, c, c, 1);
        //   }
        // };

        // pcs.updateParticle = function (particle) {
        //   particle.velocity.addInPlace(particle.acceleration);
        //   particle.position.addInPlace(particle.velocity);
        // };

        pcs.addSurfacePoints(meshes[1] as Mesh, 100000, PointColor.Color, 0);

        pcs.buildMeshAsync().then(() => {
          // pcs.mesh?.setEnabled(false);
        });

        // model.setEnabled(false);

        // assets.meshes.forEach((mesh) => {
        //   mesh.visibility = 0.1;
        // });
        meshes[1].renderingGroupId = 1;
        meshes[1].material!.clipPlane = plane;
        mtl = meshes[1].material;

      });

      // Run the render loop
      engine.runRenderLoop(() => {
        scene.render();
      });

      scene.onAfterRenderObservable.add(() => {
        if (plane.d >= 800) {
          if (model) {
            model.setEnabled(false);
          }
          return;
        }
        else {
          plane.d += 5;
        }
      });

      return () => {
        scene.dispose();
        engine.dispose();
      };
    }
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

export default App;

import { Engine, Scene, ArcRotateCamera, Vector3, Color4, HemisphericLight } from "@babylonjs/core";
import { AxesViewer } from "@babylonjs/core/Debug";
import { SceneLoader } from "@babylonjs/core/Loading";
import React, { useRef, useEffect } from "react";
import "@babylonjs/loaders/glTF";


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
      const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new Vector3(0, 0, 0), scene);
      // Attach the camera to the canvas
      camera.attachControl(canvas, true);
      // Set the target of the camera to the origin
      camera.setTarget(Vector3.Zero());

      const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

      new AxesViewer();

      // Set the background color of the scene
      scene.clearColor = new Color4(0, 0, 0, 1);

      SceneLoader.Append("/public/models/", "Xbot.glb", scene, function (scene) {

      });

      // Run the render loop
      engine.runRenderLoop(() => {
        scene.render();
      });
    }
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

export default App;

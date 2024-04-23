import { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { drawRect, getText } from "./utilities";
import { registerSW } from "virtual:pwa-register";
import "./App.css";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [history, setHistory] = useState([]);

  const updateSW = registerSW({
    onNeedRefresh() {
      const msg = "هناك تحديث جديد. هل تود اعادة تحميل الصفحة؟";
      if (confirm(msg)) updateSW(true);
    },
    onOfflineReady() {},
  });

  // Main function
  const runCoco = async () => {
    try {
      const net = await tf.loadGraphModel("/model.json");
      console.log("Model loaded successfully.");

      setInterval(() => {
        detect(net);
      }, 16.7);
    } catch (error) {
      console.error("Error loading the model:", error);
    }
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // 4. TODO - Make Detections
      const img = tf.browser.fromPixels(video);
      const resized = tf.image.resizeBilinear(img, [640, 480]);
      const casted = resized.cast("int32");
      const expanded = casted.expandDims(0);
      const obj = await net.executeAsync(expanded);

      const boxes = await obj[1].array();
      const classes = await obj[2].array();
      const scores = await obj[4].array();

      const ctx = canvasRef.current.getContext("2d");

      requestAnimationFrame(() => {
        // setHistory((prev) => {
        //   if (text !== prev[prev.length - 1]) return [...prev, text];
        //   else return prev;
        // });

        drawRect(
          boxes[0],
          classes[0],
          scores[0],
          0.8,
          videoWidth,
          videoHeight,
          ctx
        );
      });

      tf.dispose(img);
      tf.dispose(resized);
      tf.dispose(casted);
      tf.dispose(expanded);
      tf.dispose(obj);
    }
  };

  useEffect(() => {
    runCoco();
  }, []);

  return (
    <section className="wrapper">
      <header className="live-stream">
        <Webcam ref={webcamRef} muted={true} className="live-stream__camera" />

        <canvas ref={canvasRef} id="canvas" className="live-stream__canvas" />
      </header>
      <aside className="history">
        <h2>History</h2>
        <section className="history__words">
          {history.map((word, i) => (
            <p className="history__guessed-word" key={`word-${i}`}>
              {word}
            </p>
          ))}
        </section>
      </aside>
    </section>
  );
}

export default App;

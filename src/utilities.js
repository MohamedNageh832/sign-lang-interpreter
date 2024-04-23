// Define our labelmap
const labelMap = {
  1: { name: "Hello", color: "red" },
  2: { name: "Thank You", color: "yellow" },
  3: { name: "I Love You", color: "lime" },
  4: { name: "Yes", color: "blue" },
  5: { name: "No", color: "purple" },
};

// Define a drawing function
const drawRect = (boxes, text, scores, threshold, imgWidth, imgHeight, ctx) => {
  const bestGuess = scores.sort((a, b) => b - a)[0];

  if (!bestGuess < threshold) return;

  // Extract variables
  const [y, x, height, width] = boxes[i];

  ctx.strokeStyle = labelMap[text]["color"];
  ctx.lineWidth = 4;
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";

  ctx.beginPath();
  ctx.fillText(
    labelMap[text]["name"] + " - " + Math.round(scores[i] * 100) / 100,
    x * imgWidth,
    y * imgHeight - 10
  );

  ctx.rect(
    x * imgWidth,
    y * imgHeight,
    (width * imgWidth) / 2,
    (height * imgHeight) / 1.5
  );

  ctx.stroke();
};

const getText = (classes) => {
  const bestGuess = classes.sort((a, b) => b - a)[0];

  return labelMap[bestGuess].name;
};

export { drawRect, getText };

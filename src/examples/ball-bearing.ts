// Ball Bearing
// A ball bearing is a type of rolling-element bearing that uses balls to maintain the separation between the bearing races.
// The primary purpose of a ball bearing is to reduce rotational friction and support radial and axial loads.

import { Plane, Scope } from "..";

// Define constants like ball diameter, inside diamter, overhange length, and thickness
const outsideDiameter = 1.625;
const sphereDia = 0.25;
const shaftDia = 0.75;
const overallThickness = 0.313;
const wallThickness = 0.1;
const overHangLength = 0.3;
const nBalls = 10;
const chainWidth = sphereDia / 2;
const chainThickness = sphereDia / 8;
const linkDiameter = sphereDia / 4;

const scope = new Scope();

const customPlane = new Plane({
  origin: {
    x: 0,
    y: 0,
    z: -overallThickness / 2,
  },
  xAxis: { x: 1, y: 0, z: 0 },
  yAxis: { x: 0, y: 1, z: 0 },
  zAxis: { x: 0, y: 0, z: 1 },
});

// Sketch the inside bearing piece
const insideWallSketch = scope
  .startSketchOn(customPlane)
  .circle({
    center: [0, 0],
    radius: shaftDia / 2 + wallThickness,
  })
  .hole(
    scope.sketch!.circle({
      center: [0, 0],
      radius: shaftDia / 2,
    })
  );

// Extrude the inside bearing piece
const insideWall = insideWallSketch.extrude(overallThickness);

// Create the sketch of one of the balls
const ballsSketch = scope
  .startSketchOn("XY")
  .startProfileAt([shaftDia / 2 + wallThickness, 0.001])
  .arc({
    angleEnd: 0,
    angleStart: 180,
    radius: sphereDia / 2,
  })
  .close();

// Revolve the ball to make a sphere and pattern around the inside wall
const balls = ballsSketch.revolve({ axis: "X" }).patternCircular3d({
  arcDegrees: 360,
  axis: [0, 0, 1],
  center: [0, 0, 0],
  instances: nBalls,
  rotateDuplicates: true,
});

// Create the sketch for the chain around the balls
const chainSketch = scope
  .startSketchOn("XY")
  .startProfileAt([
    shaftDia / 2 + wallThickness + sphereDia / 2 - chainWidth / 2,
    0.125 * Math.sin((60 * Math.PI) / 180),
  ])
  .arc({
    angleEnd: 60,
    angleStart: 120,
    radius: sphereDia / 2,
  })
  .line([0, chainThickness])
  .line([-chainWidth, 0])
  .close();

// Revolve the chain sketch
const chainHead = chainSketch.revolve({ axis: "X" }).patternCircular3d({
  arcDegrees: 360,
  axis: [0, 0, 1],
  center: [0, 0, 0],
  instances: nBalls,
  rotateDuplicates: true,
});

// Create the sketch for the links in between the chains
const linkSketch = scope.startSketchOn("XZ").circle({
  center: [shaftDia / 2 + wallThickness + sphereDia / 2, 0],
  radius: linkDiameter / 2,
});

// Revolve the link sketch
const linkRevolve = linkSketch
  .revolve({ axis: "Y", angle: 360 / nBalls })
  .patternCircular3d({
    arcDegrees: 360,
    axis: [0, 0, 1],
    center: [0, 0, 0],
    instances: nBalls,
    rotateDuplicates: true,
  });

// Create the sketch for the outside walls
const outsideWallSketch = scope
  .startSketchOn(customPlane)
  .circle({
    center: [0, 0],
    radius: outsideDiameter / 2,
  })
  .hole(
    scope.sketch!.circle({
      center: [0, 0],
      radius: shaftDia / 2 + wallThickness + sphereDia,
    })
  );

const outsideWall = outsideWallSketch.extrude(overallThickness);

// https://www.mcmaster.com/60355K185/

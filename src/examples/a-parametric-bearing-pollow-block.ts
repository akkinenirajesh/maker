// A Parametric Bearing Pillow Block
// A bearing pillow block, also known as a plummer block or pillow block bearing, is a pedestal used to provide support for a rotating shaft with the help of compatible bearings and various accessories. Housing a bearing, the pillow block provides a secure and stable foundation that allows the shaft to rotate smoothly within its machinery setup. These components are essential in a wide range of mechanical systems and machinery, playing a key role in reducing friction and supporting radial and axial loads.

import { Plane, Scope } from "..";

// Define constants such as length, width, height, counter-bore depth and diameter, bearing diameter, hole location padding, and more
var length = 6;
var width = 4;
var height = 1;
var cbDepth = 0.25;
var cbDia = 0.7;
var holeDia = 0.375;
var padding = 1.5;
var bearingDia = 3;

const scope = new Scope();
// (Needs to be updated). Sketch the block and extrude up to where the counterbore diameter starts.
var block = scope
  .startSketchOn("XY")
  .startProfileAt([-width / 2, -length / 2])
  .lineTo([width / 2, -length / 2])
  .lineTo([width / 2, length / 2])
  .lineTo([-width / 2, length / 2])
  .close()
  .hole(
    scope.sketch!.circle({
      center: [-(width / 2 - padding / 2), -(length / 2 - padding / 2)],
      radius: holeDia / 2,
    })
  )
  .hole(
    scope.sketch!.circle({
      center: [-(width / 2 - padding / 2), length / 2 - padding / 2],
      radius: holeDia / 2,
    })
  )
  .hole(
    scope.sketch!.circle({
      center: [width / 2 - padding / 2, length / 2 - padding / 2],
      radius: holeDia / 2,
    })
  )
  .hole(
    scope.sketch!.circle({
      center: [width / 2 - padding / 2, -(length / 2 - padding / 2)],
      radius: holeDia / 2,
    })
  )
  .hole(
    scope.sketch!.circle({
      center: [0, 0],
      radius: bearingDia / 2,
    })
  )
  .extrude(height - cbDepth);

// Create a second sketch that creates the counterbore diameters and extrude the rest of the way to get the total height. Note: You cannot use startSketchOn(block, 'end'). The extrude lives outside the bounds, and the engine will not execute. This is a known issue.
var secondHalf = scope
  .startSketchOn(
    new Plane({
      origin: { x: 0, y: 0, z: height - cbDepth },
      xAxis: { x: 1, y: 0, z: 0 },
      yAxis: { x: 0, y: 1, z: 0 },
      zAxis: { x: 0, y: 0, z: 1 },
    })
  )
  .startProfileAt([-width / 2, -length / 2])
  .lineTo([width / 2, -length / 2])
  .lineTo([width / 2, length / 2])
  .lineTo([-width / 2, length / 2])
  .close()
  .hole(
    scope.sketch!.circle({
      center: [-(width / 2 - padding / 2), -(length / 2 - padding / 2)],
      radius: cbDia / 2,
    })
  )
  .hole(
    scope.sketch!.circle({
      center: [-(width / 2 - padding / 2), length / 2 - padding / 2],
      radius: cbDia / 2,
    })
  )
  .hole(
    scope.sketch!.circle({
      center: [width / 2 - padding / 2, length / 2 - padding / 2],
      radius: cbDia / 2,
    })
  )
  .hole(
    scope.sketch!.circle({
      center: [width / 2 - padding / 2, -(length / 2 - padding / 2)],
      radius: cbDia / 2,
    })
  )
  .hole(
    scope.sketch!.circle({
      center: [0, 0],
      radius: bearingDia / 2,
    })
  )
  .extrude(cbDepth);

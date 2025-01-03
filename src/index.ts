import { generateUUID } from "three/src/math/MathUtils";
import Three from "three";

type Point3d =
  | {
      x: number;
      y: number;
      z: number;
    }
  | [number, number, number];
type PlaneType = "XY" | "YZ" | "XZ";

type AppearanceData = {
  color: string;
  metalness: number;
  roughness: number;
};

type ChamferData = {
  length: number;
  tags: Record<string, object>;
};

type FilletData = {
  radius: number;
  tags: Record<string, object>;
  tolerance: number;
};

type HelixData = {
  revolutions: number;
  angleStart: number;
  ccw: boolean;
  length: number;
};

type CircularPattern3dData = {
  instances: number; // The number of total instances. Must be greater than or equal to 1. This includes the original entity. For example, if instances is 2, there will be two copies -- the original, and one new copy. If instances is 1, this has no effect.
  axis: [number, number, number]; // The axis around which to make the pattern. This is a 3D vector.
  center: [number, number, number]; // The center about which to make the pattern. This is a 3D vector.
  arcDegrees: number; // The arc angle (in degrees) to place the repetitions. Must be greater than 0.
  rotateDuplicates: boolean; // Whether or not to rotate the duplicates as they are copied.
};

type LinearPattern3dData = {
  instances: number;
  distance: number;
  axis: [number, number, number];
};

type Transform = {
  translate: [number, number, number];
  replicate: boolean;
  scale: [number, number, number];
  rotate: {
    axis: [number, number, number];
    angle: number;
    origin: "local" | "global" | [number, number, number];
  };
};
type PolygonData = {
  radius: number;
  noSides: number;
  center: [number, number];
  inscribed: boolean;
};

type ShellData = {
  thinkness: number;
  faces: FaceTag[];
};
interface SketchOrSurface {
  polygon(data: PolygonData, tag: string): Sketch;
}
class Solid {
  type: "solid";
  value: ExtrudeSurface[] = [];
  sketch: Sketch;
  height: number;
  startCapId: string;
  endCapId: string;
  edgeCuts: EdgeCut[] = [];
  constructor(
    sketch: Sketch,
    height: number,
    startCapId: string,
    endCapId: string,
    edgeCuts: EdgeCut[]
  ) {
    this.sketch = sketch;
    this.height = height;
    this.startCapId = startCapId;
    this.endCapId = endCapId;
    this.edgeCuts = edgeCuts;
    this.type = "solid";
  }
  appearance(data: AppearanceData): Solid {
    throw "Not implemented";
  }
  chamfer(data: ChamferData, tag: string): Solid {
    throw "Not implemented";
  }
  fillet(data: FilletData, tag: string): Solid {
    throw "Not implemented";
  }
  helix(data: HelixData): Solid {
    throw "Not implemented";
  }
  hollow(thickness: number): Solid {
    throw "Not implemented";
  }
  patternCircular3d(data: CircularPattern3dData): Solid[] {
    throw "Not implemented";
  }
  patternLinear3d(data: LinearPattern3dData): Solid[] {
    throw "Not implemented";
  }
  patternTransform(
    totalInstances: number,
    fn: (i: number) => Transform
  ): Solid[] {
    throw "Not implemented";
  }
  shell(data: ShellData): Solid {
    throw "Not implemented";
  }
}

abstract class SketchSurface implements SketchOrSurface {
  abstract startProfileAt(
    to: [number, number],
    sketchSurface?: SketchSurface,
    tag?: string
  ): Sketch;
  abstract polygon(data: PolygonData, tag?: string): Sketch;
  abstract circle(data: CircleData, tag?: string): Sketch;
}
class Face extends SketchSurface {
  type: "face";
  id: string;
  value: string;
  xAxis: Point3d;
  yAxis: Point3d;
  zAxis: Point3d;
  solid: Solid;
  constructor(
    id: string,
    value: string,
    xAxis: Point3d,
    yAxis: Point3d,
    zAxis: Point3d,
    solid: Solid
  ) {
    super();
    this.id = id;
    this.value = value;
    this.xAxis = xAxis;
    this.yAxis = yAxis;
    this.zAxis = zAxis;
    this.solid = solid;
    this.type = "face";
  }

  startProfileAt(
    to: [number, number],
    sketchSurface?: SketchSurface,
    tag?: string
  ): Sketch {
    throw "Not implemented";
  }

  polygon(data: PolygonData, tag?: string): Sketch {
    throw "Not implemented";
  }

  circle(data: CircleData, tag?: string): Sketch {
    throw "Not implemented";
  }
}

export class Plane extends SketchSurface {
  type: "plane";
  id: string;
  custom: boolean;
  origin: Point3d;
  xAxis: Point3d;
  yAxis: Point3d;
  zAxis: Point3d;
  constructor(data: {
    origin: Point3d;
    xAxis: Point3d;
    yAxis: Point3d;
    zAxis: Point3d;
  }) {
    super();
    this.id = generateUUID();
    this.custom = true;
    this.origin = data.origin;
    this.xAxis = data.xAxis;
    this.yAxis = data.yAxis;
    this.zAxis = data.zAxis;
    this.type = "plane";
  }

  startProfileAt(
    to: [number, number],
    sketchSurface?: SketchSurface,
    tag?: string
  ): Sketch {
    throw "Not implemented";
  }

  polygon(data: PolygonData, tag?: string): Sketch {
    throw "Not implemented";
  }

  circle(data: CircleData, tag?: string): Sketch {
    throw "Not implemented";
  }
}
class BasePath {
  id: string;
  from: [number, number];
  to: [number, number];
  tag?: string;
  constructor(
    id: string,
    from: [number, number],
    to: [number, number],
    tag?: string
  ) {
    this.id = id;
    this.from = from;
    this.to = to;
    this.tag = tag;
  }
}

class ToPoint extends BasePath {
  type: "ToPoint" = "ToPoint";
  constructor(
    id: string,
    from: [number, number],
    to: [number, number],
    tag?: string
  ) {
    super(id, from, to, tag);
  }
}

class TangentialArcTo extends BasePath {
  type: "TangentialArcTo" = "TangentialArcTo";
  center: [number, number];
  ccw: boolean;
  constructor(
    id: string,
    from: [number, number],
    to: [number, number],
    tag: string,
    center: [number, number],
    ccw: boolean
  ) {
    super(id, from, to, tag);
    this.center = center;
    this.ccw = ccw;
  }
}

class TangentialArc extends BasePath {
  type: "TangentialArc" = "TangentialArc";
  center: [number, number];
  ccw: boolean;
  constructor(
    id: string,
    from: [number, number],
    to: [number, number],
    tag: string,
    center: [number, number],
    ccw: boolean
  ) {
    super(id, from, to, tag);
    this.center = center;
    this.ccw = ccw;
  }
}

class Circle extends BasePath {
  type: "Circle" = "Circle";
  center: [number, number];
  ccw: boolean;
  constructor(
    id: string,
    from: [number, number],
    to: [number, number],
    tag: string,
    center: [number, number],
    ccw: boolean
  ) {
    super(id, from, to, tag);
    this.center = center;
    this.ccw = ccw;
  }
}

class Horizontal extends BasePath {
  type: "Horizontal" = "Horizontal";
  x: number;
  constructor(
    id: string,
    from: [number, number],
    to: [number, number],
    tag: string,
    x: number
  ) {
    super(id, from, to, tag);
    this.x = x;
  }
}

class AngledLineTo extends BasePath {
  type: "AngledLineTo" = "AngledLineTo";
  x: number;
  y: number;
  constructor(
    id: string,
    from: [number, number],
    to: [number, number],
    tag: string,
    x: number,
    y: number
  ) {
    super(id, from, to, tag);
    this.x = x;
    this.y = y;
  }
}

class Arc extends BasePath {
  type: "arc" = "arc";
  center: [number, number];
  radius: number;
  ccw: boolean;
  constructor(
    id: string,
    from: [number, number],
    to: [number, number],
    tag: string,
    center: [number, number],
    radius: number,
    ccw: boolean
  ) {
    super(id, from, to, tag);
    this.center = center;
    this.radius = radius;
    this.ccw = ccw;
  }
}

type CircleData = {
  center: [number, number];
  radius: number;
};

type AngledLineData = {
  angle: number;
  length: number;
};
type AngledLineThatIntersectsData = {
  angle: number;
  intersectTag: string;
  offset: number;
};
type AngledLineToData = {
  angle: number;
  to: number;
};

type ArcData =
  | {
      angleStart: number;
      angleEnd: number;
      radius: number;
    }
  | {
      center: [number, number];
      to: [number, number];
      radius: number;
    };
type ArcToData = {
  end: [number, number];
  interior: [number, number];
};
type BezierData = {
  to: [number, number];
  control1: [number, number];
  control2: [number, number];
};

type Mirror2dData = {
  axis: AxisOrEdgeReference;
};
type CircularPattern2dData = {
  instances: number;
  center: [number, number];
  arcDegrees: number;
  rotateDuplicates: boolean;
};

type LinearPattern2dData = {
  instances: number;
  distance: number;
  axis: [number, number];
};

type RevolveData = {
  angle?: number;
  axis: AxisOrEdgeReference;
  tolerance?: number;
};

type SweepData = {
  path: Sketch;
  sectional: boolean;
  tolerance: number;
};

type TangentialArcData = {
  radius: number;
  offset: number;
};

type AxisOrEdgeReference = AxisAndOrigin | EdgeReference;
type AxisAndOrigin = "X" | "Y" | "Z" | "-X" | "-Y";
type EdgeReference = string;
type Path =
  | ToPoint
  | TangentialArcTo
  | TangentialArc
  | Circle
  | Horizontal
  | AngledLineTo
  | BasePath
  | Arc;

class Sketch implements SketchOrSurface {
  id: string;
  paths: Path[];
  on: SketchSurface;
  start: Path;
  scope: Scope;
  closed: boolean = false;
  constructor(
    id: string,
    paths: Path[],
    on: SketchSurface,
    start: Path,
    scope: Scope
  ) {
    this.id = id;
    this.paths = paths;
    this.on = on;
    this.start = start;
    this.scope = scope;
  }

  angledLine(data: AngledLineData, tag?: string): Sketch {
    throw "Not implemented";
  }
  angledLineOfXLength(data: AngledLineData, tag?: string): Sketch {
    throw "Not implemented";
  }
  angledLineOfYLength(data: AngledLineData, tag?: string): Sketch {
    throw "Not implemented";
  }
  angledLineThatIntersects(
    data: AngledLineThatIntersectsData,
    tag?: string
  ): Sketch {
    throw "Not implemented";
  }
  angledLineToX(data: AngledLineToData, tag?: string): Sketch {
    throw "Not implemented";
  }
  angledLineToY(data: AngledLineToData, tag?: string): Sketch {
    throw "Not implemented";
  }
  angleToMatchLengthX(tag: string, to: number): number {
    throw "Not implemented";
  }
  angleToMatchLengthY(tag: string, to: number): number {
    throw "Not implemented";
  }

  arc(data: ArcData, tag?: string): Sketch {
    throw "Not implemented";
  }
  arcTo(data: ArcToData, tag?: string): Sketch {
    throw "Not implemented";
  }
  bezierCurve(data: BezierData, tag: string): Sketch {
    throw "Not implemented";
  }

  circle(data: CircleData, ccw: boolean = false, tag?: string): Sketch {
    throw "Not implemented";
  }
  line(delta: number[], tag?: string): Sketch {
    const id = generateUUID();
    const from = [this.lastSegX(), this.lastSegY()] as [number, number];
    const to = [from[0] + delta[0], from[1] + delta[1]] as [number, number];
    const path = new ToPoint(id, from, to, tag);
    this.paths.push(path);
    if (tag) {
      this.scope.add(tag, path);
    }
    return this;
  }
  lineTo(to: [number, number], tag?: string): Sketch {
    const id = generateUUID();
    const from = [this.lastSegX(), this.lastSegY()] as [number, number];
    const path = new ToPoint(id, from, to, tag);
    this.paths.push(path);
    if (tag) {
      this.scope.add(tag, path);
    }
    return this;
  }
  close(tag?: string): Sketch {
    const id = generateUUID();
    const from = [this.lastSegX(), this.lastSegY()] as [number, number];
    const to = [this.paths[0].from[0], this.paths[0].from[1]] as [
      number,
      number
    ];
    const path = new ToPoint(id, from, to, tag);
    this.paths.push(path);
    this.closed = true;
    if (tag) {
      this.scope.add(tag, path);
    }
    return this;
  }
  extrude(length: number, tag?: string): Solid {
    const edgeCuts: EdgeCut[] = [];
    const solid = new Solid(
      this,
      length,
      generateUUID(),
      generateUUID(),
      edgeCuts
    );
    this.scope.solid = solid;
    if (tag) {
      this.scope.add(tag, solid);
    }
    return solid;
  }

  getNextAdjacentEdge(tag: string): string {
    throw "Not implemented";
  }
  getPreviousAdjacentEdge(tag: string): string {
    throw "Not implemented";
  }
  getOppositeEdge(tag: string): string {
    throw "Not implemented";
  }
  hole(sketch: Sketch): Sketch {
    throw "Not implemented";
  }
  lastSegX(): number {
    throw "Not implemented";
  }
  lastSegY(): number {
    throw "Not implemented";
  }
  legAngX(hypotenuse: number, leg: number): number {
    throw "Not implemented";
  }
  legAngY(hypotenuse: number, leg: number): number {
    throw "Not implemented";
  }
  legLen(hypotenuse: number, leg: number): number {
    throw "Not implemented";
  }
  mirror2d(data: Mirror2dData): Sketch {
    throw "Not implemented";
  }
  patternCircular2d(data: CircularPattern2dData): Sketch[] {
    throw "Not implemented";
  }
  patternLinear2d(data: LinearPattern2dData): Sketch[] {
    throw "Not implemented";
  }
  patternTransform(
    totalInstances: number,
    fn: (i: number) => Transform
  ): Sketch[] {
    throw "Not implemented";
  }
  polygon(data: PolygonData, tag: string): Sketch {
    throw "Not implemented";
  }
  profileStart(): [number, number] {
    throw "Not implemented";
  }
  profileStartX(): number {
    throw "Not implemented";
  }
  profileStartY(): number {
    throw "Not implemented";
  }
  revolve(data: RevolveData): Solid {
    throw "Not implemented";
  }
  sweep(data: SweepData): Solid {
    throw "Not implemented";
  }
  tangentialArc(data: TangentialArcData, tag?: string): Sketch {
    throw "Not implemented";
  }
  tangentialArcTo(to: [number], tag?: string): Sketch {
    throw "Not implemented";
  }
  tangentialArcToRelative(delta: [number], tag?: string): Sketch {
    throw "Not implemented";
  }
  xLine(length: number, tag?: string): Sketch {
    throw "Not implemented";
  }
  xLineTo(to: number, tag?: string): Sketch {
    throw "Not implemented";
  }
  yLine(length: number, tag?: string): Sketch {
    throw "Not implemented";
  }
  yLineTo(to: number, tag?: string): Sketch {
    throw "Not implemented";
  }
}

type ExtrudeSurface = {
  type: "extrudePlane" | "extrudeArc" | "chamfer" | "fillet";
  id: string;
  faceId: string;
  tag: string;
};
type Fillet = {
  type: "fillet";
  id: string;
  radius: number;
  edgeId: string;
  tag: string;
};
type Chamfer = {
  type: "chamfer";
  id: string;
  length: number;
  edgeId: string;
  tag: string;
};
type EdgeCut = Fillet | Chamfer;

type StandardPlane = "XY" | "YZ" | "XZ";
export class Scope {
  tags: Record<string, object> = {};
  sketch?: Sketch;
  solid?: Solid;
  constructor() {}

  add(tag: string, path: object) {
    this.tags[tag] = path;
  }

  startSketchOn(data: SketchData, tag?: FaceTag): SketchSurface {
    throw "Not implemented";
  }

  loft(
    sketches: Sketch[],
    vDegree: number,
    bezApproximateRational: boolean,
    baseCurveIndex: boolean,
    tolerance: number
  ): Solid {
    throw "Not implemented";
  }

  offsetPlane(stdPlane: StandardPlane, offset: number): Plane {
    throw "Not implemented";
  }
  polar(data: { angle: number; length: number }): number {
    throw "Not implemented";
  }

  tangentToEnd(tag: string): number {
    throw "Not implemented";
  }
}
type SketchData = PlaneType | Plane | Solid;
type FaceTag = StartOrEnd | string;
type StartOrEnd = "start" | "end";

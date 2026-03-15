# Bodies Factory, Composites & Geometry

## Bodies Factory (Bodies.js)

### Bodies.rectangle(x, y, width, height, options)

Creates rectangular body. Supports `options.chamfer`.

### Bodies.circle(x, y, radius, options, maxSides)

Creates circular body (approximated as polygon for SAT).

- `maxSides` default: 25
- Actual sides: 10-25 based on radius, always even (SAT axis optimization)
- Sets `body.circleRadius`

### Bodies.polygon(x, y, sides, radius, options)

Creates regular polygon.

- `sides` must be >= 3 (falls back to circle if < 3)
- `radius`: distance from center to vertices
- Supports `options.chamfer`

### Bodies.trapezoid(x, y, width, height, slope, options)

Creates trapezoid.

- `slope`: fraction of width (must be < 1)
- Supports `options.chamfer`

### Bodies.fromVertices(x, y, vertexSets, options, flagInternal, removeCollinear, minimumArea, removeDuplicatePoints)

Creates body from custom vertices (supports concave shapes).

- `vertexSets`: single array or array of arrays of `{x, y}` points
- `flagInternal`: mark internal edges with `isInternal` flag (default false)
- `removeCollinear`: simplify threshold (default 0.01)
- `minimumArea`: skip tiny parts (default 10)
- `removeDuplicatePoints`: dedup threshold (default 0.01)

**Concave handling**:

- With poly-decomp library: Bayazit quickDecomp → compound body
- Without poly-decomp: falls back to convex hull
- For convex shapes: uses clockwise sort directly

### Chamfer option

Available on rectangle, polygon, trapezoid:

```javascript
options.chamfer = {
  radius: 10, // corner rounding radius (number or array per vertex)
  quality: -1, // auto quality if -1, else manual
  qualityMin: 2, // minimum rounding points
  qualityMax: 14, // maximum rounding points
};
```

Auto quality formula: `pow(radius, 0.32) * 1.75`, always even (SAT optimization).

## Composite (Composite.js)

Hierarchical container for bodies, constraints, and nested composites.

### Composite.create(options)

```javascript
{
  id: <auto>,
  type: 'composite',
  label: 'Composite',
  parent: null,
  isModified: false,
  bodies: [],
  constraints: [],
  composites: [],
  plugin: {},
  cache: { allBodies: null, allConstraints: null, allComposites: null }
}
```

### Adding/Removing

**Composite.add(composite, object)** - Generic add (body, constraint, composite, or array)

- Fires `beforeAdd` / `afterAdd` events
- Skips compound body parts (warns to add parent instead)

**Composite.remove(composite, object, deep=false)** - Generic remove

- `deep=true`: recursive search in children
- Fires `beforeRemove` / `afterRemove` events
- Resets `sleepCounter` on removed bodies

**Composite.clear(composite, keepStatic=false, deep=false)**

- `keepStatic=true`: retains static bodies

### Recursive Queries (cached)

**Composite.allBodies(composite)** → all bodies in tree
**Composite.allConstraints(composite)** → all constraints in tree
**Composite.allComposites(composite)** → all sub-composites in tree
**Composite.get(composite, id, type)** → find by ID and type

Cache invalidated when `isModified` flag set.

### Transformations

**Composite.translate(composite, translation, recursive=true)**

- Moves all bodies; does NOT impart velocity

**Composite.rotate(composite, rotation, point, recursive=true)**

- Rotates all bodies around point

**Composite.scale(composite, scaleX, scaleY, point, recursive=true)**

- Scales all bodies from point; updates physical properties

**Composite.move(compositeA, objects, compositeB)**

- Move objects between composites (remove + add)

**Composite.bounds(composite)** → union AABB of all bodies

### Cache Management

**Composite.setModified(composite, isModified, updateParents, updateChildren)**

- `updateParents=true`: marks all ancestors as modified
- `updateChildren=true`: recursively marks descendants

## Vertices (Vertices.js)

### Creation

**Vertices.create(points, body)** - From `{x, y}` array, adds `index`, `body`, `isInternal` per vertex
**Vertices.fromPath(path, body)** - Parses SVG-like: `"L x y L x y ..."`

### Measurements

**Vertices.centre(vertices)** → centroid (true center of mass)
**Vertices.mean(vertices)** → arithmetic mean of points
**Vertices.area(vertices, signed=false)** → polygon area (shoelace formula)
**Vertices.inertia(vertices, mass)** → moment of inertia: `(mass / 6) * (num / den)`

### Analysis

**Vertices.isConvex(vertices)** → `true`/`false`/`null` (cross product test)
**Vertices.hull(vertices)** → convex hull (Andrew's monotone chain)
**Vertices.clockwiseSort(vertices)** → in-place clockwise sort

### Transforms

**Vertices.translate(vertices, vector, scalar=1)** - Move vertices
**Vertices.rotate(vertices, angle, point)** - Rotate around point
**Vertices.scale(vertices, scaleX, scaleY, point)** - Scale from point
**Vertices.chamfer(vertices, radius, quality, qualityMin, qualityMax)** - Round corners

### Tests

**Vertices.contains(vertices, point)** → boolean (ray-casting algorithm)

## Bounds / AABB (Bounds.js)

```javascript
{ min: { x, y }, max: { x, y } }
```

**Bounds.create(vertices)** - Create from vertices
**Bounds.update(bounds, vertices, velocity)** - Recalculate, extend by velocity direction
**Bounds.contains(bounds, point)** → boolean
**Bounds.overlaps(boundsA, boundsB)** → boolean
**Bounds.translate(bounds, vector)** - Move in-place
**Bounds.shift(bounds, position)** - Reposition while maintaining size

## Axes (Axes.js)

Edge normals for SAT collision detection.

**Axes.fromVertices(vertices)** - Compute perpendicular normals for each edge, deduplicated by gradient
**Axes.rotate(axes, angle)** - Rotate all axes in-place

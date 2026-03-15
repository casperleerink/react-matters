# Collision Detection

## Overview

The collision pipeline has three phases:

1. **Broadphase** - Sweep-and-prune AABB rejection (Detector)
2. **Narrowphase** - SAT polygon intersection (Collision)
3. **Pair management** - Track collision lifecycle (Pairs)

## Broadphase: Detector.collisions(detector)

**Algorithm**: Sweep-and-prune on X-axis with AABB overlap test.

1. Sort all bodies by `bounds.min.x`
2. Nested loop (i, j where j > i):
   - **X-axis early exit**: if `bodyB.bounds.min.x > bodyA.bounds.max.x`, break inner loop
   - **Y-axis rejection**: skip if no Y overlap
   - **Static rejection**: skip if both static or both sleeping+static
   - **Filter check**: `Detector.canCollide(filterA, filterB)`
3. For compound bodies: test all part pairs (parts[1+] vs parts[1+])
4. Call `Collision.collides()` for surviving pairs

**Complexity**: O(n) best (spatially coherent), O(n^2) worst.

## Collision Filtering: Detector.canCollide(filterA, filterB)

```javascript
// Layer 1: Group check (priority)
if (filterA.group === filterB.group && filterA.group !== 0)
  return filterA.group > 0; // positive = collide, negative = ignore

// Layer 2: Bilateral category/mask check
return (
  (filterA.mask & filterB.category) !== 0 &&
  (filterB.mask & filterA.category) !== 0
);
```

**Defaults**: `category: 0x0001, mask: 0xFFFFFFFF, group: 0` (all collide with all).

**Usage patterns**:

- **Ignore specific pair**: put both in same negative group
- **Force collide pair**: put both in same positive group
- **Category system**: assign powers of 2 as categories, set masks to include/exclude

## Narrowphase: Collision.collides(bodyA, bodyB, pairs)

**Algorithm**: Separating Axis Theorem (SAT).

### Steps:

1. **Project both polygons onto bodyA's edge normals** (`_overlapAxes`):
   - For each axis: project all vertices via dot product
   - Find min/max projections per shape
   - Calculate overlap: `min(maxA - minB, maxB - minA)`
   - Track minimum overlap axis
   - **Early exit**: if overlap <= 0, no collision (separating axis found)

2. **Project both polygons onto bodyB's edge normals** (same logic)

3. **Choose minimum overlap** from both sets as collision normal

4. **Orient normal** from bodyA toward bodyB:

   ```
   if (normal . (bodyB.position - bodyA.position) < 0) flip normal
   ```

5. **Find support points** (contact points) via hill-climbing:
   - Find deepest vertex of bodyB along normal direction
   - Check if that vertex is contained inside bodyA's polygon
   - Find deepest vertex of bodyA along -normal
   - Check containment in bodyB
   - Return 1-2 contact points

### Collision object structure:

```javascript
{
  collided: boolean,
  bodyA: body,
  bodyB: body,
  parentA: bodyA.parent,     // for compound bodies
  parentB: bodyB.parent,
  depth: number,             // penetration magnitude
  normal: { x, y },         // collision normal (unit vector, A→B)
  tangent: { x, y },        // perpendicular to normal
  penetration: { x, y },    // normal * depth
  supports: [vertex, ...]   // 1-2 contact point vertices
}
```

### Hill-climbing support search (\_findSupports):

1. Compute `distance = normal . (bodyAPos - vertex)` for each vertex
2. Deepest vertex = minimum distance
3. Check neighbors (prev and next vertex in array)
4. Return deepest + best neighbor (defines contact edge)

### Vertex containment (Vertices.contains):

- Ray-casting algorithm to check if point is inside polygon

## Pair Management

### Pair structure:

```javascript
{
  id: string,                // 'A{minId}B{maxId}'
  bodyA: body,
  bodyB: body,
  collision: collision,
  contacts: [],              // indexed by vertex position
  activeContacts: [],        // currently active contacts
  isActive: boolean,
  confirmedActive: boolean,
  timeCreated: number,
  timeUpdated: number,
  separation: number,        // current penetration
  inverseMass: number,       // bodyA.inverseMass + bodyB.inverseMass
  friction: number,          // min(bodyA.friction, bodyB.friction)
  frictionStatic: number,    // max(bodyA.frictionStatic, bodyB.frictionStatic)
  restitution: number,       // max(bodyA.restitution, bodyB.restitution)
  slop: number,              // max(bodyA.slop, bodyB.slop)
  isSensor: boolean          // true if either body is sensor
}
```

### Pairs container:

```javascript
{
  table: {},                 // hash map: pairId → pair (O(1) lookup)
  list: [],                  // active pairs array
  collisionStart: [],        // new collisions this frame
  collisionActive: [],       // continuing collisions
  collisionEnd: []           // ended collisions
}
```

### Pair lifecycle:

1. **New collision** → `Pair.create()` → `collisionStart`
2. **Continuing collision** → `Pair.update()` → `collisionActive`
3. **Ended collision** → deactivate → `collisionEnd` (removed from table unless sleeping)

### Contact object:

```javascript
{
  vertex: vertex,            // the contact point
  normalImpulse: 0,          // cached impulse along normal
  tangentImpulse: 0          // cached impulse along tangent
}
```

Contact impulses persist across frames at the same contact point for warmstarting.

### Sensor pairs:

Created and tracked for event purposes but resolver skips them (no physical response).

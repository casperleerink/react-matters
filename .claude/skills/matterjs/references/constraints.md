# Constraints

## Constraint.create(options)

```javascript
{
  bodyA: null,                // first body (null = fixed world point)
  bodyB: null,                // second body (null = fixed world point)
  pointA: { x: 0, y: 0 },    // local offset from bodyA center (or world pos if no bodyA)
  pointB: { x: 0, y: 0 },    // local offset from bodyB center (or world pos if no bodyB)
  length: <auto>,             // rest distance (auto-calculated from initial positions)
  stiffness: <auto>,          // 1 if length > 0; 0.7 if length === 0
  damping: 0,                 // oscillation damping (0-1+)
  angularStiffness: 0,        // rotational stiffness (0 = free rotation, 1 = locked)
  angleA: <initial>,
  angleB: <initial>,
  label: 'Constraint',
  type: 'constraint',
  id: <auto>,
  plugin: {},
  render: {
    visible: true,
    lineWidth: 2,
    strokeStyle: '#ffffff',
    type: 'line',             // auto-selected: 'pin', 'spring', or 'line'
    anchors: true
  }
}
```

**Auto-length**: If `length` not specified, calculated from initial world-space distance between anchor points.

**Auto-stiffness**: `1` if length > 0 (rigid), `0.7` if length === 0 (pin joint).

**Render type auto-selection**:
- `length === 0 && stiffness > 0.1` → `'pin'`, anchors = false
- `stiffness < 0.9` → `'spring'`
- Otherwise → `'line'`, anchors = true

## Constraint Solving Algorithm (Gauss-Seidel)

### Execution in Engine.update (TWO passes):

**Pass 1** (before collision detection):
```
Constraint.preSolveAll(allBodies)    // apply warming
for i in range(constraintIterations):
  Constraint.solveAll(allConstraints, delta)
```

**Pass 2** (after position resolution):
```
Constraint.preSolveAll(allBodies)    // apply warming
for i in range(constraintIterations):
  Constraint.solveAll(allConstraints, delta)
Constraint.postSolveAll(allBodies)   // update geometry, dampen impulses
```

### Constraint.solveAll order:
1. Solve **fixed constraints** first (one body static or null)
2. Then solve **free constraints** (both bodies dynamic)

This order prevents cascading instability.

### Constraint.solve(constraint, timeScale)

**Step 1: Rotate anchor points** to match body rotation
```
Vector.rotate(pointA, bodyA.angle - constraint.angleA, pointA)
constraint.angleA = bodyA.angle
```

**Step 2: World-space positions**
```
pointAWorld = bodyA.position + pointA
pointBWorld = bodyB.position + pointB
delta = pointAWorld - pointBWorld
currentLength = magnitude(delta)
```

**Step 3: Distance error**
```
difference = (currentLength - constraint.length) / currentLength
```

**Step 4: Stiffness scaling**
```
// Rigid (stiffness >= 1 or length === 0):
effectiveStiffness = stiffness * timeScale

// Soft (stiffness < 1):
effectiveStiffness = stiffness * timeScale * timeScale  // quadratic = more stable
```

**Step 5: Corrective force**
```
force = delta * difference * effectiveStiffness
```

**Step 6: Mass distribution**
```
massTotal = bodyA.inverseMass + bodyB.inverseMass
share_A = bodyA.inverseMass / massTotal
share_B = bodyB.inverseMass / massTotal
// Static body (inverseMass=0) gets 0% of correction
```

**Step 7: Damping** (if damping > 0)
```
normal = normalize(delta)
relativeVelocity = (bodyB.position - bodyB.positionPrev) - (bodyA.position - bodyA.positionPrev)
normalVelocity = dot(normal, relativeVelocity)

bodyA.positionPrev -= damping * normal * normalVelocity * share_A
bodyB.positionPrev += damping * normal * normalVelocity * share_B
```

**Step 8: Apply corrections**
```
// Position correction
bodyA.position -= force * share_A
bodyB.position += force * share_B

// Store for warming
bodyA.constraintImpulse -= force * share_A
bodyB.constraintImpulse += force * share_B

// Torque (rotational constraint)
torque = cross(pointA, force) / resistanceTotal * _torqueDampen * inverseInertia * (1 - angularStiffness)
bodyA.angle -= torque
```

### Constraint Warming

**preSolveAll**: Apply 100% of cached impulse to body positions:
```
body.position += body.constraintImpulse
body.angle += body.constraintImpulse.angle
```

**postSolveAll**: After solving, dampen cached impulse:
```
body.constraintImpulse *= Constraint._warming  // *= 0.4
```

### Constants
- `Constraint._warming = 0.4` - impulse retention factor
- `Constraint._torqueDampen = 1` - torque application factor
- `Constraint._minLength = 0.000001` - prevent division by zero

## MouseConstraint

### MouseConstraint.create(engine, options)

Creates an interactive drag constraint.

**Internal constraint defaults**:
```javascript
{
  label: 'Mouse Constraint',
  pointA: mouse.position,    // tracks mouse
  pointB: { x: 0, y: 0 },
  length: 0.01,              // near-zero (essentially rigid)
  stiffness: 0.1,            // soft feel for dragging
  angularStiffness: 1,       // no rotation during drag
  render: { strokeStyle: '#90EE90', lineWidth: 3 }
}
```

**Properties**:
```javascript
{
  type: 'mouseConstraint',
  mouse: mouse,
  body: null,                // currently dragged body
  constraint: constraint,
  collisionFilter: { category: 0x0001, mask: 0xFFFFFFFF, group: 0 }
}
```

### Drag logic (MouseConstraint.update):

**Mouse down**:
1. Loop through all bodies
2. Check bounds containment, then collision filter, then vertex containment
3. Attach constraint: `bodyB = body`, `pointB = mousePos - bodyPos`
4. Wake body from sleep
5. Trigger `startdrag` event

**Mouse held**: Keep updating `pointA = mouse.position`, keep body awake

**Mouse up**: Release `bodyB = null`, trigger `enddrag` event

### Events
- `mousemove`, `mousedown`, `mouseup` (from Mouse)
- `startdrag` (event.body = dragged body)
- `enddrag` (event.body = released body)

## Common Constraint Patterns

### Pin joint (pivot):
```javascript
Constraint.create({ bodyA: a, bodyB: b, length: 0 })
// stiffness defaults to 0.7 for length=0
```

### Spring:
```javascript
Constraint.create({ bodyA: a, bodyB: b, stiffness: 0.05, damping: 0.01 })
// length auto-calculated from initial positions
```

### Fixed point (anchor to world):
```javascript
Constraint.create({ bodyA: body, pointB: { x: 400, y: 100 } })
// bodyB=null, pointB is world position
```

### Rope (chain of constraints):
```javascript
// Create chain of bodies connected by constraints
for (let i = 1; i < bodies.length; i++) {
  Composite.add(world, Constraint.create({
    bodyA: bodies[i-1], bodyB: bodies[i], length: segmentLength
  }));
}
```

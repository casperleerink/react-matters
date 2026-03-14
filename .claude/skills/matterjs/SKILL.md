---
name: matterjs
description: >
  Comprehensive reference for Matter.js 2D rigid body physics engine (v0.20.0).
  Covers the full physics pipeline: Engine update loop, Verlet integration, broadphase/narrowphase
  collision detection (SAT), impulse-based collision resolution, constraint solving (Gauss-Seidel),
  sleeping optimization, body creation, composite hierarchy, events, and mouse interaction.
  Use when writing or debugging Matter.js physics code, creating bodies, configuring collisions,
  tuning physics parameters, understanding the update pipeline, working with constraints/springs,
  or integrating Matter.js with rendering frameworks (React, Canvas, SVG, etc.).
  Triggers on: matter-js, Matter.Engine, Matter.Body, Matter.Bodies, Matter.Composite,
  Matter.Constraint, Matter.Runner, Matter.Events, Matter.Mouse, Matter.MouseConstraint,
  Matter.Detector, Matter.Resolver, collision detection, physics simulation, rigid body physics.
---

# Matter.js Physics Engine Reference (v0.20.0)

## Overview

Matter.js is a 2D rigid body physics engine for JavaScript. It uses Verlet integration for motion,
SAT (Separating Axis Theorem) for collision detection, and iterative impulse-based solving for
collision response and constraints.

## Quick Start

```javascript
import Matter from 'matter-js';
const { Engine, Runner, Bodies, Composite } = Matter;

const engine = Engine.create();
const runner = Runner.create();

// Add bodies to the world (engine.world is a Composite)
const box = Bodies.rectangle(400, 200, 80, 80);
const ground = Bodies.rectangle(400, 600, 810, 60, { isStatic: true });
Composite.add(engine.world, [box, ground]);

// Start the simulation loop
Runner.run(runner, engine);
```

## Reference Files

Read these reference files based on what aspect of Matter.js you need:

- **[Engine & Update Pipeline](references/engine.md)** - Engine.create(), Engine.update() step-by-step pipeline, Runner game loop, timing system, gravity. Read when setting up or debugging the simulation loop.

- **[Body](references/body.md)** - Body.create() with ALL properties/defaults, Verlet integration math, all Body methods (setPosition, setVelocity, applyForce, scale, etc.), sleeping system. Read when creating or manipulating bodies.

- **[Collision Detection](references/collision.md)** - Broadphase (sweep-and-prune), SAT narrowphase, collision filtering (category/mask/group), Pair lifecycle, contact points, Detector orchestration. Read when debugging collisions or configuring collision filters.

- **[Collision Resolution](references/resolver.md)** - Position solving (penetration correction), velocity solving (friction & restitution impulses), warmstarting, Coulomb friction model. Read when tuning collision response behavior.

- **[Constraints](references/constraints.md)** - Constraint.create() options, Gauss-Seidel solving algorithm, stiffness/damping behavior, MouseConstraint, constraint iterations. Read when working with springs, pins, joints, or mouse dragging.

- **[Bodies Factory & Composites](references/factory.md)** - Bodies.rectangle/circle/polygon/trapezoid/fromVertices, chamfer, Composite hierarchy, Vertices, Bounds, Axes. Read when creating shapes or organizing body hierarchies.

- **[Events & Interaction](references/events.md)** - Events.on/off/trigger, all event names per object type (Engine, Runner, Composite, Body), Mouse module, Plugin system. Read when hooking into collision events, mouse events, or extending Matter.js.

## Key Concepts

### Verlet Integration (not Euler)
Matter.js derives velocity from position history (`pos - posPrev`), not by storing velocity directly.
This means `Body.setVelocity()` actually modifies `positionPrev`, and `Body.getVelocity()` is
calculated from `(position - positionPrev) * baseDelta / deltaTime`.

### Forces Are Per-Frame
`body.force` and `body.torque` are zeroed after each Engine.update(). Reapply forces every frame.
Use `Body.applyForce(body, position, force)` to apply force at a world-space point (creates torque
if offset from center of mass).

### Collision Filter Logic
```
if (groupA === groupB && groupA !== 0):
    collide = groupA > 0   // positive group = collide, negative = ignore
else:
    collide = (maskA & categoryB) !== 0 && (maskB & categoryA) !== 0
```

### Static vs Dynamic
Setting `isStatic: true` gives a body infinite mass/inertia (inverseMass = 0). Use
`Body.setStatic()` to toggle at runtime (it stores/restores original properties).

### World Is Just a Composite
`engine.world` is a `Composite` instance. `World` module is a backward-compatibility alias.
Gravity is on `engine.gravity`, not `world.gravity`.

### Timing
- `Engine._deltaMax = 16.667ms` (60Hz baseline)
- `Body._baseDelta = 16.667ms` (velocity normalization reference)
- Runner uses requestAnimationFrame with frame delta smoothing and snapping
- `engine.timing.timeScale` controls global speed (0 = frozen, 1 = normal)
- `body.timeScale` controls per-body speed

### Iteration Counts (Engine defaults)
- `positionIterations: 6` - penetration correction passes
- `velocityIterations: 4` - impulse response passes
- `constraintIterations: 2` - constraint solving passes

Higher values = better quality, worse performance. These are the most impactful tuning knobs.

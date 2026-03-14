# Body Module

## Body.create(options) - All Properties with Defaults

### Identity
- `id` - auto-generated via `Common.nextId()`
- `type` - `'body'` (readonly)
- `label` - `'Body'`
- `parts` - `[]` (compound body parts)
- `parent` - reference to parent body (self if not a part)
- `plugin` - `{}`

### Geometry
- `angle` - `0` (radians)
- `vertices` - default 40x40 square from `'L 0 0 L 40 0 L 40 40 L 0 40'`
- `position` - `{ x: 0, y: 0 }`
- `axes` - auto-calculated from vertices
- `area` - `0` (auto-calculated from vertices)
- `bounds` - auto-calculated AABB
- `circleRadius` - `0`
- `chamfer` - `null`

### Motion
- `velocity` - `{ x: 0, y: 0 }`
- `angularVelocity` - `0` (rad/s)
- `speed` - `0` (readonly, calculated)
- `angularSpeed` - `0` (readonly, calculated)
- `positionPrev` - clone of position (Verlet history)
- `anglePrev` - `0` (Verlet history)
- `deltaTime` - `1000 / 60` (readonly)

### Forces (zeroed after each Engine.update)
- `force` - `{ x: 0, y: 0 }`
- `torque` - `0`
- `positionImpulse` - `{ x: 0, y: 0 }`
- `constraintImpulse` - `{ x: 0, y: 0, angle: 0 }`

### Mass & Inertia
- `mass` - `0` (auto: `density * area`)
- `inverseMass` - `1 / mass`
- `density` - `0.001`
- `inertia` - `0` (auto-calculated)
- `inverseInertia` - `1 / inertia`

### Physics Material
- `restitution` - `0` (0 = no bounce, 1 = perfect bounce)
- `friction` - `0.1` (kinetic/dynamic friction)
- `frictionStatic` - `0.5` (static friction threshold)
- `frictionAir` - `0.01` (air resistance damping)
- `slop` - `0.05` (collision separation allowance)
- `timeScale` - `1` (per-body time multiplier)

### Collision Filter
- `collisionFilter.category` - `0x0001` (bitmask, which category this body is)
- `collisionFilter.mask` - `0xFFFFFFFF` (bitmask, which categories to collide with)
- `collisionFilter.group` - `0` (0 = use category/mask; >0 same group collides; <0 same group ignores)

### State
- `isSensor` - `false` (detects collisions but no physical response)
- `isStatic` - `false` (infinite mass, fixed position)
- `isSleeping` - `false` (temporary static for optimization)
- `sleepThreshold` - `60` (update cycles before sleeping)
- `motion` - `0` (speed^2 + angularSpeed^2)

### Render (for Matter.Render only)
- `render.visible` - `true`
- `render.opacity` - `1`
- `render.strokeStyle` - `null`
- `render.fillStyle` - `null` (auto-assigned random color)
- `render.lineWidth` - `null`
- `render.sprite` - `{ xScale: 1, yScale: 1, xOffset: 0, yOffset: 0 }`

## Verlet Integration - Body.update(body, deltaTime)

Matter.js uses **Verlet integration**, not Euler. Velocity is derived from position history.

```
deltaTime *= body.timeScale
deltaTimeSquared = deltaTime * deltaTime
correction = deltaTime / body.deltaTime  // variable timestep correction

// Air friction coefficient
frictionAir = 1 - body.frictionAir * (deltaTime / 16.667)

// Linear velocity from position history
velocityPrevX = (position.x - positionPrev.x) * correction
velocityPrevY = (position.y - positionPrev.y) * correction

// Verlet integration
velocity.x = velocityPrevX * frictionAir + (force.x / mass) * deltaTimeSquared
velocity.y = velocityPrevY * frictionAir + (force.y / mass) * deltaTimeSquared

positionPrev = position
position += velocity

// Angular (same approach)
angularVelocity = (angle - anglePrev) * frictionAir * correction + (torque / inertia) * deltaTimeSquared
anglePrev = angle
angle += angularVelocity
```

After integration: translate vertices, rotate vertices/axes, update bounds.

### Key constants
- `Body._baseDelta = 1000 / 60` (16.667ms normalization reference)
- `Body._timeCorrection = true` (variable timestep correction)
- `Body._inertiaScale = 4` (scaling for inertia calculation)

## Body Methods

### Position & Angle

**Body.setPosition(body, position, updateVelocity=false)**
- Moves body to absolute position
- `updateVelocity=true`: infers velocity from position change
- `updateVelocity=false`: adjusts `positionPrev` to maintain current velocity

**Body.setAngle(body, angle, updateVelocity=false)**
- Sets absolute angle (radians)
- Same updateVelocity logic as setPosition

**Body.translate(body, translation, updateVelocity=false)**
- Relative move: `setPosition(body, position + translation)`

**Body.rotate(body, rotation, point=null, updateVelocity=false)**
- Relative rotation. If `point` provided, rotates position about that point too.

### Velocity

**Body.setVelocity(body, velocity)**
- Sets velocity by modifying `positionPrev`:
  ```
  timeScale = body.deltaTime / baseDelta
  positionPrev = position - velocity * timeScale
  ```

**Body.getVelocity(body)** → `{x, y}`
- Calculates from position history:
  ```
  timeScale = baseDelta / body.deltaTime
  return (position - positionPrev) * timeScale
  ```

**Body.setAngularVelocity(body, velocity)** / **Body.getAngularVelocity(body)**
- Same approach via `anglePrev`

**Body.setSpeed(body, speed)** / **Body.setAngularSpeed(body, speed)**
- Sets magnitude while preserving direction

### Mass & Inertia

**Body.setMass(body, mass)**
- Updates mass, inverseMass, density, AND scales inertia proportionally:
  ```
  moment = inertia / (oldMass / 6)
  newInertia = moment * (newMass / 6)
  ```

**Body.setDensity(body, density)**
- Calls `setMass(body, density * area)`

**Body.setInertia(body, inertia)**
- Sets `inertia` and `inverseInertia`

### Geometry

**Body.setVertices(body, vertices)**
- Recalculates axes, area, mass, inertia, bounds

**Body.setParts(body, parts, autoHull=true)**
- Sets compound body parts; computes convex hull if autoHull
- Recalculates total area, position (center of mass), mass, inertia

**Body.scale(body, scaleX, scaleY, point=body.position)**
- Scales vertices, recalculates area, mass, inertia, position, bounds

### Forces

**Body.applyForce(body, position, force)**
- Applies force at world-space position (can create torque):
  ```
  body.force += force
  body.torque += cross(position - body.position, force)
  ```
- Forces are per-frame only; zeroed after each Engine.update()

### Static

**Body.setStatic(body, isStatic)**
- When `true`: stores originals, sets mass/inertia=Infinity, restitution=0, friction=1, zeroes velocities
- When `false`: restores original properties from `body._original`

### Centre

**Body.setCentre(body, centre, relative=false)**
- Moves center of mass (rotation pivot point)

## Sleeping System

Requires `engine.enableSleeping = true`.

### Constants
- `_motionWakeThreshold = 0.18`
- `_motionSleepThreshold = 0.08`
- `_minBias = 0.9`

### Motion calculation
```
motion = speed^2 + angularSpeed^2
biasedMotion = 0.9 * min(oldMotion, newMotion) + 0.1 * max(oldMotion, newMotion)
```

### Sleep condition
Body sleeps when:
1. `sleepThreshold > 0`
2. `motion < 0.08` sustained
3. `sleepCounter >= sleepThreshold / timeScale`

### Wake conditions
- Force applied (`force.x !== 0 || force.y !== 0`)
- Collision with moving body (motion > 0.08)
- Manual: `Sleeping.set(body, false)`

### Events
- `sleepStart` on body when entering sleep
- `sleepEnd` on body when waking

### Static body IDs
- `Body._nextCollidingGroupId = 1` (increments)
- `Body._nextNonCollidingGroupId = -1` (decrements)
- `Body._nextCategory = 0x0001` (shifts left)

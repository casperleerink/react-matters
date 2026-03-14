# Collision Resolution (Resolver)

The Resolver uses iterative impulse-based methods in two phases: position solving then velocity solving.

## Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `_restingThresh` | 2 | Normal velocity threshold for resting contact |
| `_restingThreshTangent` | sqrt(6) ~2.449 | Tangential resting threshold |
| `_positionDampen` | 0.9 | Position correction strength |
| `_positionWarming` | 0.8 | Impulse cache reuse factor |
| `_frictionNormalMultiplier` | 5 | Friction force multiplier |
| `_frictionMaxStatic` | Number.MAX_VALUE | Maximum static friction |

## Position Solving (Penetration Correction)

Called `positionIterations` times (default 6).

### Phase 1: preSolvePosition(pairs)
Count total contacts per body across all active pairs:
```
body.totalContacts += pair.contactCount
```

### Phase 2: solvePosition(pairs, delta, damping)
For each active, non-sensor pair:

```
positionDamping = clamp(20 / positionIterations, 0, 1)

separation = collision.depth
  + normal.x * (bodyB.positionImpulse.x - bodyA.positionImpulse.x)
  + normal.y * (bodyB.positionImpulse.y - bodyA.positionImpulse.y)

slopDampen = clamp(delta / 16.667, 0, 1)
impulse = (separation - slop * slopDampen) * 0.9 * damping

// If one body is static, double the impulse on the dynamic body
if (bodyA.isStatic || bodyB.isStatic) impulse *= 2

// Distribute by contact count
contactShare = 1 / body.totalContacts
body.positionImpulse += normal * impulse * contactShare
```

### Phase 3: postSolvePosition(bodies)
Apply accumulated position impulses to geometry:
- Translate vertices by `positionImpulse`
- Update bounds
- Move `positionPrev` by impulse (without changing velocity)
- Warmstart: reuse impulse at 80% (`_positionWarming = 0.8`)
- Reset impulse if velocity opposes it

## Velocity Solving (Friction & Restitution)

Called `velocityIterations` times (default 4).

### Phase 1: preSolveVelocity(pairs)
Apply cached contact impulses from previous frame:
```
for each contact:
  impulse = normal * contact.normalImpulse + tangent * contact.tangentImpulse
  bodyA.positionPrev -= impulse * inverseMassA
  bodyA.anglePrev -= cross(offsetA, impulse) * inverseInertiaA
  bodyB.positionPrev += impulse * inverseMassB
  bodyB.anglePrev += cross(offsetB, impulse) * inverseInertiaB
```

### Phase 2: solveVelocity(pairs, delta)
For each contact in each active, non-sensor pair:

**1. Calculate point velocities (Verlet-derived):**
```
bodyVelocity = position - positionPrev
pointVelocity = bodyVelocity - angularVelocity x offset
```

**2. Relative velocity:**
```
relativeVelocity = pointVelocityA - pointVelocityB
normalVelocity = dot(relativeVelocity, normal)
tangentVelocity = dot(relativeVelocity, tangent)
```

**3. Impulse share (accounts for mass and leverage):**
```
share = 1 / (1/mA + 1/mB + (rA x n)^2/IA + (rB x n)^2/IB)
```

**4. Normal impulse (restitution):**
```
normalImpulse = (1 + pair.restitution) * normalVelocity * share
```

**5. Friction impulse (Coulomb model):**
```
frictionLimit = normalForce * pair.friction * _frictionNormalMultiplier * timeScale

if |tangentVelocity| > frictionLimit:
  // Kinetic friction: clamp tangent impulse
  tangentImpulse = clamp(tangentVelocity, -frictionLimit, frictionLimit)
  // Clear cached impulse (no warmstart for sliding contacts)
else:
  // Static friction: apply full tangent velocity as impulse
  tangentImpulse = tangentVelocity * share
```

**6. Resting contact detection (Erin Catto method):**
```
if normalVelocity < -_restingThresh * timeScale:
  // High velocity impact: clear cached impulse
  contact.normalImpulse = 0
else:
  // Resting: accumulate and clamp impulse >= 0
  oldn = contact.normalImpulse
  contact.normalImpulse = max(oldn + normalImpulse, 0)
  normalImpulse = contact.normalImpulse - oldn
```

**7. Apply total impulse:**
```
impulse = normal * normalImpulse + tangent * tangentImpulse

// Apply via position history (Verlet)
bodyA.positionPrev += impulse * inverseMassA
bodyA.anglePrev += cross(offsetA, impulse) * inverseInertiaA
bodyB.positionPrev -= impulse * inverseMassB
bodyB.anglePrev -= cross(offsetB, impulse) * inverseInertiaB
```

## Key Physics Relationships

**Pair properties derived from bodies:**
- `friction = min(bodyA.friction, bodyB.friction)`
- `frictionStatic = max(bodyA.frictionStatic, bodyB.frictionStatic)`
- `restitution = max(bodyA.restitution, bodyB.restitution)`
- `slop = max(bodyA.slop, bodyB.slop)`

**Restitution** (bounciness): 0 = inelastic (no bounce), 1 = perfectly elastic.
Takes the max of both bodies, so one bouncy body + one non-bouncy body = bouncy collision.

**Friction**: kinetic friction takes the min. Static friction takes the max.
This means the "rougher" surface determines the static friction threshold.

**Slop**: small overlap allowed before position correction kicks in. Prevents jitter in resting contacts.

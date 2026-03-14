# Engine, Runner & Update Pipeline

## Engine.create(options)

```javascript
{
  positionIterations: 6,
  velocityIterations: 4,
  constraintIterations: 2,
  enableSleeping: false,
  gravity: { x: 0, y: 1, scale: 0.001 },
  timing: {
    timestamp: 0,
    timeScale: 1,
    lastDelta: 0,
    lastElapsed: 0,
    lastUpdatesPerFrame: 0
  }
}
```

Auto-created: `engine.world` (Composite), `engine.pairs`, `engine.detector`.

Gravity applied as: `body.force += body.mass * gravity.direction * gravity.scale`
Disable gravity: set `engine.gravity.scale = 0`.

## Engine.update(engine, delta) - Complete Pipeline

`delta` defaults to `Common._baseDelta` (16.667ms). Multiplied by `timing.timeScale`.

### Step-by-step sequence:

1. **`beforeUpdate` event** - `{timestamp, delta}`

2. **Detector setup** (if world modified):
   - `Detector.setBodies()` - rebuilds body list
   - Resets modified flags

3. **Sleeping update** (if `enableSleeping`):
   - `Sleeping.update(allBodies, delta)`

4. **Apply gravity** to all non-static, non-sleeping bodies:
   ```
   body.force.y += body.mass * gravity.y * gravity.scale
   body.force.x += body.mass * gravity.x * gravity.scale
   ```

5. **Body integration** (if delta > 0):
   - Calls `Body.update(body, delta)` for each non-static, non-sleeping body
   - Verlet integration: position, angle, vertices, bounds

6. **`beforeSolve` event**

7. **Constraint pass 1** (before collision detection):
   - `Constraint.preSolveAll()` - apply constraint warming
   - Loop `constraintIterations` times: `Constraint.solveAll()`

8. **Collision detection**:
   - `Detector.collisions()` - broadphase + narrowphase SAT
   - `Pairs.update()` - track collisionStart/Active/End

9. **`collisionStart` event** (if any new collisions)

10. **Wake sleeping bodies** in collisions (if sleeping enabled)

11. **Position resolution** (penetration correction):
    - `Resolver.preSolvePosition()` - count contacts per body
    - Loop `positionIterations` times: `Resolver.solvePosition()`
    - `Resolver.postSolvePosition()` - apply impulses to geometry

12. **Constraint pass 2** (after position resolution):
    - `Constraint.preSolveAll()`
    - Loop `constraintIterations` times: `Constraint.solveAll()`
    - `Constraint.postSolveAll()`

13. **Velocity resolution** (friction & restitution):
    - `Resolver.preSolveVelocity()` - apply cached impulses
    - Loop `velocityIterations` times: `Resolver.solveVelocity()`

14. **Update body velocities**:
    - Recalculate `velocity`, `speed`, `angularVelocity`, `angularSpeed`
    - Normalized to `Body._baseDelta` (16.667ms)

15. **`collisionActive` / `collisionEnd` events** (if any)

16. **Clear forces**: zero `body.force` and `body.torque`

17. **`afterUpdate` event**

## Runner.create(options)

```javascript
{
  delta: 1000 / 60,                // Fixed timestep (ms)
  frameDelta: null,                // Measured browser frame time (readonly)
  frameDeltaSmoothing: true,       // Average frame rate over samples
  frameDeltaSnapping: true,        // Snap to nearest 1Hz
  frameDeltaHistory: [],
  frameDeltaHistorySize: 100,
  timeBuffer: 0,
  timeLastTick: null,
  maxUpdates: null,                // Auto-calculated
  maxFrameTime: 1000 / 30,        // 33.33ms performance budget
  lastUpdatesDeferred: 0,
  enabled: true
}
```

## Runner.run(runner, engine)

Starts `requestAnimationFrame` loop calling `Runner.tick()` each frame.

### Runner.tick() logic:

1. Measure `frameDelta = time - timeLastTick`
2. **Smoothing** (if enabled): keep history of last 100 deltas, take central 80% (10th-90th percentile), compute mean
3. **Snapping** (if enabled): round to nearest 1Hz: `1000 / round(1000 / frameDelta)`
4. Accumulate `timeBuffer += frameDelta`
5. Clamp: `timeBuffer = clamp(timeBuffer, 0, frameDelta + delta * 1.5)`
6. Update loop:
   ```
   while (engineDelta > 0 && timeBuffer >= engineDelta * 1.5) {
     Engine.update(engine, engineDelta)
     timeBuffer -= engineDelta
     if (updateCount >= maxUpdates || elapsed > maxFrameTime) break
   }
   ```

### Runner events (per frame):
- `beforeTick` → `tick` → [N x (`beforeUpdate` → Engine.update → `afterUpdate`)] → `afterTick`

### Key constants:
| Constant | Value | Purpose |
|----------|-------|---------|
| `_maxFrameDelta` | 66.667ms | 15Hz max acceptable frame |
| `_frameDeltaFallback` | 16.667ms | Fallback if unmeasurable |
| `_timeBufferMargin` | 1.5 | Allow 1.5x timestep backlog |
| `_smoothingLowerBound` | 0.1 | 10th percentile |
| `_smoothingUpperBound` | 0.9 | 90th percentile |

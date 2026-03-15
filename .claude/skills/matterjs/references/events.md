# Events, Mouse & Plugin System

## Events Module (Events.js)

Simple publish-subscribe event system.

### Methods

**Events.on(object, eventNames, callback)** → callback

- Space-separated event names supported: `'collisionStart collisionEnd'`
- Stores in `object.events[eventName]` array

**Events.off(object, eventNames, callback)**

- No eventNames: clears ALL events
- No callback: clears all callbacks for that event
- Overload: `Events.off(object, callback)` removes from all events

**Events.trigger(object, eventNames, event)**

- Shallow clones event, adds `event.name` and `event.source`
- Space-separated names supported

## Events by Object Type

### Engine Events

| Event             | When                                                | Event Properties            |
| ----------------- | --------------------------------------------------- | --------------------------- |
| `beforeUpdate`    | Start of Engine.update                              | `{timestamp, delta}`        |
| `beforeSolve`     | After body integration, before collision resolution | `{timestamp, delta}`        |
| `afterUpdate`     | End of Engine.update                                | `{timestamp, delta}`        |
| `collisionStart`  | New collision pairs detected                        | `{pairs, timestamp, delta}` |
| `collisionActive` | Ongoing collision pairs                             | `{pairs, timestamp, delta}` |
| `collisionEnd`    | Collision pairs ended                               | `{pairs, timestamp, delta}` |

### Runner Events

| Event          | When                               | Event Properties |
| -------------- | ---------------------------------- | ---------------- |
| `beforeTick`   | Start of browser frame             | `{timestamp}`    |
| `tick`         | After beforeTick                   | `{timestamp}`    |
| `beforeUpdate` | Before each Engine.update in frame | `{timestamp}`    |
| `afterUpdate`  | After each Engine.update in frame  | `{timestamp}`    |
| `afterTick`    | End of browser frame               | `{timestamp}`    |

Per frame: `beforeTick` → `tick` → [N x (`beforeUpdate` → update → `afterUpdate`)] → `afterTick`

### Composite Events

| Event          | When                   | Event Properties |
| -------------- | ---------------------- | ---------------- |
| `beforeAdd`    | Before adding object   | `{object}`       |
| `afterAdd`     | After adding object    | `{object}`       |
| `beforeRemove` | Before removing object | `{object}`       |
| `afterRemove`  | After removing object  | `{object}`       |

### Body Events

| Event        | When                    |
| ------------ | ----------------------- |
| `sleepStart` | Body enters sleep state |
| `sleepEnd`   | Body wakes from sleep   |

### MouseConstraint Events

| Event       | When                       | Event Properties |
| ----------- | -------------------------- | ---------------- |
| `startdrag` | User starts dragging body  | `{mouse, body}`  |
| `enddrag`   | User releases dragged body | `{mouse, body}`  |
| `mousemove` | Mouse moved                | `{mouse}`        |
| `mousedown` | Mouse button pressed       | `{mouse}`        |
| `mouseup`   | Mouse button released      | `{mouse}`        |

## Collision Event Usage Pattern

```javascript
Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((pair) => {
    console.log(pair.bodyA.label, "hit", pair.bodyB.label);
    console.log("depth:", pair.collision.depth);
    console.log("normal:", pair.collision.normal);
    // pair.isSensor - true if either body is sensor
  });
});

Events.on(engine, "collisionEnd", (event) => {
  event.pairs.forEach((pair) => {
    console.log(pair.bodyA.label, "separated from", pair.bodyB.label);
  });
});
```

## Mouse Module (Mouse.js)

### Mouse.create(element)

Creates mouse input tracker. Defaults to `document.body`.

**Properties**:

- `element` - bound HTML element
- `absolute` - `{x, y}` raw position relative to element
- `position` - `{x, y}` after applying scale and offset
- `offset` - `{x, y}` position offset
- `scale` - `{x, y}` position scale factor
- `mousedownPosition` / `mouseupPosition` - `{x, y}`
- `button` - `-1` (none), `0` (left/touch), `1` (middle), `2` (right)
- `wheelDelta` - `-1`, `0`, or `1`
- `pixelRatio` - from element's `data-pixel-ratio` attribute
- `sourceEvents` - `{mousemove, mousedown, mouseup, mousewheel}` raw DOM events

### Methods

**Mouse.setElement(mouse, element)** - Rebind to new element (attaches mouse+touch listeners)
**Mouse.setOffset(mouse, offset)** - Set position offset
**Mouse.setScale(mouse, scale)** - Set position scale
**Mouse.clearSourceEvents(mouse)** - Reset captured events

Position calculation: `position = (absolute - offset) * scale`

### Touch Support

Touch events mapped to mouse events automatically (button = 0 for touch).

## Plugin System (Plugin.js)

### Plugin structure:

```javascript
{
  name: 'my-plugin',           // required
  version: '1.0.0',            // required (semver)
  install: function(matter) {}, // required
  for: 'matter-js@^0.19.0',   // optional compatibility
  uses: ['other-plugin']       // optional dependencies
}
```

### Methods:

**Plugin.register(plugin)** - Register globally
**Plugin.use(module, plugins)** - Install plugins with dependency resolution (topological sort)
**Plugin.resolve(dependency)** - Lookup plugin by name
**Plugin.isUsed(module, name)** - Check if installed

### Version matching operators:

- `*` - any version
- `>` / `>=` - greater than
- `~` - same major.minor
- `^` - compatible (same major if major > 0)

### Usage:

```javascript
Matter.use("matter-attractors");
// or
Matter.use(MatterAttractors);
```

## Matter Namespace (Matter.js)

**Properties:**

- `Matter.name` - `'matter-js'`
- `Matter.version` - semver string

**Methods:**

- `Matter.use(...plugins)` - Install plugins
- `Matter.before(path, func)` - Chain before: `Matter.before('Engine.update', myFunc)`
- `Matter.after(path, func)` - Chain after existing function

## Common Utilities (Common.js)

Key utilities used throughout:

- `Common.extend(obj, deep, ...sources)` - Deep extend objects
- `Common.clone(obj, deep)` - Clone object
- `Common.clamp(value, min, max)` - Clamp number
- `Common.random(min, max)` - Seeded random (LCG)
- `Common.nextId()` - Sequential unique ID
- `Common.now()` - High-res timestamp
- `Common.setDecomp(decomp)` / `Common.getDecomp()` - Set poly-decomp library for concave shapes
- `Common.topologicalSort(graph)` - DAG sorting (used for plugin dependencies)

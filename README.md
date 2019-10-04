# Capacitor.js

[![forthebadge](https://forthebadge.com/images/badges/powered-by-electricity.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)

A `capacitor` is initialized with a certain number of allowed charges, and a trigger method that gets called whenever those charges are filled.

Designed in a functional and hook-ready way.

## How it works

### Simple usage

```javascript
const [addMessage] = capacitor(3, (messages) => {
  console.log(messages.joins(' '));
});

addMessage('twinkle')
addMessage('twinkle')
addMessage('little star')
// prints 'twinkle twinkle little star'
addMessage('how i')
addMessage('wonder what')
addMessage('you are')
// prints 'how i wonder what you are'
```

### Adding time conditions

It is possible to configure the capacitor to trigger after a set amount of time (in ms) if the charges are not completed.
That is done by creating an **unstable** capacitor

```javascript
const print = (messages) => { console.log(messages.joins(' ')) }

const [addMessage] = capacitor(3, print).unstable(1000)

addMessage('twinkle')
addMessage('twinkle')
addMessage('little star')
// prints 'twinkle twinkle little star'
addMessage('how i')
addMessage('wonder what')
// wait 1 second
// prints 'how i wonder what'
```

### More control

The `capacitor` contains 3 usable methods:

- A `charge` method which ads a charge to the capacitor (represented by `addMessage` in the examples above)
- An `invalidate` method which clears out all the charges
- A `trigger` method which calls the trigger function with the existing charges and then invalidates

**Note:** Those methods are also available as properties to the capacitor if required

```javascript
// Hook style
const [charge, invalidate, trigger] = capacitor(...);

// Object style
const cptor = capacitor(...);

cptor.charge( ... )
cptor.invalidate();
cptor.trigger();

cptor.charges // Returns the current number of charges
```

## Sample use cases

### Combos

Let's make a small **combo manager** with `capacitor`:

We want the different attack moves to stack up to 5, however if the player stops attacking for a second, the combo triggers anyways with less damage.

```javascript
const [combo, invalidate] = capacitor(5, (actions) => {
  const damage = computeComboDamage(actions);
  finalBoss.hurt(damage);
}).unstable(1000);

game.onButtonPressed = (key) => {
  if (key === 'A') {
    combo('hit')
  } else if (key === 'B') {
    combo('kick')
  }
};
```

Let's suppose we now want the combo to be broken if the player takes any damage

```javascript
game.onPlayerDamaged = () => {
  invalidate();
};
```

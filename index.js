function readonly(obj, prop, val) {
  const getter = typeof val === 'function' ? val : () => val;
  Object.defineProperty(obj, prop, {
    get: getter
  });
}

function method(obj, name, func) {
  obj[name] = func;
}

/**
 * @typedef {Array} Capacitor
 * @property {number} charges - The number of active charges
 * @property {number} charge - Adds a charge
 * @property {number} invalidate - Clears the charges
 * @property {number} trigger - Flush the current charges and apply the trigger function
 * @property {function} unstable - makes the capacitor auto trigger after a set timeout
 */
/**
 * Creates the capacitor
 *
 * @param {number} charges
 * @param {function} trigger
 * @returns {Capacitor}
 */
function capacitor(charges, trigger) {
  let queue         = [];
  let timeMS        = -1;
  let timeout       = null;

  const stopTimeout = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
  };

  const resetTimeout = () => {
    stopTimeout();
    if (timeMS > 0) {
      timeout = setTimeout(apply, timeMS);
    }
  };

  const invalidate = () => {
    queue = [];
    stopTimeout();
  };

  const apply = () => {
    trigger(queue);
    invalidate();
  }

  const push = (data) => {
    queue.push(data);
    resetTimeout();
    if (queue.length === charges) {
      apply();
    }
  };

  const cptor = [push, invalidate, apply];

  readonly(cptor, 'charges', () => queue.length);

  method(cptor, 'charge', push);
  method(cptor, 'invalidate', invalidate);
  method(cptor, 'trigger', apply);
  method(cptor, 'unstable', (time) => {
  	timeMS = time;
    resetTimeout();
    return cptor;
  });

  return cptor;
};

module.exports = { capacitor };
// @ts-check
// Allow access from GUI on another port
document.domain = window.location.hostname;

const codelift = (action, ...args) => {
  window.top.postMessage(
    {
      source: "codelift",
      payload: { action, args }
    },
    "*"
  );
};

codelift("setPath", window.location.href.split(window.location.origin).pop());

// Intercept history methods that don't have a listener
["pushState", "replaceState"].forEach(method => {
  const original = window.history[method];

  window.history[method] = (...args) => {
    original.apply(window.history, args);
    codelift("syncPath");
  };
});

window.addEventListener("popstate", () => codelift("syncPath"));

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.addStatusHandler(status => {
    codelift("handleStatus", status);
  });
}

module.exports = function register({ React, ReactDOM }) {
  if (!window.React) {
    window.React = React;
  }

  if (!window.ReactDOM) {
    window.ReactDOM = ReactDOM;
  }
};

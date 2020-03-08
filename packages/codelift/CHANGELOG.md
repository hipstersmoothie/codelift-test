# v1.0.0 (Sat Mar 07 2020)

#### 🐛  Bug Fix

- Have noop return first arg, in case we add HoCs  ([@ericclemmons](https://github.com/ericclemmons))
- Leave note on dealing with multi-level `stateNode`s  ([@ericclemmons](https://github.com/ericclemmons))
- Replace rendered component with <span>{preview}</span>  ([@ericclemmons](https://github.com/ericclemmons))
- Working updateProps  ([@ericclemmons](https://github.com/ericclemmons))
- Remove safe-eval (breaks Next.js)  ([@ericclemmons](https://github.com/ericclemmons))
- Add safe-eval for receiving JS props (vs. only JSON)  ([@ericclemmons](https://github.com/ericclemmons))
- Add graphql-type-json  ([@ericclemmons](https://github.com/ericclemmons))
- Support reset & move preview effects to component  ([@ericclemmons](https://github.com/ericclemmons))
- Add :active variants to backgroundColor & boxShadow  ([@ericclemmons](https://github.com/ericclemmons))
- Lighten inspectors so that header can be black  ([@ericclemmons](https://github.com/ericclemmons))
- Move footer to <Header />  ([@ericclemmons](https://github.com/ericclemmons))
- Use Component["Inspector"] with window.React|ReactDOM  ([@ericclemmons](https://github.com/ericclemmons))
- Track props changes via ReactNode.hasChanges  ([@ericclemmons](https://github.com/ericclemmons))
- Working Component preview  ([@ericclemmons](https://github.com/ericclemmons))
- ReactNode.previewProps re-uses context  ([@ericclemmons](https://github.com/ericclemmons))
- Use Fiber tags instead of duck-typing for ReactNode.name  ([@ericclemmons](https://github.com/ericclemmons))
- Automatically center Inspectors  ([@ericclemmons](https://github.com/ericclemmons))
- Use new { register }  ([@ericclemmons](https://github.com/ericclemmons))
- codelift exports inspect & register  ([@ericclemmons](https://github.com/ericclemmons))
- Don't throw when root container cannot be found  ([@ericclemmons](https://github.com/ericclemmons))
- Add ReactNode.previewProps(props)  ([@ericclemmons](https://github.com/ericclemmons))
- Prototype inspect(Component, { Inspector })  ([@ericclemmons](https://github.com/ericclemmons))
- Initial CoomponentInspector  ([@ericclemmons](https://github.com/ericclemmons))

#### Authors: 1

- Eric Clemmons ([@ericclemmons](https://github.com/ericclemmons))

---

# v0.6.3 (Sat Feb 29 2020)

#### 🐛  Bug Fix

- Lock all codelift packages at exact version  ([@ericclemmons](https://github.com/ericclemmons))
- save-prefix false  ([@ericclemmons](https://github.com/ericclemmons))

#### Authors: 1

- Eric Clemmons ([@ericclemmons](https://github.com/ericclemmons))

---

# v0.6.2 (Wed Jan 29 2020)

#### 🐛  Bug Fix

- Replace useSlider with hooks  ([@ericclemmons](https://github.com/ericclemmons))

#### Authors: 1

- Eric Clemmons ([@ericclemmons](https://github.com/ericclemmons))

---

# v0.6.0 (Mon Jan 27 2020)

#### 🐛  Bug Fix

- Use RPC instead of window for communication  ([@ericclemmons](https://github.com/ericclemmons))
- Add setPath  ([@ericclemmons](https://github.com/ericclemmons))
- store supports RPC calls via postMessage  ([@ericclemmons](https://github.com/ericclemmons))
- Remove unused router  ([@ericclemmons](https://github.com/ericclemmons))
- Use single store instance  ([@ericclemmons](https://github.com/ericclemmons))
- Dry up pushState/replaceState  ([@ericclemmons](https://github.com/ericclemmons))
- Update history as path cahnges  ([@ericclemmons](https://github.com/ericclemmons))
- Only render iframe with initial path  ([@ericclemmons](https://github.com/ericclemmons))
- syncPath on history pushState|replaceState|popState  ([@ericclemmons](https://github.com/ericclemmons))
- syncPath on load  ([@ericclemmons](https://github.com/ericclemmons))
- Default path to localhost:1337/*  ([@ericclemmons](https://github.com/ericclemmons))
- Update example deps  ([@ericclemmons](https://github.com/ericclemmons))

#### Authors: 1

- Eric Clemmons ([@ericclemmons](https://github.com/ericclemmons))
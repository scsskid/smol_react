/** @jsx h */

import { h, useState } from "./h.js";

function Counter(props) {
  const [value, setValue] = useState`${0}`;

  return (
    <div>
      <div>Counter: {value}</div>
      <button onclick={() => setValue(value + 1)}>Increment</button>
      <button onclick={() => setValue(value - 1)}>Decrement</button>

      {props.children}
    </div>
  );
}

export default function App() {
  return (
    <Counter>
      <p>^ the counter</p>
    </Counter>
  );
}

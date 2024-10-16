# use-advanced-toggle

`use-advanced-toggle` is a custom React hook that allows you to easily cycle through multiple states. It's designed to enhance the functionality of toggling between values, making it perfect for use cases such as switching themes, controlling animations, or any scenario where you need to cycle through different options.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

- Cycle through multiple states using a simple API.
- Supports any type of values, including strings and objects.
- Handles edge cases such as empty states and single states gracefully.
- Easy to integrate into both TypeScript and JavaScript projects.

## Installation

To install the `use-advanced-toggle` package, run:

```bash
npm install use-advanced-toggle
```

or if you are using Yarn:

```bash
yarn add use-advanced-toggle
```

## Usage

Here’s how to use the `use-advanced-toggle` hook in your React component:

```javascript
import React from 'react';
import useAdvancedToggle from 'use-advanced-toggle';

const MyComponent = () => {
  const [color, toggleColor] = useAdvancedToggle(['red', 'green', 'blue']);

  return (
    <div>
      <p>The current color is: {color}</p>
      <button onClick={toggleColor}>Toggle Color</button>
    </div>
  );
};

export default MyComponent;
```

## API

### `useAdvancedToggle(states: string[])`

#### Parameters
- `states`: An array of states you want to toggle between (can be strings, numbers, or objects).

#### Returns
- An array where:
  - The first element is the current state.
  - The second element is a function to toggle to the next state.

#### Example
```javascript
const [currentState, toggle] = useAdvancedToggle(['state1', 'state2', 'state3']);
```

## Testing

To run tests for the `use-advanced-toggle` hook, ensure you have the testing dependencies installed:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

Then you can run your tests using:

```bash
npm test
```

### Example Test Case

Here's an example of how you might test your hook:

```javascript
import { renderHook, act } from '@testing-library/react';
import useAdvancedToggle from '../hooks/useAdvancedToggle';

describe('useAdvancedToggle', () => {
  it('should toggle between states', () => {
    const states = ['red', 'green', 'blue'];
    const { result } = renderHook(() => useAdvancedToggle(states));

    expect(result.current[0]).toBe('red');
    act(() => result.current[1]());
    expect(result.current[0]).toBe('green');
    act(() => result.current[1]());
    expect(result.current[0]).toBe('blue');
    act(() => result.current[1]());
    expect(result.current[0]).toBe('red');
  });
});
```

## Contributing

Contributions are welcome! If you have suggestions for improvements, feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License.

---

Feel free to adjust any sections to better fit your project!
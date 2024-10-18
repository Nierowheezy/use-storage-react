# use-storage-react

![Version](https://img.shields.io/npm/v/use-storage-react) ![License](https://img.shields.io/badge/license-MIT-brightgreen)

## Overview

`use-storage-react` is a custom React hook that simplifies the management of browser storage (both `localStorage` and `sessionStorage`) with automatic updates across documents and tabs. This package enables efficient state management in React applications, making it easy to persist state between sessions or tabs.

## Features

- **Cross-Tab Synchronization**: Automatically syncs changes to state across different tabs/windows.
- **Support for `localStorage` and `sessionStorage`**: Provides easy-to-use hooks for both types of storage.
- **Customizable**: Easily configure initial values and storage events.
- **TypeScript Support**: Fully typed with TypeScript for better development experience.

## Installation

You can install `use-storage-react` via npm or yarn:

```bash
npm install use-storage-react
```

or

```bash
yarn add use-storage-react
```

## Usage

### Local Storage

To use the local storage hook:

```jsx
import { useLocalStorage } from 'use-storage-react';

const MyComponent = () => {
  const [value, setValue] = useLocalStorage('myKey', 'defaultValue');

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};
```

### Session Storage

To use the session storage hook:

```jsx
import { useSessionStorage } from 'use-storage-react';

const MyComponent = () => {
  const [value, setValue] = useSessionStorage('myKey', 'defaultValue');

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};
```

## API

### `useLocalStorage`

#### Parameters

- **key**: `string` - The key to store the value.
- **initialValue**: `any` - The initial value to be stored.

#### Returns

- An array containing:
  - The current value stored in local storage.
  - A function to update the stored value.

### `useSessionStorage`

#### Parameters

- **key**: `string` - The key to store the value.
- **initialValue**: `any` - The initial value to be stored.

#### Returns

- An array containing:
  - The current value stored in session storage.
  - A function to update the stored value.

## Examples

### Example of Using `useLocalStorage`

Here's a complete example that uses the `useLocalStorage` hook to create a persistent counter:

```jsx
import React from 'react';
import { useLocalStorage } from 'use-storage-react';

const Counter = () => {
  const [count, setCount] = useLocalStorage('count', 0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
```

### Example of Using `useSessionStorage`

Here's a complete example that uses the `useSessionStorage` hook:

```jsx
import React from 'react';
import { useSessionStorage } from 'use-storage-react';

const SessionComponent = () => {
  const [sessionData, setSessionData] = useSessionStorage('sessionData', {});

  return (
    <div>
      <button onClick={() => setSessionData({ value: 'Hello, World!' })}>
        Set Session Data
      </button>
      <p>Session Data: {JSON.stringify(sessionData)}</p>
    </div>
  );
};
```

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get involved.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

**Olabode Olaniyi**

## Links

- [GitHub Repository](https://github.com/Nierowheezy/use-storage-react)
- [Issues Tracker](https://github.com/Nierowheezy/use-storage-react/issues)

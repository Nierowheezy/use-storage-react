# use-storage-react

![Version](https://img.shields.io/npm/v/use-storage-react) ![License](https://img.shields.io/badge/license-MIT-brightgreen)

🗄️ **use-storage-react**  
A versatile React hook for managing `localStorage` and `sessionStorage` with cross-tab sync and advanced options.  
[View project on GitHub](https://github.com/Nierowheezy/use-storage-react)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Usage](#basic-usage)
  - [TypeScript Usage](#typescript-usage)
- [API](#api)
  - [useLocalStorage](#uselocalstorage)
  - [useSessionStorage](#usesessionstorage)
- [Advanced Usage / Options](#advanced-usage--options)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)
- [Links](#links)

## Overview

`use-storage-react` is a custom React hook that simplifies the management of browser storage (both `localStorage` and `sessionStorage`) with automatic updates across documents and tabs. This package provides:

- Hooks for `localStorage` and `sessionStorage` management.
- Cross-tab synchronization.
- Customization options for serializers, parsers, and error logging.

## Features

✅ Persists data to local storage with an interface similar to the React `useState` hook.

✅ Works with any hooks-compatible React version.

✅ Works with SSR (Server-Side Rendering).

✅ Syncs data between components in the same or different browser tabs.

## Installation

Install via npm:

```bash
npm install use-storage-react
```

Or with yarn:

```bash
yarn add use-storage-react
```

## Usage

### Basic Usage

To use the local storage hook:

```tsx
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

To use the session storage hook:

```tsx
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

### TypeScript Usage

The type of the stored value will be inferred from your default value.

For example:

```ts
import { useLocalStorage } from 'use-storage-react';

const MyComponent = () => {
  const [username, setUsername] = useLocalStorage<string>('name', '');

  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
    </div>
  );
};
```

You can also specify a custom type by passing it as a generic argument to the hook if necessary.

## API

### `useLocalStorage`

#### Parameters

- **key**: `string` - The key to store the value.
- **initialValue**: `any` - The initial value to be stored.
- **options**: `object` (optional) - Advanced configuration (serializer, parser, logger, etc.).

#### Returns

- **Array** containing:
  - The current value from local storage.
  - A function to update the stored value.

### `useSessionStorage`

#### Parameters

- **key**: `string` - The key to store the value.
- **initialValue**: `any` - The initial value to be stored.

#### Returns

- **Array** containing:
  - The current value from session storage.
  - A function to update the stored value.

## Advanced Usage / Options

The `useLocalStorage` hook accepts an optional third argument to provide more control over its behavior.

### Options Object

- **serializer**: `(obj) => string` - A function to serialize data before storing it in `localStorage`.
- **parser**: `(str) => any` - A function to parse data retrieved from `localStorage`.
- **logger**: `(error) => void` - A function to log errors caught within the hook.
- **syncData**: `boolean` - When set to `false`, cross-context synchronization is disabled.

### Example Usage with Options

```tsx
import { useLocalStorage } from 'use-storage-react';

const options = {
  serializer: (obj) => JSON.stringify(obj), // Custom serializer
  parser: (str) => JSON.parse(str),         // Custom parser
  logger: (error) => console.error(error),  // Custom error logger
  syncData: false,                          // Disable cross-tab sync
};

function MyComponent() {
  const [data, setData] = useLocalStorage('dataKey', { foo: 'bar' }, options);

  return (
    <div>
      <button onClick={() => setData({ foo: 'baz' })}>Update Data</button>
      <p>Data: {JSON.stringify(data)}</p>
    </div>
  );
}
```

## Testing

To run tests for the `use-storage-react` hooks, install the testing dependencies:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

Run tests with:

```bash
npm test
```

## Contributing

If you'd like to contribute, fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.

## Author

Olaniyi Olabode

## Links

- [GitHub Repository](https://github.com/Nierowheezy/use-storage-react)
- [npm Package](https://www.npmjs.com/package/use-storage-react)


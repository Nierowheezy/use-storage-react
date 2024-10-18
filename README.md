# use-browser-storage

![npm](https://img.shields.io/npm/v/use-browser-storage) ![npm](https://img.shields.io/npm/dt/use-browser-storage)

`use-browser-storage` is a React hook library that provides simple and efficient hooks for managing data in both Local Storage and Session Storage. This package streamlines the process of storing, retrieving, and synchronizing data in web applications, enhancing user experience by maintaining state across sessions or page reloads.

## Features

- **Local Storage Support**: Easily store and retrieve data that persists across browser sessions.
- **Session Storage Support**: Manage data that lasts only as long as the page session, ideal for temporary data.
- **TypeScript Support**: Fully typed hooks for TypeScript users.
- **Flexible API**: Simple and intuitive API for easy integration.

## Installation

You can install `use-browser-storage` via npm or yarn:

```bash
npm install use-browser-storage
```

or

```bash
yarn add use-browser-storage
```

## Usage

### Importing the Hooks

You can import the hooks directly from the package:

```javascript
import { useLocalStorage, useSessionStorage } from 'use-browser-storage';
```

### useLocalStorage

This hook allows you to interact with the Local Storage API.

#### Example

```javascript
import React from 'react';
import { useLocalStorage } from 'use-browser-storage';

const LocalStorageExample = () => {
  const [value, setValue] = useLocalStorage('myKey', 'defaultValue');

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <p>Stored Value: {value}</p>
    </div>
  );
};
```

### useSessionStorage

This hook allows you to interact with the Session Storage API.

#### Example

```javascript
import React from 'react';
import { useSessionStorage } from 'use-browser-storage';

const SessionStorageExample = () => {
  const [value, setValue] = useSessionStorage('mySessionKey', 'defaultValue');

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <p>Stored Value: {value}</p>
    </div>
  );
};
```

## API

### `useLocalStorage(key: string, initialValue: T)`

- **Parameters**:
  - `key`: The key under which the value is stored.
  - `initialValue`: The initial value to set if the key does not exist.

- **Returns**: An array containing the current value and a function to update it.

### `useSessionStorage(key: string, initialValue: T)`

- **Parameters**:
  - `key`: The key under which the value is stored.
  - `initialValue`: The initial value to set if the key does not exist.

- **Returns**: An array containing the current value and a function to update it.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any bugs or feature requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Olabode Olaniyi

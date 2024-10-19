# use-storage-react

![Version](https://img.shields.io/npm/v/use-storage-react) ![License](https://img.shields.io/badge/license-MIT-brightgreen)

🗄️ **use-storage-react**  
A versatile React hook for managing localStorage and sessionStorage with cross-tab sync and advanced customization options.  
[View project on GitHub](https://github.com/Nierowheezy/use-storage-react)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Usage](#basic-usage)
  - [Removing from Storage](#removing-from-storage)
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

---

## Overview

`use-storage-react` provides React hooks that streamline the management of browser storage (localStorage and sessionStorage). It includes built-in synchronization across tabs and documents and offers advanced options for customizing storage behavior, serialization, and error handling.

## Features

- ✅ **Seamless Storage Management**: Interact with localStorage and sessionStorage as effortlessly as React state.
- ✅ **Cross-Tab Sync**: Automatically synchronize data between different browser tabs or windows.
- ✅ **Customization**: Use custom serializers, parsers, and error loggers.
- ✅ **TypeScript Support**: Fully typed for improved developer experience.
- ✅ **Works with SSR**: Compatible with server-side rendering.

## Installation

To install via npm:

```bash
npm install use-storage-react
```

Or, using yarn:

```bash
yarn add use-storage-react
```

---

## Usage

### Basic Usage

At its simplest, `useLocalStorage` and `useSessionStorage` hooks only require a key. However, it’s good practice to provide a default value as a second argument to handle cases where the key is not yet stored.

#### Example - Local Storage:

```tsx
import { useLocalStorage } from 'use-storage-react';

const MyComponent = () => {
  const [username, setUsername] = useLocalStorage('name', '');

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

In this example, the username state is stored in localStorage under the key "name". It will default to an empty string if nothing is found in storage.

### Removing from Storage

Setting a stored value to `undefined` will remove the associated key from storage. Here’s an example where `username` is removed from localStorage when the button is clicked:

```tsx
import { useLocalStorage } from 'use-storage-react';

function MyComponent() {
  const [username, setUsername] = useLocalStorage("name", "");

  return (
    <>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button
        onClick={() => {
          setUsername(undefined);
        }}
      >
        Remove Username
      </button>
    </>
  );
}
```

> **Note**: The hook uses `JSON.stringify` and `JSON.parse` for serialization by default. Custom serializers and parsers are covered in [Advanced Usage](#advanced-usage--options).

---

### TypeScript Usage

`use-storage-react` is fully typed, allowing for a smooth developer experience when working with TypeScript. The hooks automatically infer the type of the stored value based on the initial value provided, but you can also explicitly specify types as needed for stricter type control.

#### Type Inference

When you provide an initial value to `useLocalStorage` or `useSessionStorage`, TypeScript will infer the type of the stored value automatically. For example, passing a string as the initial value will infer the type as `string`.

```tsx
import { useLocalStorage } from 'use-storage-react';

const [username, setUsername] = useLocalStorage('name', '');

// TypeScript infers that username is a string.
```

#### Specifying Types Explicitly

In some cases, you may want to enforce a specific type. You can explicitly define the type by passing it as a generic to the hook. This is particularly useful when you expect the stored value to be a specific complex object or a non-inferred type like a number.

```tsx
import { useLocalStorage } from 'use-storage-react';

interface User {
  id: number;
  name: string;
}

// Explicitly specifying that the stored value is of type `User`
const [user, setUser] = useLocalStorage<User>('user', { id: 1, name: 'John' });

// Now, user will be strictly typed as User
```

#### Handling `undefined` and Nullable Types

If your storage key may not always have a value, or if you want to handle the possibility of an `undefined` initial state, you can explicitly define the type as a union, such as `T | undefined`. This is helpful when the stored data might not exist initially.

```tsx
import { useLocalStorage } from 'use-storage-react';

// Allowing for the possibility of `null` or `undefined`
const [token, setToken] = useLocalStorage<string | null>('authToken', null);
```

In this example, `token` is either a `string` or `null`. This helps maintain strict type control, especially in cases where no value is initially stored in localStorage.

#### Default Value Omission

When using the hook without an initial value, TypeScript will infer the type as `undefined` unless you specify it. It’s crucial to pass the correct type as a generic to avoid potential type inference issues.

```tsx
import { useLocalStorage } from 'use-storage-react';

// Correctly specifying the type as `number | undefined`
const [count, setCount] = useLocalStorage<number | undefined>('count');
```

Here, since no default value is provided, the initial value of `count` is `undefined`. You could specify `null`, an empty string, or a similar placeholder as needed.

#### TypeScript with Advanced Options

If you are using custom serializers or parsers, you should ensure your TypeScript types match your custom logic to avoid type mismatches.

```tsx
import { useLocalStorage } from 'use-storage-react';

interface CustomData {
  id: number;
  value: string;
}

const options = {
  serializer: (obj: CustomData) => JSON.stringify(obj),  // Custom serializer
  parser: (str: string): CustomData => JSON.parse(str),  // Custom parser
};

const [customData, setCustomData] = useLocalStorage<CustomData>('dataKey', { id: 1, value: 'foo' }, options);
```

In this example, the `serializer` and `parser` ensure that the stored data follows the `CustomData` type, providing both type safety and consistency across your application.

#### Key Takeaways

- **Automatic Type Inference**: The type of the stored value is inferred from the provided default value.
- **Explicit Type Declaration**: You can use generics to explicitly declare types for stronger type control.
- **Nullable/Undefined Types**: Handle cases where the stored value might be `null` or `undefined` by including those types in your type declaration.
- **Consistent Types with Custom Options**: When using custom serializers or parsers, ensure the types match your logic to maintain strict type safety.

---

## API

### useLocalStorage

#### Parameters:

- **key**: `string` - The storage key used to store and retrieve the value.
- **initialValue**: `any` (optional) - The initial value to be stored if the key does not exist.
- **options**: `object` (optional) - Custom configuration (serializer, parser, logger, etc.).

#### Returns:

- **value**: `any` - The current value stored under the specified key.
- **setValue**: `function` - Function to update or remove the value.

### useSessionStorage

#### Parameters:

- **key**: `string` - The key to store the value in sessionStorage.
- **initialValue**: `any` (optional) - The default value to store if the key doesn't exist.

#### Returns:

- **value**: `any` - The current value stored.
- **setValue**: `function` - Function to update or remove the value.

---

## Advanced Usage / Options

The `useLocalStorage` hook accepts an optional third argument, an options object, for advanced control over its behavior. This is especially useful when default serialization and synchronization don’t meet your needs.

### Options:

- **serializer**: `(obj) => string` - Customize how the value is serialized before being stored. By default, `JSON.stringify` is used.
- **parser**: `(str) => any` - Customize how the stored string is parsed back into an object. By default, `JSON.parse` is used.
- **logger**: `(error) => void` - Provide a custom error logging function to handle any errors that occur during storage operations.
- **syncData**: `boolean` - If set to false, disables cross-tab synchronization.

#### Example Usage with Options:

```tsx
import { useLocalStorage

 } from 'use-storage-react';

const options = {
  serializer: (data) => JSON.stringify(data),
  parser: (data) => JSON.parse(data),
  logger: (error) => console.error('Storage Error:', error),
  syncData: true,
};

const [settings, setSettings] = useLocalStorage('settings', { theme: 'dark' }, options);
```

---

## Testing

To run the tests, ensure you have installed dependencies and then use:

```bash
npm test
```

### Running Tests in Watch Mode

You can also run the tests in watch mode to continuously monitor changes:

```bash
npm test -- --watch
```

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

### Steps to Contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/Nierowheezy/use-storage-react?tab=MIT-1-ov-file) file for details.

## Author

**Olaniyi Olabode** - [GitHub Profile](https://github.com/Nierowheezy)

## Links

- [npm package](https://www.npmjs.com/package/use-storage-react)
- [Changelog](CHANGELOG.md)

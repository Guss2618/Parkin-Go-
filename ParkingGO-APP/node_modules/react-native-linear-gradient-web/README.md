This package offers fast linear gradient implementation specifically for [React Native Web](https://www.npmjs.com/package/react-native-web).

Its exceptional speed comes from being fully stateless, meaning it avoids setState during layout events. This key difference sets it apart from similar packages like [react-native-web-linear-gradient](https://github.com/react-native-web-community/react-native-web-linear-gradient/blob/2d8db660960de6b1e39f77df4269d12bd3e9aaa0/src/index.js#L26-L29) and [expo-linear-gradient](https://github.com/expo/expo/blob/a469bf63617d00fcc9a8ffd6c50a484e66e777c8/packages/expo-linear-gradient/src/NativeLinearGradient.web.tsx#L37-L44).

Plus, this component supports the [React Compiler](https://react.dev/learn/react-compiler) out of the box.


<img width="500" src="https://github.com/user-attachments/assets/ce2ef237-7eb0-401d-a756-d1ea43df608b" />

---

## ⚠️ Warning ⚠️

Also, You don't need any third-party libraries to use linear gradients in React Native.
You can use the `experimental_backgroundImage` style property, which is available in React Native 0.76.x and later.

```tsx
import { Platform, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  gradient: Platform.select({
    web: { backgroundImage: "linear-gradient(...)" }, // works in `react-native-web` by default
    default: { experimental_backgroundImage: "linear-gradient(...)" }, // 0.76.x +
  }),
});

function App() {
  return <View style={styles.gradient} />;
}
```

---

## Installation

Install the package using either npm or yarn:

```bash
yarn add react-native-linear-gradient-web
```

## Usage

You can create a wrapper component that uses the `react-native-linear-gradient-web` package instead of `react-native-linear-gradient`:

```tsx
// ./my-linear-gradient.web.js
import LinearGradientWeb from "react-native-linear-gradient-web";
export default LinearGradientWeb;

// ./my-linear-gradient.js
import LinearGradient from "react-native-linear-gradient";
export default LinearGradient;
```

Then you can import `./my-linear-gradient.js` in your codebase, and it will work seamlessly with both web and native platforms.

```tsx
import React from "react";
import { View } from "react-native";
import LinearGradient from "./my-linear-gradient";

function App() {
  return <LinearGradient colors={["red", "gold"]} />;
}
```


or if you use a Webpack bundler you can use simply adjust your `webpack.config.js` to include the following alias:

```diff
module.exports = {
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      // ...
+     'react-native-linear-gradient': 'react-native-linear-gradient-web',
    },
  },
};
```

## Examples

- Live example [https://snack.expo.dev/linear-gradient](https://snack.expo.dev/@retyui/linear-gradient?platform=web), or use local example in `example/expo` folder.
- More examples in the original library: [react-native-linear-gradient](https://github.com/react-native-linear-gradient/react-native-linear-gradient)


## Comparison

<table>
<thead>
<tr>
<th>flickering when a component mount</th>
<th>Offest & Angle</th>
</tr>
</thead>
<tbody>
<tr>
<td>

https://github.com/user-attachments/assets/90798d01-5f93-4b87-8b60-0d6df912cbc1

</td>
<td>

https://github.com/user-attachments/assets/9fe8f1b3-b6aa-4852-a962-c25e3be529d7

</td>
</tr>
</tbody>
</table>

## Known Issues

- This package is not compatible with the Tizen runtime (SVG gradient as a background image won't work).

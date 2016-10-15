# BrakeValve Browser extensions

WIP 🚧

## Development Setup

1. Install dependencies

  ```
  $ npm install -g gulp
  $ npm install
  ```

2. Compile Javascript / SASS

  ```
  $ gulp js:bundle
  $ gulp css:bundle
  ```

3. Unpacked extension for Chrome

  ```
  $ gulp crx:package
  ```

Then load unpacked extension at `dist` directory.

# vite-plugin-literals-collector

> A plugin for Vite to collect all wanted matching characters.

## Usage

Install

```cmd
$ yarn add --D vite-plugin-literals-collector
# or npm i -D vite-plugin-literals-collector
```

Add it to `vite.config.js`

```js
// vite.config.js
import { CJK, literalsCollector } from 'vite-plugin-literals-collector'

const onResult = (result) => {
  console.log(result)
}

export default {
  plugins: [
    literalsCollector({
      target: CJK,
      onResult
    })
  ],
}
```

## Options

```ts
interface Options {
    include?: FilterPattern;
    exclude?: FilterPattern;
    target?: FilterPattern;
    formatter?: (result: string[]) => void;
    done?: (result: string[]) => void;
}
```

## Thanks

- [antfu/vite-plugin-md](https://github.com/antfu/vite-plugin-md), I learned how to write a vite-plugin from this repo.

## LICENSE

[MIT](./LICENSE)
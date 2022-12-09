# repl-ns

Namespace for REPL driven development for TypeScript/JavaScript. 
Inspired by Clojure namespaces.
Currently tested on Node.js, but potentially can be used on any JavaScript runtime (Deno, Bun, Browser and so on...)

### Why REPL driven development?

*TL;DR Because it fastest, glad and fun way to develop software. Clojure guys approve it*

Node.js development process evolved gradually. At the beginning was nothing, and developers restarted node.js from scratch manually for code testing.
Then some automation appears [nodemon](https://nodemon.io/). Fine! Now I can relax from bored `Ctrl+C` -> `UP` -> `Enter` process. But it's not enough! Restarting node.js process from scratch is very expensive! 
* Need to require in runtime all project files. Yes! All this hundreds files of your 3+ years old monolith 😊
* Seems you have TypeScript too. Need to transpile all this kind with additional time wasting (Yeah! Say hello to ts-node perf tweak and all new TypeScript compilers, which written on Rust/C++ 😀)
* And establish DB connection too
* And establish Kafka/RabbitMQ/SQS connection too
* And establish Redis connection too
* And start HTTP server too

☝️ And all this seconds wasting process for just testing one line of code, that I change?<br/>
Maybe better "restart" one function instead whole process, where this line of code was changed?

### How to use (example)

Run your node.js program with `--inpsect` flag. Exposed inspect protocol will be used for REPL driven development.

Then organize code in your project using REPL driven development friendly style:

*some-namespace.ts*

```ts
import { ns } from 'repl-ns';

export const someNS = ns('some-namespace', {
  fn() {
    return 1 + 1
  },
});
```

And call namespace related functions anywhere:

```ts
import { someNS } from 'src/some-namespace';

someNS().fn() // 2
```

Now you can replace `someNS.fn` implementation in runtime without restarting node.js process. <br/>
Just edit *some-namespace.ts*

```ts
- return 1 + 1
+ return 2 + 2
```

and use, for example, [node-remote-repl](https://github.com/darky/node-remote-repl) - `node-remote-repl some-namespace.ts`<br/>
Now anywhere `someNS().fn() // will return 4`<br/>
BTW, setup IDE for REPL driven development [VSCode example](https://github.com/darky/node-remote-repl#integration-with-ide)

Awesome! 🦄 Now fastest REPL driven development with node.js at your fingertips 

### More examples

See [tests](https://github.com/darky/repl-ns/blob/master/test.ts)

### Real projects used repl-ns

You can explain code of projects:

* [ytdl-tui](https://github.com/darky/ytdl-tui) - TUI for downloading YouTube videos, totally writen with REPL driven development approach using **repl-ns**

### Caveats

Avoid using relative paths in your project:

```ts
import { someNS } from '../../some-namespace';
```

Because REPL code is run in root and can't detect relative paths

Use non-relative paths instead:

```ts
import { someNS } from 'src/some-namespace';
```

Projects, which helps with non-relative paths:
* [tsconfig-paths](https://github.com/dividab/tsconfig-paths)
* [tsc-alias](https://github.com/justkey007/tsc-alias)

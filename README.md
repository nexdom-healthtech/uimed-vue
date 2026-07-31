# @nexdom/pkg-template

[![CI](https://github.com/nexdom-healthtech/pkg-template/actions/workflows/ci.yml/badge.svg)](https://github.com/nexdom-healthtech/pkg-template/actions/workflows/ci.yml)
[![CD](https://github.com/nexdom-healthtech/pkg-template/actions/workflows/cd.yml/badge.svg)](https://github.com/nexdom-healthtech/pkg-template/actions/workflows/cd.yml)
[![Dependabot](https://github.com/nexdom-healthtech/pkg-template/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/nexdom-healthtech/pkg-template/actions/workflows/dependabot/dependabot-updates)

> [!Warning]
> This projects is a template designed for GitHub projects. It is ready to be published on GitHub Pages and NPM.
>
> If you want to publish it on NPM, remove the `"private": true` from the `package.json` and provide a `npmToken` secret to the workflow.
>
> And if you've no intention to use it inside GitHub, be aware that you'll have to rewrite the `.github` (workflows containing CI, CD and DependaBot, along with issue and PR templates) directory according to your tools.

> [!Tip]
> After copy this template to your project, update the `package.json` with your project information and links. Remember to search for those links in other files, to update them too.
>
> Also, update this `README` describing your library features and how to use it.
>
> Before pushing changes to the `main` branch (through a `pull request`, since straight pushes must be forbidden), the author of the `push` mush have privileges enough to generate tags and release on GitHub.

A template for creating NEXDOM flavor libraries **using Vite+ and TypeScript**.

For more examples and information, check the [docs page](https://nexdom-healthtech.github.io/pkg-template/).

## 💻 Get started

### Install

```bash
vp add @nexdom/pkg-template
# But, if you're not using Vite+ yet...
npm i @nexdom/pkg-template
# Or
pnpm add @nexdom/pkg-template
# Or
yarn add @nexdom/pkg-template
```

### Usage

```ts
import { sayHello } from "@nexdom/pkg-template";

const helloMessage = sayHello();

// Will print "Hello, NEXTERS!"
console.log(helloMessage);
```

## 🧱 Contribute

Help us improve our community.

Report an [issue](https://github.com/nexdom-healthtech/pkg-template/issues) you've found or check our [Contribution Guide](./CONTRIBUTING.md) to learn how to code in our project and open your own PRs to us.

## 📄 License

[MIT License](./LICENSE) © 2026-PRESENT NEXDOM

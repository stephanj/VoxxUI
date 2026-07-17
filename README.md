# VoxxUI

VoxxUI is an open source UI component library for [Angular](https://angular.dev), maintained for the
[cfp.dev](https://devoxx.com) conference platform (Devoxx & VoxxedDays call-for-papers and program apps).

It is a lean, focused fork of [PrimeNG](https://github.com/primefaces/primeng) v21 (MIT):
the component set is pruned to what the CFP platform actually uses (62 components, audited against the
production bundles — see `docs/CFP-COMPONENT-AUDIT.md`), and the public API is renamed:

| PrimeNG | VoxxUI |
| --- | --- |
| `npm install primeng` | `npm install voxx-ui` |
| `import { ButtonModule } from 'primeng/button'` | `import { ButtonModule } from 'voxx-ui/button'` |
| `<p-button>`, `<p-table>` | `<vx-button>`, `<vx-table>` |
| `pTooltip`, `pTemplate`, `pInputText` | `vxTooltip`, `vxTemplate`, `vxInputText` |
| `providePrimeNG(...)` | `provideVoxxUI(...)` |

Styling still builds on the [PrimeUIX](https://github.com/primefaces/primeuix) theming packages
(`@primeuix/themes`, `@primeuix/styles`), so `.p-*` CSS classes and design tokens work unchanged.

## Monorepo layout

- `packages/primeng` — the `voxx-ui` component library (Angular 21)
- `packages/themes` — `@voxxui/themes` re-exports
- `packages/mcp` — `@voxxui/mcp`, a Model Context Protocol server for the library
- `apps/showcase` — documentation & demo application

## Development

```bash
pnpm install
pnpm run build:lib        # build the voxx-ui package
pnpm run dev              # run the showcase
pnpm run test:unit        # unit tests
```

## License

MIT — see [LICENSE.md](./LICENSE.md).

VoxxUI is a derivative work of PrimeNG, Copyright (c) PrimeTek, used under the MIT license.
PrimeNG and PrimeTek are trademarks of PrimeTek Bilişim A.Ş.; this project is not affiliated
with or endorsed by PrimeTek.

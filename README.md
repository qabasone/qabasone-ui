# @qabasone/qabasone-ui

Reusable Qabasone UI components and form building utilities for React applications.

## Installation

Install the package into your React app:

```bash
npm install @qabasone/qabasone-ui
# or
pnpm add @qabasone/qabasone-ui
# or
yarn add @qabasone/qabasone-ui
```

> This package has peer dependencies on `react` and `react-dom`.

If you are using GitHub Packages for the `@qabasone` scope, make sure your registry configuration is correct:

```bash
npm config set @qabasone:registry https://npm.pkg.github.com
```

## Usage

### Core imports

The package exports reusable components from the package root and from the `ui`/`components` namespace.

```tsx
import {
  Button,
  Toast,
  ConfirmModal,
  ContextMenu,
  EntityLink,
  Pagination,
  SearchableDropdowns,
} from '@qabasone/qabasone-ui';
```

### Direct component imports

For more granular imports, use the scoped `components` path:

```tsx
import { Button } from '@qabasone/qabasone-ui/components/atoms';
import { Sidebar } from '@qabasone/qabasone-ui/components/organisms';
import { useToast } from '@qabasone/qabasone-ui/components/hooks';
```

### Example: Button

```tsx
import { Button } from '@qabasone/qabasone-ui';

export function Example() {
  return (
    <Button variant="primary" size="md" onClick={() => alert('Clicked')}>
      Save changes
    </Button>
  );
}
```

### Example: Sidebar

```tsx
import { Sidebar } from '@qabasone/qabasone-ui/components/organisms';

const sidebarGroups = [
  {
    id: 'main',
    label: 'Navigation',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: undefined },
      { id: 'reports', label: 'Reports', icon: undefined },
    ],
  },
];

const user = {
  name: 'Jane Doe',
  initials: 'JD',
  email: 'jane.doe@example.com',
};

const company = { name: 'Qabasone', logoUrl: '' };

export function AppSidebar() {
  return (
    <Sidebar
      groups={sidebarGroups}
      user={user}
      userMenuGroups={[]}
      company={company}
    />
  );
}
```

### Example: Toast + useToast

```tsx
import { Toast } from '@qabasone/qabasone-ui';
import { useToast } from '@qabasone/qabasone-ui/components/hooks';

export function NotificationExample() {
  const toast = useToast();

  return (
    <>
      <Button onClick={() => toast.success('Saved successfully')}>
        Show toast
      </Button>
      <Toast />
    </>
  );
}
```

## Available export paths

- `@qabasone/qabasone-ui` — shared UI entrypoint
- `@qabasone/qabasone-ui/ui` — UI utilities and core exports
- `@qabasone/qabasone-ui/components` — component collection
- `@qabasone/qabasone-ui/components/atoms` — atom-level UI primitives
- `@qabasone/qabasone-ui/components/molecules` — composite components
- `@qabasone/qabasone-ui/components/organisms` — full layout and page-level patterns
- `@qabasone/qabasone-ui/components/hooks` — reusable React hooks
- `@qabasone/qabasone-ui/style.css` — shared package styles

## Best practices

- Import only the components you need to keep bundle sizes small.
- Use the semantic `action` and `variant` props on `Button` for consistent application styling.
- Combine `components/organisms` and `components/molecules` with your app layout for reusable page patterns.

## Contributing

If you want to extend the UI package, update components in `src/ui/components` and rebuild with:

```bash
npm run build
```

## License

See the repository license for details.


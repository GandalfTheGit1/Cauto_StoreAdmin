# Shared Components

This directory contains reusable shared components used throughout the application.

## Error Handling Components

### ErrorBoundary
Global error boundary component that catches React errors and displays a user-friendly error page.

```tsx
import { ErrorBoundary } from '@/components/shared'

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### InlineErrorBoundary
Lightweight error boundary for inline components that shows an alert instead of a full page.

```tsx
import { InlineErrorBoundary } from '@/components/shared'

<InlineErrorBoundary message="Failed to load chart">
  <Chart data={data} />
</InlineErrorBoundary>
```

## Loading & Async Components

### Loading
Component for displaying loading states with spinner.

```tsx
import { Loading } from '@/components/shared'

<Loading loading={isLoading} type="cover">
  <YourContent />
</Loading>
```

### AsyncContent
Comprehensive component that handles loading, error, and empty states.

```tsx
import { AsyncContent } from '@/components/shared'

<AsyncContent
  loading={isLoading}
  error={error}
  isEmpty={data.length === 0}
  emptyState={<EmptyState />}
  onRetry={refetch}
>
  <YourContent data={data} />
</AsyncContent>
```

### EmptyState
Component for displaying empty state messages with optional actions.

```tsx
import { EmptyState } from '@/components/shared'

<EmptyState
  title="No products found"
  description="Start by adding your first product"
  action={{
    label: "Add Product",
    onClick: handleAddProduct
  }}
/>
```

## Responsive Components

### ResponsiveTable
Wrapper for tables that makes them mobile-friendly with horizontal scrolling.

```tsx
import { ResponsiveTable } from '@/components/shared'

<ResponsiveTable>
  <Table>
    {/* table content */}
  </Table>
</ResponsiveTable>
```

### ResponsiveCardList
Displays data as cards on mobile instead of tables.

```tsx
import { ResponsiveCardList } from '@/components/shared'

<ResponsiveCardList
  data={items}
  renderCard={(item) => (
    <div>
      <h3>{item.name}</h3>
      <p>{item.description}</p>
    </div>
  )}
/>
```

### ResponsiveGrid
Grid component that adapts column count based on screen size.

```tsx
import { ResponsiveGrid } from '@/components/shared'

<ResponsiveGrid
  columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
  gap={4}
>
  {items.map(item => <Card key={item.id}>{item.name}</Card>)}
</ResponsiveGrid>
```

### ResponsiveContainer
Container with responsive padding.

```tsx
import { ResponsiveContainer } from '@/components/shared'

<ResponsiveContainer
  mobilePadding="p-4"
  desktopPadding="p-6"
>
  <YourContent />
</ResponsiveContainer>
```

## Responsive Breakpoints

The application uses the following Tailwind breakpoints:

- `xs`: 576px
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Use the `useResponsive` hook to detect screen sizes:

```tsx
import useResponsive from '@/utils/hooks/useResponsive'

const { smaller, larger } = useResponsive()

if (smaller.md) {
  // Mobile view
}

if (larger.lg) {
  // Desktop view
}
```

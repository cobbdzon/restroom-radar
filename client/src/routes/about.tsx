import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <h1>Restroom Radar</h1>
    A platform to aggregate reviews on all restrooms available in the campus.
  </div>
}

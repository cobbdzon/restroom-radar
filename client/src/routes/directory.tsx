import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/directory')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/directory"!</div>
}

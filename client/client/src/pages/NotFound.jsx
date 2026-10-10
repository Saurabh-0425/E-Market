import { Empty } from '../components/ui';

export default function NotFound() {
  return (
    <div className="px-4 py-20">
      <Empty title="Page not found" text="The page you're looking for doesn't exist or has moved." to="/" cta="Go to home" />
    </div>
  );
}

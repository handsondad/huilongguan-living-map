import { LivingMap } from '../map/LivingMap';
import { TOPICS } from '../topics/index';

export function HomePage({ last, onOpen }: { last: string | null; onOpen: (topicId: string) => void }) {
  return (
    <div className="home">
      <h1 className="sr-only">我家住在回龙观</h1>
      <LivingMap topics={TOPICS} last={last} onOpen={onOpen} />
    </div>
  );
}

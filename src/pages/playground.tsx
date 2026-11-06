import {useState, type ReactNode} from 'react';
import {LuLightbulb} from 'react-icons/lu';
import Layout from '@theme/Layout';
import {translate} from '@docusaurus/Translate';
import Playground from '@site/src/components/Playground';
import styles from './playground.module.css';

// The home example (checkout and inventory contexts) as one file: the playground
// compiles a single string. inventory-service writes to stock-db, which does not exist.
const CHECKOUT = `apiVersion: asl/v1
kind: Relationship
metadata:
  name: inventory-relations
spec:
  relations:
    - from:
        kind: Application
        name: inventory-service
      to:
        kind: Topic
        name: order-events
      type: consumes
    - from:
        kind: Application
        name: inventory-service
      to:
        kind: Database
        name: stock-db
      type: writes
---
apiVersion: asl/v1
kind: Relationship
metadata:
  name: checkout-relations
spec:
  relations:
    - from:
        kind: Application
        name: checkout-service
      to:
        kind: Topic
        name: order-events
      type: produces
    - from:
        kind: Application
        name: checkout-service
      to:
        kind: Database
        name: orders-db
      type: writes
---
apiVersion: asl/v1
kind: Application
metadata:
  name: checkout-service
  description: Takes the cart, charges the customer and publishes an event for each order placed
  labels:
    owner: team-checkout
spec:
  providers:
    aws: EKS
  language: Go
  interfaces:
    - name: checkout-api
      protocol: HTTPS
      type: sync
      flow: ingress
---
apiVersion: asl/v1
kind: Database
metadata:
  name: orders-db
  description: Orders, their items and their payment status
  labels:
    owner: team-checkout
spec:
  providers:
    aws: RDSPostgreSQL
---
apiVersion: asl/v1
kind: Topic
metadata:
  name: order-events
  description: One event per order placed
spec:
  providers:
    aws: MSK
  messageFormat: Avro
---
apiVersion: asl/v1
kind: Application
metadata:
  name: inventory-service
  description: Reserves stock for each order placed and keeps the available quantity per product
  labels:
    owner: team-catalog
spec:
  providers:
    aws: EKS
  language: Go
  interfaces:
    - name: stock-api
      protocol: GRPC
      type: sync
      flow: ingress
---
apiVersion: asl/v1
kind: Database
metadata:
  name: inventory-db
  description: Available quantity and reservations per product
  labels:
    owner: team-catalog
spec:
  providers:
    aws: RDSPostgreSQL
`;

const DATABASE = `apiVersion: asl/v1
kind: Database
metadata:
  name: orders-db
  description: Orders, their items and their payment status
  labels:
    owner: team-checkout
spec:
  providers:
    aws: RDSPostgreSQL
`;

const EVENTS = `apiVersion: asl/v1
kind: Relationship
metadata:
  name: event-relations
spec:
  relations:
    - from:
        kind: Application
        name: checkout-service
      to:
        kind: Topic
        name: order-events
      type: produces
    - from:
        kind: Application
        name: notification-service
      to:
        kind: Topic
        name: order-events
      type: consumes
---
apiVersion: asl/v1
kind: Application
metadata:
  name: checkout-service
  description: Publishes an event for each order placed
spec:
  providers:
    aws: EKS
  language: Go
---
apiVersion: asl/v1
kind: Application
metadata:
  name: notification-service
  description: Tells the customer that the order was placed
spec:
  providers:
    aws: EKS
  language: Go
---
apiVersion: asl/v1
kind: Topic
metadata:
  name: order-events
  description: One event per order placed
spec:
  providers:
    aws: MSK
  messageFormat: Avro
`;

// Text between backticks is shown as code.
const renderCode = (text: string): ReactNode =>
  text.split('`').map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part));

const getExamples = () => [
  {
    id: 'database',
    source: DATABASE,
    label: translate({id: 'asl.playgroundPage.example.database', message: 'Single database'}),
    hint: translate({
      id: 'asl.playgroundPage.example.database.hint',
      message: 'The smallest manifest. Try removing a field or misspelling a provider.',
    }),
  },
  {
    id: 'events',
    source: EVENTS,
    label: translate({id: 'asl.playgroundPage.example.events', message: 'Event-driven'}),
    hint: translate({
      id: 'asl.playgroundPage.example.events.hint',
      message: 'One service produces, another consumes. Change a relation to a name that does not exist.',
    }),
  },
  {
    id: 'checkout',
    source: CHECKOUT,
    label: translate({id: 'asl.playgroundPage.example.checkout', message: 'Checkout and inventory'}),
    hint: translate({
      id: 'asl.playgroundPage.example.checkout.hint',
      message: 'Two services sharing an event. Rename `stock-db` to `inventory-db` to fix the error.',
    }),
  },
];

export default function PlaygroundPage(): ReactNode {
  const title = translate({id: 'asl.playgroundPage.title', message: 'Playground'});
  const hint = translate({
    id: 'asl.playgroundPage.hint',
    message: 'Edit the architecture and the compiler answers as you type. Pick an example to start from.',
  });
  const examples = getExamples();
  const [selected, setSelected] = useState(examples[0].id);
  const example = examples.find((e) => e.id === selected) ?? examples[0];
  return (
    <Layout title={title} description={hint}>
      <main className={`container ${styles.page}`}>
        <header className={styles.header}>
          <h1 className={styles.h1}>{title}</h1>
          <p className={styles.hint}>{hint}</p>
          <div
            className={styles.examples}
            role="group"
            aria-label={translate({id: 'asl.playgroundPage.examples', message: 'Examples'})}>
            {examples.map((e) => (
              <button
                key={e.id}
                type="button"
                className={`${styles.example} ${e.id === selected ? styles.exampleActive : ''}`}
                aria-pressed={e.id === selected}
                onClick={() => setSelected(e.id)}>
                {e.label}
              </button>
            ))}
          </div>
          <p className={styles.exampleHint}>
            <LuLightbulb className={styles.exampleHintIcon} aria-hidden />
            <span>{renderCode(example.hint)}</span>
          </p>
        </header>
        <Playground key={example.id} initialSource={example.source} fileName="architecture.asl.yaml" />
      </main>
    </Layout>
  );
}

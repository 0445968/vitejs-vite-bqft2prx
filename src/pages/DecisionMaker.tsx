import { useState } from 'react';
import { Dice5, Shuffle } from 'lucide-react';

export function DecisionMaker() {
  const [coin, setCoin] = useState('Heads');
  const [dice, setDice] = useState(1);
  const [items, setItems] = useState('Pizza\nBurgers\nTacos\nSushi');
  const [picked, setPicked] = useState('');

  const flipCoin = () => {
    setCoin(Math.random() > 0.5 ? 'Heads' : 'Tails');
  };

  const rollDice = () => {
    setDice(Math.floor(Math.random() * 6) + 1);
  };

  const pickItem = () => {
    const list = items
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    if (list.length === 0) return;

    setPicked(list[Math.floor(Math.random() * list.length)]);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-[color:var(--qu-accent-strong)]">
          Randomizer
        </p>
        <h2 className="text-3xl font-black tracking-tight text-[color:var(--qu-text)]">
          Decision Maker
        </h2>
        <p className="mt-2 hub-muted">
          Flip a coin, roll dice, or randomly pick from a custom list.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="hub-card rounded-3xl p-6">
          <h3 className="text-xl font-black text-[color:var(--qu-text)]">
            Coin flip
          </h3>
          <div className="my-8 flex h-32 items-center justify-center rounded-full bg-[color:var(--qu-accent-soft)] text-4xl font-black text-[color:var(--qu-accent-strong)]">
            {coin}
          </div>
          <button onClick={flipCoin} className="hub-button w-full">
            <Shuffle className="h-4 w-4" />
            Flip coin
          </button>
        </section>

        <section className="hub-card rounded-3xl p-6">
          <h3 className="text-xl font-black text-[color:var(--qu-text)]">
            Dice roll
          </h3>
          <div className="my-8 flex h-32 items-center justify-center rounded-3xl bg-[color:var(--qu-surface-soft)] text-6xl font-black text-[color:var(--qu-text)]">
            {dice}
          </div>
          <button onClick={rollDice} className="hub-button w-full">
            <Dice5 className="h-4 w-4" />
            Roll dice
          </button>
        </section>

        <section className="hub-card rounded-3xl p-6">
          <h3 className="text-xl font-black text-[color:var(--qu-text)]">
            List picker
          </h3>

          <textarea
            value={items}
            onChange={(event) => setItems(event.target.value)}
            rows={6}
            className="hub-input mt-4 resize-none"
            placeholder="Add one item per line..."
          />

          <button onClick={pickItem} className="hub-button mt-4 w-full">
            Pick random item
          </button>

          {picked && (
            <div className="mt-4 rounded-2xl bg-[color:var(--qu-accent-soft)] p-4 text-center">
              <p className="text-sm font-bold hub-muted">Picked</p>
              <p className="text-2xl font-black text-[color:var(--qu-text)]">
                {picked}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
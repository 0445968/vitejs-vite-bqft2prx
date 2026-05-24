import { useMemo, useState } from 'react';
import { Plus, Trash2, Utensils } from 'lucide-react';

type Ingredient = {
  id: string;
  name: string;
  amount: number;
  unit: string;
};

const starterIngredients: Ingredient[] = [
  { id: '1', name: 'Flour', amount: 2, unit: 'cups' },
  { id: '2', name: 'Sugar', amount: 1, unit: 'cup' },
  { id: '3', name: 'Butter', amount: 0.5, unit: 'cup' },
];

export function RecipeScaler() {
  const [originalServings, setOriginalServings] = useState(4);
  const [targetServings, setTargetServings] = useState(8);
  const [ingredients, setIngredients] = useState<Ingredient[]>(starterIngredients);

  const scaleFactor = useMemo(() => {
    if (originalServings <= 0) return 1;
    return targetServings / originalServings;
  }, [originalServings, targetServings]);

  const addIngredient = () => {
    setIngredients((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: '',
        amount: 1,
        unit: 'unit',
      },
    ]);
  };

  const updateIngredient = (
    id: string,
    field: keyof Omit<Ingredient, 'id'>,
    value: string | number
  ) => {
    setIngredients((current) =>
      current.map((ingredient) =>
        ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
      )
    );
  };

  const removeIngredient = (id: string) => {
    setIngredients((current) =>
      current.filter((ingredient) => ingredient.id !== id)
    );
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-[color:var(--qu-accent-strong)]">
          Cooking
        </p>
        <h2 className="text-3xl font-black tracking-tight text-[color:var(--qu-text)]">
          Recipe Ingredient Scaler
        </h2>
        <p className="mt-2 hub-muted">
          Scale recipe ingredients up or down based on serving size.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="hub-card rounded-3xl p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
                  Original servings
                </span>
                <input
                  type="number"
                  min="1"
                  value={originalServings}
                  onChange={(event) =>
                    setOriginalServings(Number(event.target.value))
                  }
                  className="hub-input"
                />
              </label>

              <label>
                <span className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
                  Target servings
                </span>
                <input
                  type="number"
                  min="1"
                  value={targetServings}
                  onChange={(event) =>
                    setTargetServings(Number(event.target.value))
                  }
                  className="hub-input"
                />
              </label>
            </div>
          </div>

          <div className="hub-card rounded-3xl p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-[color:var(--qu-text)]">
                  Ingredients
                </h3>
                <p className="text-sm hub-muted">
                  Add each ingredient and the scaled result updates instantly.
                </p>
              </div>

              <button type="button" onClick={addIngredient} className="hub-button">
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>

            <div className="grid gap-3">
              {ingredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className="grid gap-3 rounded-2xl border border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] p-3 sm:grid-cols-[1fr_120px_120px_auto]"
                >
                  <input
                    value={ingredient.name}
                    onChange={(event) =>
                      updateIngredient(ingredient.id, 'name', event.target.value)
                    }
                    className="hub-input"
                    placeholder="Ingredient name"
                  />

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={ingredient.amount}
                    onChange={(event) =>
                      updateIngredient(
                        ingredient.id,
                        'amount',
                        Number(event.target.value)
                      )
                    }
                    className="hub-input"
                    placeholder="Amount"
                  />

                  <input
                    value={ingredient.unit}
                    onChange={(event) =>
                      updateIngredient(ingredient.id, 'unit', event.target.value)
                    }
                    className="hub-input"
                    placeholder="Unit"
                  />

                  <button
                    type="button"
                    onClick={() => removeIngredient(ingredient.id)}
                    className="hub-icon-button"
                    aria-label="Remove ingredient"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="hub-card h-fit rounded-3xl p-6">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]">
            <Utensils className="h-7 w-7" />
          </div>

          <h3 className="text-xl font-black text-[color:var(--qu-text)]">
            Scaled recipe
          </h3>

          <div className="mt-4 rounded-2xl bg-[color:var(--qu-accent-soft)] p-4">
            <p className="text-sm font-bold hub-muted">Scale factor</p>
            <p className="text-3xl font-black text-[color:var(--qu-text)]">
              {scaleFactor.toFixed(2)}x
            </p>
          </div>

          <div className="mt-5 grid gap-3">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="rounded-2xl bg-[color:var(--qu-surface-soft)] p-4"
              >
                <p className="font-black text-[color:var(--qu-text)]">
                  {ingredient.name || 'Unnamed ingredient'}
                </p>
                <p className="mt-1 text-sm font-bold hub-muted">
                  {(ingredient.amount * scaleFactor).toFixed(2)} {ingredient.unit}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
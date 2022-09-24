import { useState } from 'react';
import './app.css';
import { Pokemon, Stat, useApplicationContext } from './store';

export const App = () => {
  const [name, setName] = useState<string>('');
  const { handleSearchPokemon } = useApplicationContext();

  return (
    <main>
      <h1>Pokemon</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={() => handleSearchPokemon(name)}>Search</button>
      <PokemonInfo />
    </main>
  );
};

type PokemonInfo = {
  name: string;
  front_default: string;
  back_default: string;
  front_shiny: string;
  back_shiny: string;
  stats: Stat[];
  level: number;
};

export const PokemonInfo = () => {
  const { state, handleLevelUp } = useApplicationContext();

  return state.pokemon ? (
    <div>
      <h2>
        {state.pokemon.name} Level: {state.level}
      </h2>

      <img src={state.pokemon.sprites.front_default} alt={state.pokemon.name} />
      <img src={state.pokemon.sprites.back_default} alt={state.pokemon.name} />
      <img src={state.pokemon.sprites.front_shiny} alt={state.pokemon.name} />
      <img src={state.pokemon.sprites.back_shiny} alt={state.pokemon.name} />
      <PokemonStats stats={state.pokemon.stats} level={state.level} />
      <button onClick={handleLevelUp}>LEVEL UP+</button>
    </div>
  ) : null;
};

const PokemonStats = ({
  stats,
  level,
}: {
  stats: Pokemon['stats'];
  level: number;
}) => {
  return (
    <div>
      <h3>Stats</h3>
      <ul>
        {stats.map((stat) => (
          <li key={stat.stat.name}>
            {stat.stat.name}:{' '}
            {stat.base_stat + level * Math.floor(stat.base_stat / 10)}
          </li>
        ))}
      </ul>
    </div>
  );
};

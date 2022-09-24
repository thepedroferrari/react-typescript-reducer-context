/*
  All state should exist here
  Use Reducer so that we can have a single source of truth
  Save Pokemon in new Map and cache it
  Searching for the same Pokemon should not trigger a new request unless the cache is cleared or
  5 minutes have passed
  Only a few actions can be made
  Fetching happens inside of the store
*/

import React, { createContext, useContext, useReducer } from 'react';

enum Actions {
  LEVEL_UP = 'LEVEL_UP',
  SEARCH_POKEMON = 'SEARCH_POKEMON',
}

interface ApplicationState {
  pokemon: Pokemon | undefined;
  pokemonCache: Record<Pokemon['name'], Pokemon>;
  level: number;
}
type ApplicationActions =
  | { type: Actions.LEVEL_UP; payload?: undefined }
  | { type: Actions.SEARCH_POKEMON; payload: { pokemon: Pokemon } };

const POKEMON_API_URL = 'https://pokeapi.co/api/v2/pokemon/';

const fetchPokemon = async (name: string): Promise<Pokemon> => {
  const response = await fetch(`${POKEMON_API_URL}${name}`);
  const data = await response.json();
  return data;
};

const appReducer = (state: ApplicationState, action: ApplicationActions) => {
  const { type, payload } = action;
  switch (type) {
    case Actions.LEVEL_UP:
      return {
        ...state,
        level: state.level + 1,
      };
    case Actions.SEARCH_POKEMON:
      return {
        ...state,
        pokemon: payload.pokemon,
        pokemonCache: {
          ...state.pokemonCache,
          [payload.pokemon.name]: { ...payload.pokemon },
        },
        level: 1,
      };
    default:
      return state;
  }
};

const INITIAL_STATE: ApplicationState = {
  pokemon: undefined,
  pokemonCache: {},
  level: 1,
};

const ApplicationContext = createContext<{
  state: ApplicationState;
  dispatch: React.Dispatch<ApplicationActions>;
  handleLevelUp: () => void;
  handleSearchPokemon: (name: string) => void;
}>({
  state: INITIAL_STATE,
  dispatch: () => {},
  handleLevelUp: () => {},
  handleSearchPokemon: () => {},
});

const useApplicationState = (): {
  state: ApplicationState;
  dispatch: React.Dispatch<ApplicationActions>;
  handleLevelUp: () => void;
  handleSearchPokemon: (name: string) => void;
} => {
  const [state, dispatch] = useReducer(appReducer, INITIAL_STATE);

  const handleLevelUp = () => {
    dispatch({ type: Actions.LEVEL_UP });
  };

  const handleSearchPokemon = async (name: string) => {
    const cachedPokemon = state.pokemonCache[name];
    console.log({ cachedPokemon });
    if (cachedPokemon) {
      dispatch({
        type: Actions.SEARCH_POKEMON,
        payload: { pokemon: cachedPokemon },
      });
    } else {
      const pokemon = await fetchPokemon(name);
      if (pokemon) {
        dispatch({ type: Actions.SEARCH_POKEMON, payload: { pokemon } });
      }
    }
  };

  return {
    state,
    dispatch,
    handleLevelUp,
    handleSearchPokemon,
  };
};

export const ApplicationContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <ApplicationContext.Provider value={useApplicationState()}>
    {children}
  </ApplicationContext.Provider>
);

export const useApplicationContext = () => useContext(ApplicationContext);

export interface Pokemon {
  abilities: Ability2[];
  base_experience: number;
  forms: Ability[];
  game_indices: Gameindex[];
  height: number;
  held_items: Helditem[];
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: Move[];
  name: string;
  order: number;
  past_types: any[];
  species: Ability;
  sprites: Sprites;
  stats: Stat[];
  types: Type[];
  weight: number;
}

export interface Type {
  slot: number;
  type: Ability;
}

export interface Stat {
  base_stat: number;
  effort: number;
  stat: Ability;
}

export interface Sprites {
  back_default: string;
  back_female?: any;
  back_shiny: string;
  back_shiny_female?: any;
  front_default: string;
  front_female?: any;
  front_shiny: string;
  front_shiny_female?: any;
  other: Other;
  versions: Versions;
}

export interface Versions {
  'generation-i': Generationi;
  'generation-ii': Generationii;
  'generation-iii': Generationiii;
  'generation-iv': Generationiv;
  'generation-v': Generationv;
  'generation-vi': Generationvi;
  'generation-vii': Generationvii;
  'generation-viii': Generationviii;
}

export interface Generationviii {
  icons: Dreamworld;
}

export interface Generationvii {
  icons: Dreamworld;
  'ultra-sun-ultra-moon': Home;
}

export interface Generationvi {
  'omegaruby-alphasapphire': Home;
  'x-y': Home;
}

export interface Generationv {
  'black-white': Blackwhite;
}

export interface Blackwhite {
  animated: Diamondpearl;
  back_default: string;
  back_female?: any;
  back_shiny: string;
  back_shiny_female?: any;
  front_default: string;
  front_female?: any;
  front_shiny: string;
  front_shiny_female?: any;
}

export interface Generationiv {
  'diamond-pearl': Diamondpearl;
  'heartgold-soulsilver': Diamondpearl;
  platinum: Diamondpearl;
}

export interface Diamondpearl {
  back_default: string;
  back_female?: any;
  back_shiny: string;
  back_shiny_female?: any;
  front_default: string;
  front_female?: any;
  front_shiny: string;
  front_shiny_female?: any;
}

export interface Generationiii {
  emerald: Emerald;
  'firered-leafgreen': Fireredleafgreen;
  'ruby-sapphire': Fireredleafgreen;
}

export interface Fireredleafgreen {
  back_default: string;
  back_shiny: string;
  front_default: string;
  front_shiny: string;
}

export interface Emerald {
  front_default: string;
  front_shiny: string;
}

export interface Generationii {
  crystal: Crystal;
  gold: Gold;
  silver: Gold;
}

export interface Gold {
  back_default: string;
  back_shiny: string;
  front_default: string;
  front_shiny: string;
  front_transparent: string;
}

export interface Crystal {
  back_default: string;
  back_shiny: string;
  back_shiny_transparent: string;
  back_transparent: string;
  front_default: string;
  front_shiny: string;
  front_shiny_transparent: string;
  front_transparent: string;
}

export interface Generationi {
  'red-blue': Redblue;
  yellow: Redblue;
}

export interface Redblue {
  back_default: string;
  back_gray: string;
  back_transparent: string;
  front_default: string;
  front_gray: string;
  front_transparent: string;
}

export interface Other {
  dream_world: Dreamworld;
  home: Home;
  'official-artwork': Officialartwork;
}

export interface Officialartwork {
  front_default: string;
}

export interface Home {
  front_default: string;
  front_female?: any;
  front_shiny: string;
  front_shiny_female?: any;
}

export interface Dreamworld {
  front_default: string;
  front_female?: any;
}

export interface Move {
  move: Ability;
  version_group_details: Versiongroupdetail[];
}

export interface Versiongroupdetail {
  level_learned_at: number;
  move_learn_method: Ability;
  version_group: Ability;
}

export interface Helditem {
  item: Ability;
  version_details: Versiondetail[];
}

export interface Versiondetail {
  rarity: number;
  version: Ability;
}

export interface Gameindex {
  game_index: number;
  version: Ability;
}

export interface Ability2 {
  ability: Ability;
  is_hidden: boolean;
  slot: number;
}

export interface Ability {
  name: string;
  url: string;
}

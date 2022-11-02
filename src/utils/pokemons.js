export const pokemons = {
    charmander: {
        name: "charmander",
        attacks: [{ type: "Fire", name: "attack1" }, { type: "Fire", name: "attack2" }],
        weakness: ["Watter"],
        type: "Fire",
        damage:10,
        life: 100,
        defense: 10,
        speed: 4
    },
    squirtle: {
        name: "squirtle",
        attacks: [{ type: "Water", name: "attack1" }, { type: "Water", name: "attack2" }],
        weakness: ["Grass"],
        type: "Water",
        damage:8,
        life: 120,
        defense: 10,
        speed: 4
    },
}

export const player = {
    selectedPokemon: pokemons["charmander"],
    pokemons: [pokemons["charmander"]],
    money: 0,
    items: {
        potion: {
            name: "",
            nebulaEffect: "",
            _func: () => { }
        },
        damageBoost: {
            name: "",
            nebulaEffect: "",
            _func: () => { }
        }

    }
}

export const Enemy = {
    selectedPokemon: pokemons["squirtle"],
    pokemons: [pokemons["squirtle"]],
    items: {
        potion: {
            name: "",
            nebulaEffect: "",
            _func: () => { }
        },
        damageBoost: {
            name: "",
            nebulaEffect: "",
            _func: () => { }
        }

    }
}
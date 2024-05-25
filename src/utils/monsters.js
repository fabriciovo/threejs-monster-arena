export const monsters = {
    charmander: {
        name: "charmander",
        attacks: [{ type: "Fire", name: "attack1" }, { type: "Fire", name: "attack2" }],
        weakness: ["Watter"],
        type: "Fire",
        damage:10,
        life: 100,
        defense: 10,
        speed: 4,
        animationType:"humanoid"
    },
    squirtle: {
        name: "squirtle",
        attacks: [{ type: "Water", name: "attack1" }, { type: "Water", name: "attack2" }],
        weakness: ["Grass"],
        type: "Water",
        damage:8,
        life: 120,
        defense: 10,
        speed: 4,        
        animationType:"humanoid"

    },
    rattata: {
        name: "rattata",
        attacks: [{ type: "Normal", name: "attack1" }, { type: "Normal", name: "attack2" }],
        weakness: [""],
        type: "Normal",
        damage:8,
        life: 120,
        defense: 10,
        speed: 4
    },
    ekans: {
        name: "ekans",
        attacks: [{ type: "Normal", name: "attack1" }, { type: "Normal", name: "attack2" }],
        weakness: [""],
        type: "Normal",
        damage:8,
        life: 120,
        defense: 10,
        speed: 4
    },
}

export const player = {
    selectedMonster: monsters.ekans,
    monsters: [monsters.ekans],
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
    selectedMonster: monsters.rattata,
    monsters: [monsters.rattata],
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
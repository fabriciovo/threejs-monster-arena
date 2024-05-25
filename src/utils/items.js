 const itemsList = {
  potion: {
    name: "",
    img: "",
    func: (monster) => {
      console.log("Heal monster health " + monster.name);
    },
    price: 10
  },
  damageBoost: {
    name: "",
    img: "",
    func: (monster) => {
      console.log("Damage Boost monster health " + monster.name);
    },
    price: 10
  },
  revive: {
    name: "",
    img: "",
    func: (monster) => {
      console.log("Revive monster health " + monster.name);
    },
    price: 10
  },
  healthBoost: {
    name: "",
    img: "",
    func: (monster) => {
      console.log("Health Boost monster health " + monster.name);
    },
    price: 10
  },
};

export default itemsList;
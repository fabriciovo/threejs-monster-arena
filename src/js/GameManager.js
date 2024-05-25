import { EventDispatcher } from "three";
import TitleScene from "./titleScreen";

export default class GameManager {
  constructor() {
    this.Events = [];
    this.Events['startgame'] = new EventDispatcher();
    this.Events['changescene'] = new EventDispatcher();

    this.Player = undefined;
    this.startScene = new TitleScene();
    this.currentScene = this.startScene;
   
  }

  StartGame(){
    this.currentScene.InitScene();
  }

  _startGame(){
    this.currentScene.InitScene();
  }

  _changeScene(){
    // switch(sceneName){
    //   case 'TitleScene':

    //   break;
    //   case 'TitleScene':

    //   break;
    //   case 'TitleScene':

    //   break;
    // }
  }


  
}

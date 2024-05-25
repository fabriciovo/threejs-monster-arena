import GameScene from "./gameScene";
import TitleScene from "./titleScreen";

export default class GameManager {
  constructor() {
    this.Player = undefined;
    this.startScene = new TitleScene();
    this.currentScene = this.startScene;
   

    this._documentEvents();
  }

  _documentEvents(){
    document.addEventListener('startgame', () => {
      this._changeScene();
    });
  }

  StartGame(){
    this.currentScene.InitScene();
  }

  _startGame(){
    this.currentScene.InitScene();
  }

  _changeScene(){
    this.currentScene.DestroyScene();
    this.currentScene = null;
    this.currentScene = new GameScene();
    this.currentScene.InitScene();
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

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";


export async function loaderFBX(fbxFile) {
  const fbxloader = new FBXLoader();

  const fbxObject = await fbxloader.loadAsync(fbxFile);

  return fbxObject;
}

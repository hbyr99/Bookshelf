import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
//import { CapacitorPluginMlKitTextRecognition } from '@pantrist/capacitor-plugin-ml-kit-text-recognition';
@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  constructor() {}

  public async takePhoto() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100,
    });
    /*
    const res = await CapacitorPluginMlKitTextRecognition.detectText({
      base64Image: capturedPhoto.base64String!,
    });

    console.log(res.text);
    */
  }
}

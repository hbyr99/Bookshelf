import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Injectable({
  providedIn: 'root',
})
export class ScanService {
  public scanActive: boolean = false;

  constructor() {}

  // Start barcode scanner
  public async scanBarcode(): Promise<string | null> {
    const c = confirm('Do you want to scan a barcode?');
    const permission = await this.checkPermission();
    if (c && permission) {
      return this.startScan();
    } else {
      return null;
    }
  }

  // Initiate actual scan
  private async startScan(): Promise<string | null> {
    this.scanActive = true;
    BarcodeScanner.hideBackground();
    const result = await BarcodeScanner.startScan();
    this.scanActive = false;
    if (result.hasContent) {
      return result.content!;
    } else {
      return null;
    }
  }

  // Check if permissions were given
  private async checkPermission(): Promise<boolean> {
    // check if user already granted permission
    const status = await BarcodeScanner.checkPermission({ force: false });

    if (status.granted) {
      // user granted permission
      return true;
    }

    if (status.denied) {
      // user denied permission
      const c = confirm(
        'If you want to grant permission for using your camera, enable it in the app settings.'
      );
      if (c) {
        BarcodeScanner.openAppSettings();
      } else {
        return false;
      }
    }

    if (status.neverAsked) {
      // user has not been requested this permission before
      // it is advised to show the user some sort of prompt
      // this way you will not waste your only chance to ask for the permission
      const c = confirm(
        'We need your permission to use your camera to be able to scan barcodes'
      );
      if (!c) {
        return false;
      }
    }

    if (status.restricted || status.unknown) {
      // ios only
      // probably means the permission has been denied
      return false;
    }

    // user has not denied permission
    // but the user also has not yet granted the permission
    // so request it
    const statusRequest = await BarcodeScanner.checkPermission({ force: true });

    if (statusRequest.asked) {
      // system requested the user for permission during this call
      // only possible when force set to true
    }

    if (statusRequest.granted) {
      // the user did grant the permission now
      return true;
    }

    // user did not grant the permission, so he must have declined the request
    return false;
  }
}

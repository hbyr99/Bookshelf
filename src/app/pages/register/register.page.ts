import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public platform: string;
  public registerForm: FormGroup;

  // Create the registration form
  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private data: DataService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    this.platform = Capacitor.getPlatform();
    this.registerForm = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]],
    });
  }

  // Register the user if the information is valid
  public async onRegister(form: FormGroup): Promise<void> {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    try {
      if (form.valid) {
        await this.auth.signupUser(form.value.email, form.value.password);
      } else {
        throw new Error('Invalid email or password');
      }
      loading.dismiss();
      this.router.navigateByUrl('');
    } catch (error) {
      loading.dismiss();
      const alert = await this.alertCtrl.create({
        message: error as string,
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
          },
        ],
      });
      alert.present();
    }
  }

  ngOnInit() {}
}

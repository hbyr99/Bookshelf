import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public platform: string;
  public loginForm: FormGroup;

  // Create the login form
  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    this.platform = Capacitor.getPlatform();
    this.loginForm = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]],
    });
  }

  // Login user if information is valid
  public async onLogin(form: FormGroup): Promise<void> {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    try {
      if (form.valid) {
        await this.auth.loginUser(form.value.email, form.value.password);
      } else {
        throw new Error("Invalid email or password");
      }
      loading.dismiss();
      form.reset();
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

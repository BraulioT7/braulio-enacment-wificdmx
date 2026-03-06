import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationSignal = signal<string | null>(null);
  public message = this.notificationSignal.asReadonly();

  show(msg: string) {
    this.notificationSignal.set(msg);
    setTimeout(() => this.notificationSignal.set(null), 3000);
  }
}
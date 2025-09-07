import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configurar como as notificações devem ser tratadas quando recebidas
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationManager {
  private static notificationId: string | null = null;

  /**
   * Solicita permissões para notificações
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Permissão para notificações negada');
        return false;
      }

      // Configurar canal de notificação no Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('timer-notifications', {
          name: 'Timer Notifications',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          sound: 'default',
        });
      }

      return true;
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
      return false;
    }
  }

  /**
   * Agenda uma notificação local para o final do timer
   */
  static async scheduleTimerNotification(seconds: number): Promise<void> {
    try {
      // Cancela notificação anterior se existir
      await this.cancelNotification();

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '⏰ Timer Finalizado!',
          body: 'Seu tempo de estudo acabou. Hora de fazer uma pausa!',
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: seconds,
        },
      });

      this.notificationId = notificationId;
      console.log(`Notificação agendada para ${seconds} segundos`);
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
    }
  }

  /**
   * Cancela a notificação agendada
   */
  static async cancelNotification(): Promise<void> {
    try {
      if (this.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(this.notificationId);
        console.log('Notificação cancelada');
        this.notificationId = null;
      }
    } catch (error) {
      console.error('Erro ao cancelar notificação:', error);
    }
  }

  /**
   * Cancela todas as notificações agendadas
   */
  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      this.notificationId = null;
      console.log('Todas as notificações foram canceladas');
    } catch (error) {
      console.error('Erro ao cancelar todas as notificações:', error);
    }
  }

  /**
   * Verifica se há notificações agendadas
   */
  static async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Erro ao obter notificações agendadas:', error);
      return [];
    }
  }
}
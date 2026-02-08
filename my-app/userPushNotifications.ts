import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { useRouter, Href } from "expo-router"; // Import Href type
import { useCallback, useEffect, useRef, useState } from "react";

interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: true,
    shouldShowAlert: true,
    shouldShowBanner: true, 
    shouldShowList: true,
  }),
});

export const usePushNotifications = (): PushNotificationState => {
  // State
  const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();

  // Refs
  const notificationListener = useRef<Notifications.EventSubscription | undefined>(undefined);
  const responseListener = useRef<Notifications.EventSubscription | undefined>(undefined);
  const isNavigatingRef = useRef(false);

  const router = useRouter();

  // Helper: Register Device
  async function registerForPushNotificationsAsync() {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }

      try {
        // Project ID is required for Expo Go and EAS
        const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.expoConfig?.extra?.projectId;
        
        token = await Notifications.getExpoPushTokenAsync({
          projectId: projectId, 
        });
      } catch (error) {
        console.error("Error getting push token:", error);
      }
    } else {
      // Optional: Handle simulator case
      // alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  // Helper: Handle Notification Click
  const handleNotificationResponse = useCallback(
    async (response: Notifications.NotificationResponse) => {
      if (isNavigatingRef.current) return;

      const data = response.notification.request.content.data;

      // 1. Validation: Ensure screen exists
      if (!data?.screen) return;

      isNavigatingRef.current = true;

      try {
        // 2. FIX: Cast to 'any' or 'Href' to bypass strict route checking
        // TypeScript doesn't know 'data.screen' is a valid route string.
        router.push({
          pathname: data.screen as Href, 
          params: data.params, // Ensure these are strings!
        } as any); 

      } catch (error) {
        console.error("Error handling notification tap:", error);
      } finally {
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 1000);
      }
    },
    [router]
  );

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    // Listen for notification received (foreground)
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    // Listen for notification interaction (background/tap)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

    return () => {
      // 3. FIX: Use .remove() instead of removeNotificationSubscription
      notificationListener.current && notificationListener.current.remove();
      responseListener.current && responseListener.current.remove();
    };
  }, [handleNotificationResponse]);

  return {
    expoPushToken,
    notification,
  };
};
import { Alert, Platform } from 'react-native';

export const showAlert = (title: string, message: string, onConfirm?: () => void) => {
  if (Platform.OS === 'web') {
    const userConfirmed = window.confirm(`${title}\n${message}`);
    if (userConfirmed && onConfirm) {
      onConfirm();
    }
  } else {
    Alert.alert(title, message, [
      { text: "إلغاء", style: "cancel" },
      { text: "موافق", onPress: onConfirm }
    ]);
  }
};
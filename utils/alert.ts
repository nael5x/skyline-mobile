import { Alert, Platform } from "react-native";

export const showAlert = (message: string, title: string = "") => {
  if (Platform.OS === "web") {
    window.alert(title ? `${title}\n\n${message}` : message);
  } else {
    Alert.alert(title, message);
  }
};

export const showConfirm = (
  message: string,
  onConfirm: () => void,
  options: {
    title?: string;
    confirmText?: string;
    cancelText?: string;
    onCancel?: () => void;
    destructive?: boolean;
  } = {}
) => {
  const {
    title = "",
    confirmText = "نعم",
    cancelText = "إلغاء",
    onCancel,
    destructive = false,
  } = options;

  if (Platform.OS === "web") {
    const ok = window.confirm(title ? `${title}\n\n${message}` : message);
    if (ok) onConfirm();
    else if (onCancel) onCancel();
  } else {
    Alert.alert(title, message, [
      { text: cancelText, style: "cancel", onPress: onCancel },
      {
        text: confirmText,
        style: destructive ? "destructive" : "default",
        onPress: onConfirm,
      },
    ]);
  }
};
import { useEffect } from "react";
import { UNSAFE_NavigationContext } from "react-router-dom";
import { useContext } from "react";

export const useUnsavedChangesWarning = (hasUnsavedChanges, message = "You have unsaved changes. Are you sure you want to leave?") => {
  const { navigator } = useContext(UNSAFE_NavigationContext);

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const push = navigator.push;
    navigator.push = (...args) => {
      const confirm = window.confirm(message);
      if (confirm) {
        navigator.push = push; // restore original
        push(...args);
      }else{
        document.activeElement?.blur(); 
      }
    };

    return () => {
      navigator.push = push;
    };
  }, [hasUnsavedChanges, navigator, message]);
};

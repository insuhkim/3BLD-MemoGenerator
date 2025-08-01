import HomePage from "@/components/HomePage";
import { SettingsProvider } from "@/context/SettingsContext";

export default function Root() {
  return (
    <SettingsProvider>
      <main>
        <HomePage />
      </main>
    </SettingsProvider>
  );
}

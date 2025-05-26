import HomePage from "@/components/HomePage";
import { SettingsProvider } from "@/components/SettingsProvider";

export default function Root() {
  return (
    <SettingsProvider>
      <main>
        <HomePage />
      </main>
    </SettingsProvider>
  );
}

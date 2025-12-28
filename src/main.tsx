import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MembersProvider } from '@/contexts/MembersContext';

createRoot(document.getElementById("root")!).render(
	<MembersProvider>
		<App />
	</MembersProvider>
);

import { Channelwindow } from "../components/Channelwindow";
import { MessageWindow } from "../components/MessageWindow";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <main className="flex">
      <Sidebar />
      <Channelwindow />
      <MessageWindow />
    </main>
  );
}

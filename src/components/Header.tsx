import ConnectWallet from "@/components/ConnectWallet";

export default function Header() {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-800 bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center flex-1">
          {/* Search bar can be added here */}
        </div>
        <div className="flex items-center">
          <ConnectWallet />
        </div>
      </div>
    </div>
  );
}

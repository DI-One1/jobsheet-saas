"use client";

import { UserButton, SignInButton, useUser } from "@clerk/nextjs";

export default function UserProfile() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse ml-2" />;
  }

  return (
    <div className="flex items-center ml-2">
      {isSignedIn ? (
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "w-8 h-8 border border-[#d6e5df] hover:border-[#0d7565] transition-colors shadow-2xs",
            },
          }}
        />
      ) : (
        <SignInButton mode="modal">
          <button className="bg-[#0d7565] hover:bg-[#0a5d50] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-xs cursor-pointer">
            Masuk
          </button>
        </SignInButton>
      )}
    </div>
  );
}

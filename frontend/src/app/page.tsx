"use client";

import IsNotConnected from "@/components/home/IsNotConnected";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function Home() {

    const { isConnected } = useAccount();

    if (!isConnected) {
        return <IsNotConnected />;
    }

    else {
        return <ConnectButton />;
    }
}

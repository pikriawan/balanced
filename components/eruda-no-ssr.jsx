"use client";

import dynamic from "next/dynamic";

const ErudaNoSsr = dynamic(() => import("@/components/eruda"), { ssr: false });

export default ErudaNoSsr;

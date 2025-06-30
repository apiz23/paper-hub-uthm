"use client";

import BlurIn from "@/components/magicui/blur-in";
import HyperText from "@/components/magicui/hyper-text";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RiNextjsFill } from "react-icons/ri";
import { SiTailwindcss, SiTypescript } from "react-icons/si";
import React, { useRef } from "react";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { Library, ServerIcon, User } from "lucide-react";
import Circle from "@/components/circleComp";
import Safari from "@/components/magicui/safari";
import Iphone15Pro from "@/components/magicui/iphone-15-pro";

export default function About() {
    const containerRef = useRef<HTMLDivElement>(null);
    const div1Ref = useRef<HTMLDivElement>(null);
    const div2Ref = useRef<HTMLDivElement>(null);
    const div3Ref = useRef<HTMLDivElement>(null);

    return (
        <>
            <section className="min-h-screen p-4">
                <ScrollArea className="rounded-lg h-[90vh] w-full">
                    <div className="max-w-xl md:max-w-4xl mx-auto px-2 space-y-28">
                        {/* Hero Section */}
                        <div className="text-center mt-20">
                            <HyperText
                                className="text-4xl text-center md:text-7xl font-bold text-black dark:text-white"
                                text="About Paper Hub"
                                duration={100}
                            />
                            <BlurIn
                                word="An unofficial, open-source platform to easily access UTHM's past year papers."
                                className="text-lg md:text-xl font-bold text-neutral-600 dark:text-neutral-400 mt-4"
                            />
                        </div>

                        {/* Tech Stack */}
                        <div className="space-y-10">
                            <BlurIn
                                word="What Tech Powers This?"
                                className="text-3xl md:text-5xl text-center font-bold text-black dark:text-white"
                            />
                            <p className="max-w-2xl text-center mx-auto text-neutral-600 dark:text-neutral-400">
                                Paper Hub is built with a modern, robust tech
                                stack to ensure a fast, reliable, and seamless
                                experience for finding the exam papers you need.
                            </p>
                            <div className="flex justify-center gap-6 md:gap-10">
                                <Badge
                                    variant="outline"
                                    className="rounded-xl bg-neutral-100 dark:bg-neutral-800 p-4 border-black/10 dark:border-white/10"
                                >
                                    <RiNextjsFill className="h-10 md:h-16 w-10 md:w-16 text-black dark:text-white" />
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="rounded-xl bg-neutral-100 dark:bg-neutral-800 p-4 border-black/10 dark:border-white/10"
                                >
                                    <SiTypescript className="h-10 md:h-16 w-10 md:w-16 text-blue-500" />
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="rounded-xl bg-neutral-100 dark:bg-neutral-800 p-4 border-black/10 dark:border-white/10"
                                >
                                    <SiTailwindcss className="h-10 md:h-16 w-10 md:w-16 text-cyan-400" />
                                </Badge>
                            </div>
                        </div>

                        {/* Architecture */}
                        <div className="space-y-6">
                            <BlurIn
                                word="The Architecture"
                                className="text-3xl md:text-5xl text-center font-bold text-black dark:text-white"
                            />
                            <div
                                className="relative mx-auto max-w-2xl flex items-center justify-center md:p-0 p-10"
                                ref={containerRef}
                            >
                                <div className="flex h-full w-full flex-col items-stretch justify-between gap-10">
                                    <div className="flex flex-row justify-between">
                                        <Circle ref={div1Ref}>
                                            <User className="text-black size-7" />
                                        </Circle>
                                        <Circle ref={div2Ref}>
                                            <ServerIcon className="text-black size-7" />
                                        </Circle>
                                        <Circle ref={div3Ref}>
                                            <Library className="text-black size-7" />
                                        </Circle>
                                    </div>
                                </div>
                                <AnimatedBeam
                                    containerRef={containerRef}
                                    fromRef={div1Ref}
                                    toRef={div2Ref}
                                    startYOffset={10}
                                    endYOffset={10}
                                    curvature={-20}
                                />
                                <AnimatedBeam
                                    containerRef={containerRef}
                                    fromRef={div2Ref}
                                    toRef={div3Ref}
                                    startYOffset={10}
                                    endYOffset={10}
                                    curvature={-20}
                                />
                                <AnimatedBeam
                                    containerRef={containerRef}
                                    fromRef={div3Ref}
                                    toRef={div2Ref}
                                    startYOffset={-10}
                                    endYOffset={-10}
                                    curvature={20}
                                    reverse
                                />
                                <AnimatedBeam
                                    containerRef={containerRef}
                                    fromRef={div2Ref}
                                    toRef={div1Ref}
                                    startYOffset={-10}
                                    endYOffset={-10}
                                    curvature={20}
                                    reverse
                                />
                            </div>
                            <div className="flex justify-between max-w-2xl mx-auto px-5 text-center font-semibold text-neutral-700 dark:text-neutral-300">
                                <p className="w-1/3">Your Browser</p>
                                <p className="w-1/3">Next.js API</p>
                                <p className="w-1/3">UTHM Library</p>
                            </div>
                            <p className="max-w-2xl text-center mx-auto text-neutral-600 dark:text-neutral-400 pt-4">
                                When you search for a paper, your request is
                                sent to our Next.js backend. The backend then
                                fetches data from the UTHM digital library,
                                processes it, and sends it back to you.
                            </p>
                        </div>

                        {/* Responsive Design */}
                        <div className="space-y-10 pb-20">
                            <BlurIn
                                className="text-3xl md:text-5xl font-bold text-black dark:text-white text-center"
                                word="Accessible Anywhere"
                            />
                            <div className="px-2">
                                <Safari
                                    url="https://paper-hub-uthm.vercel.app/"
                                    className="size-full"
                                    src="/UI1.png"
                                />
                                <p className="text-center w-full text-2xl font-semibold my-5">
                                    Desktop
                                </p>
                            </div>
                            <div className="px-2">
                                <Iphone15Pro
                                    className="size-1/2 md:size-1/3 mx-auto"
                                    src="/UI2.png"
                                />
                                <p className="text-center w-full text-2xl font-semibold my-5">
                                    Mobile
                                </p>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </section>
        </>
    );
}

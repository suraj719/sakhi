"use client";
import React, { useState, useEffect, useRef } from "react";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { AnimatedList } from "@/components/ui/animated-list";
import { cn } from "@/lib/utils";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";

// Base notifications that will be cycled.
const baseNotifications = [
  {
    name: "Payment received",
    description: "Magic UI",
    time: "15m ago",
    icon: "💸",
    color: "#00C9A7",
  },
  {
    name: "User signed up",
    description: "Magic UI",
    time: "10m ago",
    icon: "👤",
    color: "#FFB800",
  },
  {
    name: "New message",
    description: "Magic UI",
    time: "5m ago",
    icon: "💬",
    color: "#FF3D71",
  },
  {
    name: "New event",
    description: "Magic UI",
    time: "2m ago",
    icon: "🗞️",
    color: "#1E86FF",
  },
];

// Create an initial list by repeating the base notifications.
const initialNotifications = Array.from({ length: 10 }, (_, i) => {
  return baseNotifications[i % baseNotifications.length];
});

// Single Notification component.
const Notification = ({ name, description, icon, color, time }) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex items-center justify-center rounded-2xl p-2"
          style={{ backgroundColor: color }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

// AnimatedNotificationList component that cycles through notifications infinitely.
const AnimatedNotificationList = ({ className }) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cycle notifications every 3 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prev) => {
        // Remove the first notification.
        const newNotifications = prev.slice(1);
        // Get the next notification cyclically.
        const nextNotification = baseNotifications[currentIndex];
        newNotifications.push(nextNotification);
        return newNotifications;
      });
      setCurrentIndex((prev) => (prev + 1) % baseNotifications.length);
    }, 3000); // 3000ms delay for each cycle

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden rounded-lg border bg-background p-2",
        className
      )}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
    </div>
  );
};

// Images to use in the Parallax scroll effect (Ensure these images are in the public directory)
const images = [
  "/1.jpg",
  "/2.jpg",
  "/3.jpg",
  "/1.jpg",
  "/2.jpg",
  "/3.jpg",
  "/1.jpg",
  "/2.jpg",
  "/3.jpg",
  "/1.jpg",
  "/2.jpg",
  "/3.jpg",
];

export default function Home() {
  // Reference to the notification section
  const notificationRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer callback to detect visibility
  const handleIntersection = (entries) => {
    const entry = entries[0];
    setIsVisible(entry.isIntersecting); // Update visibility state based on whether the section is in view
  };

  // Setup IntersectionObserver to detect when the notification section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1, // 10% of the section must be in view for it to be considered "in view"
    });

    if (notificationRef.current) {
      observer.observe(notificationRef.current); // Start observing the section
    }

    return () => {
      if (notificationRef.current) {
        observer.unobserve(notificationRef.current); // Cleanup observer when the component unmounts
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-background">
      {/* Hero Section with Grid Background */}
      <section className="relative min-h-screen flex items-center justify-center pb-24">
        <AnimatedGridPattern
          numSquares={50}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
        />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-center text-6xl font-semibold text-black dark:text-white tracking-tight leading-tight">
            Sakhi: Smart Safety for Women
          </h1>
        </div>
      </section>

      {/* Removed second section here */}

      {/* Third Section with Animated Notification List */}
      <section className="py-24 bg-gray-50" ref={notificationRef}>
        {/* Only show notification when the section is in view */}
        {isVisible && (
          <div className="max-w-[1400px] mx-auto px-8">
            <div className="flex items-start gap-16">
              {/* Content on Left */}
              <div className="w-2/3 space-y-8">
                <h2 className="text-4xl font-bold text-black">
                  Community <span className="text-red-500">Support</span>
                </h2>
                <p className="text-lg text-gray-600">
                  Connect with a supportive network of women who share similar experiences. Access resources, join forums, and participate in safety workshops to stay informed and empowered.
                </p>
              </div>

              {/* Phone on Right with Animated Notification List */}
              <div className="w-1/3 flex justify-center">
                <div className="relative w-[290px] h-[500px] bg-white shadow-2xl rounded-3xl border-8 border-black">
                  {/* Phone Screen */}
                  <div className="absolute top-0 inset-x-0 h-6 bg-gray-100 rounded-t-xl" />
                  <div className="absolute inset-0 bg-white rounded-xl overflow-hidden">
                    <AnimatedNotificationList className="w-full h-full" />
                  </div>
                  {/* Phone Buttons at the Bottom */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-between w-[90%] px-2">
                    <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

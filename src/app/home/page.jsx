"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Phone,
  BookOpen,
  Briefcase,
  Shield,
  ArrowRight,
  Heart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import YouTube from "react-youtube";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      router.push("/login");
    }
  }, [router]);

  const gridItems = [
    {
      title: "Fake Call",
      icon: Phone,
      description: "Quick access to emergency fake calls",
      extraInfo:
        "Our fake call feature provides a discreet way to help you exit uncomfortable situations. Simply input the name and phone number, and we’ll generate a realistic, automated call to your phone. This tool can serve as an excuse to leave a situation quickly and safely, offering peace of mind when you're meeting new people or in uncertain environments.",
      onClick: () => router.push("/phone"),
    },
    {
      title: "Scholarship Community",
      icon: BookOpen,
      description: "Connect with scholarship opportunities",
      extraInfo:
        "Access a curated list of scholarships available for women across various fields and education levels. Our scholarship community keeps you updated on application deadlines, eligibility requirements, and provides tips to create strong applications. Connect with past recipients for guidance and mentorship.",
      onClick: () => router.push("/scholarship"),
    },
    {
      title: "Jobs Community",
      icon: Briefcase,
      description: "Explore career opportunities",
      extraInfo:
        "Discover job listings from companies committed to gender diversity and inclusive workplaces. Our jobs community features roles across experience levels, from entry-level to executive positions. Members can also access resources on resume building, interview preparation, and negotiation skills.",
      onClick: () => router.push("/jobs"),
    },
    {
      title: "NGOs & Women's Safety",
      icon: Shield,
      description: "Emergency helpline numbers",
      content: [
        { number: "1091", info: "Women Helpline (All India)" },
        { number: "181", info: "Women Helpline (Domestic Abuse)" },
        { number: "1098", info: "Child Helpline" },
        { number: "1076", info: "Anti Stalking Helpline" },
      ],
    },
  ];

  return (
    <div className="min-h-screen mt-16 bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r rounded-lg portrait:mx-4 from-black to-[#dc2446] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold">Welcome to Sakhi</h1>
              <p className="text-lg opacity-90 max-w-lg">
                Your trusted companion for safety, opportunities, and community
                support
              </p>
            </div>
            <Heart className="h-24 w-24 text-white animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
          {gridItems.map((item, index) => (
            <Card
              key={index}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-none bg-white shadow-md hover:scale-105 flex flex-col h-full"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-pink-50 p-2 rounded-full">
                    <item.icon className="h-5 w-5 text-[#dc2446]" />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    {item.title}
                  </CardTitle>
                </div>
                <p className="text-sm text-gray-600">{item.description}</p>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                {item.extraInfo && (
                  <p className="text-sm text-gray-600 mb-4">{item.extraInfo}</p>
                )}
                {item.content && (
                  <div className="space-y-3">
                    {item.content.map((subItem, subIndex) => (
                      <div
                        key={subIndex}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <Badge
                          variant="secondary"
                          className="text-[#dc2446] bg-white border border-pink-100 flex items-center justify-center h-6 w-6"
                        >
                          {subItem.number}
                        </Badge>
                        <span className="text-sm text-gray-700 flex-grow mx-3">
                          {subItem.info}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {item.onClick && (
                  <Button
                    onClick={item.onClick}
                    className="w-full bg-[#dc2446] hover:bg-[#dc2446]/90 text-white group-hover:translate-x-1 transition-transform mt-4"
                  >
                    <span>View {item.title}</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-12" />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Helpful Videos</h2>
            <Badge variant="outline" className="text-[#dc2446]">
              Educational Content
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <YouTube
                videoId="KVpxP3ZZtAc"
                className="w-full"
                opts={{
                  width: "100%",
                  playerVars: {
                    autoplay: 0,
                  },
                }}
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <YouTube
                videoId="IDhy-AqBUmQ"
                className="w-full"
                opts={{
                  width: "100%",
                  playerVars: {
                    autoplay: 0,
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

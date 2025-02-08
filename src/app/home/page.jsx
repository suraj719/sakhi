"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Grid } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      icon: "phone",
      onClick: () => router.push("/phone"),
    },
    {
      title: "Scholarship Community",
      icon: "book",
      onClick: () => router.push("/community/67a5442e342e84b3e961440e"),
    },
    {
      title: "Jobs Community",
      icon: "briefcase",
      onClick: () => router.push("/community/67a5442e342e84b3e961440e"),
    },
    {
      title: "NGOs & Women's Safety",
      icon: "shield",
      content: [
        { number: "1091", info: "Women Helpline (All India)" },
        { number: "181", info: "Women Helpline (Domestic Abuse)" },
        { number: "1098", info: "Child Helpline" },
        { number: "100", info: "Police" },
        { number: "1076", info: "Anti Stalking Helpline" },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to Sakhi</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {gridItems.map((item, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {item.title}
                <Grid className="h-6 w-6" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {item.content ? (
                <ul className="space-y-2">
                  {item.content.map((subItem, subIndex) => (
                    <li key={subIndex} className="flex justify-between">
                      <span className="font-bold">{subItem.number}</span>
                      <span>{subItem.info}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <Button onClick={item.onClick} className="w-full">
                  View {item.title}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">Helpful Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <YouTube videoId="KVpxP3ZZtAc" className="w-full" />
        <YouTube videoId="IDhy-AqBUmQ" className="w-full" />
      </div>
    </div>
  );
};

export default HomePage;

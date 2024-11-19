"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { StaticImageData } from "next/image";
import { BadgeCheckIcon, Group, ShareIcon } from "lucide-react";

interface Member {
  id: string;
  name: string;
  avatar: StaticImageData;
  role: string;
}

interface IProps {
  admin: any;
  user: any;
  groupName: string;
  isVerified?: boolean;
  subjectTags: string[];
  members: Member[];
  onJoin?: () => void;
}

const GroupCard = ({
  admin,
  groupName,
  isVerified,
  subjectTags,
  members,
  user,
  onJoin,
}: IProps) => {
  return (
    <Card className="w-full max-w-sm border-secondary/70">
      <CardContent className="pt-4 pb-2 flex flex-col items-center text-center gap-2">
        {/* Name and Verification */}
        <div className="flex items-center gap-1">
          <h3 className="font-semibold text-lg">{groupName}</h3>
          {isVerified && <BadgeCheckIcon className="w-5 h-5 text-blue-500" />}
        </div>

        {/* Group Subject */}
        <div className="flex items-center gap-2 w-full overflow-auto">
          {subjectTags.map((item) => (
            <div
              key={item}
              className="text-sm text-gray-600 p-2 bg-primary rounded-sm"
            >
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>

        {/* Team Members */}
        <div className="flex justify-around items-center gap-16 mt-2">
          <div className="flex flex-col items-center justify-center">
            <Avatar className="border-2 border-background w-6 h-6">
              <AvatarImage src={admin.avatar} alt={admin.name} />
              <AvatarFallback className="text-sm">
                {admin.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-muted-foreground mt-1">AMDIN</p>
          </div>
          <div>
            <div className="flex -space-x-2 justify-center">
              {members.map((member) => (
                <Avatar
                  key={member.id}
                  className="border-2 border-background w-6 h-6"
                >
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="text-sm">
                    {member?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-1">MEMBERS</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="text-center">
            <p className="text-lg font-semibold">
              {members.filter((member) => member.role == "TEACHER").length}
            </p>
            <p className="text-sm text-muted-foreground">Teachers</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">
              {members.filter((member) => member.role == "STUDENT").length}
            </p>
            <p className="text-sm text-muted-foreground">Students</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">
              {members.filter((member) => member.role == "PARENT").length}
            </p>
            <p className="text-sm text-muted-foreground">Parents</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-center gap-6">
        <Button
          variant={
            members.find((member) => member.name == user?.name)
              ? "outline"
              : "secondary"
          }
          className="px-8 py-2 text-sm"
          onClick={onJoin}
        >
          {members.find((member) => member.name == user?.name)
            ? "Joined"
            : "Join"}
        </Button>
        <Button
          className="px-8 py-2"
          variant={
            members.find((member) => member.name == user?.name)
              ? "outline"
              : "secondary"
          }
        >
          <ShareIcon className="w-4 h-4 mr-2" />
          <span className="text-sm">Share Now</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GroupCard;

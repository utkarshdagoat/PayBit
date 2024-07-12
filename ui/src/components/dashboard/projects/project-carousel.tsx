import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ClipboardDocumentListIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { useState } from "react";

import { Project } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

export default function ProjectCarousel(props: { projects: Project[] }) {
  console.log(props.projects);
  const [selectedIndex, setIndex] = useState(0);
  const selectedProject = props.projects[selectedIndex];
  console.log(selectedProject);
  const { toast } = useToast();
  // console.log(props.projects);
  return (
    <>
      {props.projects.length ? (
        <>
          <h1 className="text-2xl text-accent-foreground mt-10 mb-2 font-bold">
            Your Projects
          </h1>
          <div className="grid grid-cols-5 mt-12 gap-12">
            <Carousel orientation="vertical" className="col-span-2">
              <CarouselContent>
                {props.projects.map((project, index) => {
                  return (
                    <CarouselItem
                      className="md:basis-1/2 lg:basis-1/4"
                      onClick={() => setIndex(index)}
                    >
                      <div className="p-1">
                        <Card
                          className={clsx(
                            `text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-white cursor-pointer`,
                            {
                              "bg-accent text-white": selectedIndex === index,
                            },
                          )}
                        >
                          <CardContent className="flex items-center justify-center p-6">
                            <span className="text-xl font-semibold">
                              {project.name}
                            </span>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>

            <Card className=" max-w-lg col-span-3">
              <CardHeader>
                <CardTitle>
                  API Credentials for{" "}
                  <span className="text-primary">{selectedProject.name}</span>
                </CardTitle>
                <CardDescription>{selectedProject.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="appId">App ID</Label>
                  <Input
                    id="appId"
                    value={selectedProject.id.toString()}
                    readOnly
                  />
                </div>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label htmlFor="clientSecret">Client Secret</Label>
                    <Input
                      id="clientSecret"
                      value={selectedProject.clientSecret}
                      readOnly
                    />
                  </div>
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        selectedProject.clientSecret,
                      );
                      toast({
                        description: "Copied to clipboard",
                      });
                    }}
                    size={"icon"}
                  >
                    <ClipboardDocumentListIcon className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="w-full h-[70%] flex justify-center items-center">
          <h1 className="text-4xl text-white/30 mt-10 mb-2 font-bold">
            Create a project to get started :D
          </h1>
        </div>
      )}
    </>
  );
}

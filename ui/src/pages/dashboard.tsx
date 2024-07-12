import SideNav from "@/components/dashboard/sidenav/side-nav";

import { Project } from "@/lib/types";
import { useEffect, useState } from "react";
import { DASHBOARD_API } from "@/lib/endpoints";
import axios from "axios";
import { SideNavState } from "@/lib/types";

import {
  CodeBracketSquareIcon,
  CreditCardIcon,
  LinkIcon,
} from "@heroicons/react/16/solid";

import Exchange from "@/components/payments/exchange";
import ApiDashboard from "@/components/dashboard/api-dashboard";

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([
    {
      name: "Pulsar",
      clientSecret: "a8d7f6e5c4b3a2d1",
      id: 1,
      description:
        "A revolutionary container runtime that optimizes performance and security.",
      createdAt: new Date("2024-01-15T10:30:00Z"),
    },
    {
      name: "Orion",
      clientSecret: "b7c6d5e4f3a2b1c0",
      id: 2,
      description:
        "A cloud-native monitoring solution for scalable applications.",
      createdAt: new Date("2024-02-20T14:45:00Z"),
    },
    {
      name: "Nebula",
      clientSecret: "c6d5e4f3b2a1c0d9",
      id: 3,
      description:
        "A next-generation data analytics platform for real-time insights.",
      createdAt: new Date("2024-03-25T09:00:00Z"),
    },
    {
      name: "Andromeda",
      clientSecret: "d5e4f3b2a1c0d9e8",
      id: 4,
      description: "An advanced AI-driven automation tool for IT operations.",
      createdAt: new Date("2024-04-30T16:20:00Z"),
    },
    {
      name: "Phoenix",
      clientSecret: "e4f3b2a1c0d9e8f7",
      id: 5,
      description:
        "A powerful CI/CD pipeline tool for continuous integration and deployment.",
      createdAt: new Date("2024-05-10T12:10:00Z"),
    },
  ]);
  const [projectAdded, setProjectAdded] = useState<boolean>(false);

  const sideNavStates: SideNavState[] = [
    {
      label: "API",
      icon: CodeBracketSquareIcon,
      component: (
        <ApiDashboard
          projectAdded={projectAdded}
          setProjectAdded={setProjectAdded}
          projects={projects}
        />
      ),
    },
    { label: "Pay", icon: CreditCardIcon, component: <Exchange /> },
    { label: "Docs", icon: LinkIcon, href: "https://google.com" },
  ];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const call = async () => {
      const res = await axios.get(DASHBOARD_API, {
        withCredentials: true,
      });
      const data = await res.data;
      const projectsList: Project[] = data;
      console.log(projectsList);
      // setProjects(projectsList);
    };
    call();
  }, [projectAdded]);
  return (
    <>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav
            sideNavStates={sideNavStates}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        </div>
        <div className="flex-grow flex justify-center items-center p-6 md:overflow-y-auto md:p-12">
          {sideNavStates[activeIndex].component}
        </div>
      </div>
    </>
  );
}

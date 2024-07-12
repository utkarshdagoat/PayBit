export interface Project {
  name: string;
  clientSecret: string;
  id: number;
  description: string;
  createdAt: Date;
  appId: string;
}

export interface SideNavState {
  label: string;
  icon: any;
  component?: JSX.Element;
  href?: string;
}

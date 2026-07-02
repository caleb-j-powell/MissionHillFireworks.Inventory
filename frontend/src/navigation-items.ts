import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";

export type NavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
};

export const navItems: NavItem[] = [
  { label: "Home", path: "/", icon: <HomeIcon /> },
  { label: "Search", path: "/search", icon: <SearchIcon /> },
  { label: "Favorites", path: "/favorites", icon: <FavoriteIcon /> },
  { label: "Profile", path: "/profile", icon: <PersonIcon /> },
];
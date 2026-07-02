import * as React from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import { useLocation, useNavigate } from "react-router-dom";

type RouteMap = {
  label: string;
  path: string;
  icon: React.ReactNode;
};

const routes: RouteMap[] = [
  { label: "Home", path: "/", icon: <HomeIcon /> },
  { label: "Search", path: "/search", icon: <SearchIcon /> },
  { label: "Favorites", path: "/favorites", icon: <FavoriteIcon /> },
  { label: "Profile", path: "/profile", icon: <PersonIcon /> },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentIndex = routes.findIndex(r => r.path === location.pathname);
  const value = currentIndex === -1 ? 0 : currentIndex;

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    navigate(routes[newValue].path);
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
      }}
      elevation={3}
    >
      <BottomNavigation value={value} onChange={handleChange}>
        {routes.map((route) => (
          <BottomNavigationAction
            key={route.path}
            label={route.label}
            icon={route.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
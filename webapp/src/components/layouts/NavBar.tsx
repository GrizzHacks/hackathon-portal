import {
  AppBar,
  createStyles,
  IconButton,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
  Toolbar,
  Typography,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MenuIcon from "@material-ui/icons/Menu";
import React from "react";
import { useHistory } from "react-router-dom";
import { firebaseApp } from "../../config/firebaseConfig";
import { NotificationMessage } from "../misc/Notifications";
import SquareAvatar from "../misc/SquareAvatar";
import LeftMenu from "./LeftMenu";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

declare interface NavBarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
  pageTitle: string;
  setNotification: (notification: NotificationMessage) => void;
}

const NavBar: React.FunctionComponent<NavBarProps> = ({
  theme,
  toggleTheme,
  pageTitle,
  setNotification,
}) => {
  const classes = useStyles();
  const routeHistory = useHistory();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [
    currentUserProfile,
    setCurrentUserProfile,
  ] = React.useState<firebase.default.User | null>(null);
  const [firebaseAuthListener, setFirebaseAuthListener] = React.useState(
    firebaseApp.auth().onAuthStateChanged((user) => {
      setCurrentUserProfile(user);
    })
  );
  const open = Boolean(anchorEl);

  const [leftMenuOpen, setLeftMenuOpen] = React.useState<boolean>(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            onClick={() => {
              setLeftMenuOpen(!leftMenuOpen);
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {pageTitle ? `${pageTitle} - ` : ""}Hackathon Portal
          </Typography>

          <div>
            <IconButton
              aria-label="Toggle light/dark theme"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleTheme}
              color="inherit"
            >
              {theme === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              {currentUserProfile ? (
                <div style={{ width: "24px", height: "24px" }}>
                  <SquareAvatar
                    alt={
                      currentUserProfile?.displayName
                        ? currentUserProfile.displayName
                        : ""
                    }
                    src={
                      currentUserProfile?.photoURL
                        ? currentUserProfile.photoURL
                        : ""
                    }
                    centerInContainer={true}
                    maxHeightPercentageOfScreen={50}
                    maxWidthPercentageOfParent={100}
                    maxWidthPercentageOfScreen={50}
                  />
                </div>
              ) : (
                <AccountCircleIcon />
              )}
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleClose}
            >
              {(currentUserProfile
                ? [
                    {
                      key: "profile_top_right_menu",
                      menuLabel: "Profile",
                      menuIcon: AccountCircleIcon,
                      route: "/profile",
                    },
                    {
                      key: "logout_top_right_menu",
                      menuLabel: "Logout",
                      menuIcon: ExitToAppIcon,
                      route: "/logout",
                    },
                  ]
                : [
                    {
                      key: "login_top_right_menu",
                      menuLabel: "Login",
                      menuIcon: ExitToAppIcon,
                      route: "/login",
                    },
                  ]
              ).map((item) => {
                const Icon = item.menuIcon;
                return (
                  <MenuItem
                    key={item.key}
                    onClick={() => {
                      routeHistory.push(item.route);
                      handleClose();
                    }}
                  >
                    <ListItemIcon>
                      <Icon />
                    </ListItemIcon>
                    <ListItemText primary={item.menuLabel} />
                  </MenuItem>
                );
              })}
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <LeftMenu
        open={leftMenuOpen}
        setOpen={setLeftMenuOpen}
        currentUserProfile={currentUserProfile}
        setNotification={setNotification}
      />
    </div>
  );
};

export default NavBar;

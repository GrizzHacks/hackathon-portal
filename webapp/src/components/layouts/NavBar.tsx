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
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import React from "react";
import SquareAvatar from "../misc/SquareAvatar";

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
  currentUserProfile: any | null;
  pageTitle: string;
  backFunction?: () => void;
}

const NavBar: React.FunctionComponent<NavBarProps> = ({
  theme,
  toggleTheme,
  currentUserProfile,
  pageTitle,
  backFunction,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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
          {backFunction && (
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="back"
              onClick={backFunction}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
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
                      currentUserProfile?.photoUrl
                        ? currentUserProfile.photoUrl
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
              {[
                {
                  menuLabel: "Login",
                  menuIcon: ExitToAppIcon,
                },
              ].map((item) => {
                const Icon = item.menuIcon;
                return (
                  <MenuItem
                    onClick={() => {
                      // TODO: Actually do something on click...
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
    </div>
  );
};

export default NavBar;

import {
  faEdit,
  faAdd,
  faRemove,
  faCog,
  faPlusSquare,
} from "@fortawesome/free-solid-svg-icons";

export const navigationMenu = [
  {
    id: "Fashion",
    value: "Fashion",
    /*  items: [
      { id: "personal", value: "Personal" },
      { id: "personal-alt", value: "Personal Alt" },
      { id: "classic", value: "Classic" },
      { id: "minimal", value: "Minimal" },
    ], */
  },
  {
    id: "lifestyle",
    value: "Lifestyle",
  },
  {
    id: "culture",
    value: "Culture",
  },
  {
    id: "entertainment",
    value: "Entertainment",
    items: [{ id: "sports", value: "Sports" }],
  },
  {
    id: "more",
    value: "More",
  },
];

export const adminMenu = [
  {
    id: "post-list",
    value: "All Posts",
    icon: faEdit,
  },

  {
    id: "manage-users",
    value: "Manage Users",
    icon: faCog,
  },
  {
    id: "add-category",
    value: "Add Category",
    icon: faPlusSquare,
  },
];

export const userMenu = [
  {
    id: "post-list",
    value: "All Posts",
    icon: faEdit,
  },
];
